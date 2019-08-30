(function (myMetric, $) {
    //we will store our data here
    var _data = {},
        topMetricValue,
        topMetricName,
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
        var _individualMetricMap = {};
        var _topMetricValue = 0;
        var _topMetricName;


        (data || []).forEach((dataPoint) => {
            var timeStamp = Math.floor(dataPoint.ts / secondsInADay) * secondsInADay;
            if (_map[timeStamp]) {
                _map[timeStamp] = _map[timeStamp] + Number(dataPoint.my_metric_count)
            } else {
                _map[timeStamp] = Number(dataPoint.my_metric_count)
            }

            if (Object.hasOwnProperty.call(_individualMetricMap, [dataPoint.my_metric])) {
                _individualMetricMap[dataPoint.my_metric] = _individualMetricMap[dataPoint.my_metric] + 1
            } else {
                _individualMetricMap[dataPoint.my_metric] = 0
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

        console.log(_individualMetricMap)

        var sortedKeys = Object.keys(_individualMetricMap).forEach((metricName) => {
            if (_individualMetricMap[metricName] > _topMetricValue) {
                _topMetricValue = _individualMetricMap[metricName];
                _topMetricName = metricName;
            }
        })

        topMetricValue = _topMetricValue;
        topMetricName = _topMetricName;

        console.log("top values", topMetricValue, topMetricName)
    }

    myMetric.getTopMetricName = function () {
        return topMetricName;
    };

    myMetric.getTopMetricValue = function () {
        return topMetricName;
    };

    myMetric.getChartData = function () {
        return mapData;
    };

    //return data that we have
    myMetric.getTableData = function () {
        return mapData.chartData || [];
    };
})((window.myMetric = window.myMetric || {}), jQuery);
