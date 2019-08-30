(function (myMetric, $) {
    //we will store our data here
    var _data = {},
        mapData = {
            chartDP: [],
            chartData: []
        };

    //Initializing model
    myMetric.initialize = function () {
        //returning promise
        return $.ajax({
            type: "GET",
            url: "/o/my-metric",
            data: {
                //providing current user's api key
                api_key: countlyGlobal.member.api_key,
                //providing current app's id
                app_id: countlyCommon.ACTIVE_APP_ID,
                //specifying method param
                method: "myMetric"
            },
            success: function (json) {
                //got our data, let's store it
                _data = json.data;
                myMetric.processAndSaveData(json.data);

            }
        });
    };


    myMetric.processAndSaveData = function (data) {
        var _map = {};
        var secondsInADay = 24 * 60 * 60 * 1000;
        (data || []).forEach((dataPoint) => {
            var timeStamp = Math.floor(dataPoint.ts / secondsInADay) * secondsInADay;
            console.log(timeStamp)
            if (_map[timeStamp]) {
                _map[timeStamp] = _map[timeStamp] + Number(dataPoint.my_metric_count)
            } else {
                _map[timeStamp] = Number(dataPoint.my_metric_count)
            }
        })

        var sortedKeys = Object.keys(_map).sort((item1, item2) => {
            return item1 > item2
        })

        sortedKeys.forEach((timeStamp) => {
            mapData.chartData.push({
                date: moment(Number(timeStamp)).format('DD MMM'),
                my_metric_count: _map[timeStamp]
            })
        })

        mapData.chartDP.push({
            label: "Total occurences",
            color: "#DDDDDD",
            data: [[]]
        })
    }

    myMetric.getChartData = function () {
        return mapData;
    };

    //return data that we have
    myMetric.getTableData = function () {
        return mapData.chartData || [];
    };
})((window.myMetric = window.myMetric || {}), jQuery);
