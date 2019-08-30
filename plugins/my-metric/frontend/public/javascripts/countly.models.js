(function(myMetric, $) {
    //we will store our data here
    var _data = {},
        topMetricValue,
        topMetricName,
        mapData = {
            chartDP: [],
            chartData: []
        };

    //Initializing model
    myMetric.initialize = function() {
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
            success: function(json) {
                //got our data, let's store it
                _data = json.data;
                myMetric.processAndSaveData(json.data);
            }
        });
    };

    myMetric.processAndSaveData = function(data) {
        /**
         * will be used to find all events accepted in same day
         */
        var _map = {};
        var secondsInADay = 24 * 60 * 60 * 1000;

        /**
         * to find out the metric received maximum number of times and its count
         */
        var _individualMetricMap = {};

        /**
         * temporary values to get the metric received max no of times
         */
        var _topMetricValue = 0;
        var _topMetricName;

        (data || []).forEach(function(dataPoint) {
            /**
             * floor timestamps in a day to 12am of that day. So that they can be merged
             */
            var timeStamp =
                Math.floor(dataPoint.ts / secondsInADay) * secondsInADay;

            // Build a hashmap of unique timestamps
            if (_map[timeStamp]) {
                _map[timeStamp] =
                    _map[timeStamp] + Number(dataPoint.my_metric_count);
            } else {
                _map[timeStamp] = Number(dataPoint.my_metric_count);
            }

            // build a hashmap of all unique events and counts
            if (
                Object.hasOwnProperty.call(_individualMetricMap, [
                    dataPoint.my_metric
                ])
            ) {
                _individualMetricMap[dataPoint.my_metric] =
                    _individualMetricMap[dataPoint.my_metric] +
                    dataPoint.my_metric_count;
            } else {
                _individualMetricMap[dataPoint.my_metric] = 0;
            }
        });

        /**
         * Create graph to be plotted in an increasing timestamp value
         */
        var sortedKeys = Object.keys(_map).sort(function(item1, item2) {
            return item1 > item2;
        });
        sortedKeys.forEach(function(timeStamp) {
            mapData.chartData.push({
                date: moment(Number(timeStamp)).format("DD MMM"),
                my_metric_count: _map[timeStamp]
            });
        });

        mapData.chartDP.push({
            label: "Total occurences",
            color: "#DDDDDD",
            data: [[]]
        });

        // Finding out the event that occured maximum number of times
        Object.keys(_individualMetricMap).forEach(function(metricName) {
            if (_individualMetricMap[metricName] > _topMetricValue) {
                _topMetricValue = _individualMetricMap[metricName];
                _topMetricName = metricName;
            }
        });

        topMetricValue = _topMetricValue;
        topMetricName = _topMetricName;

        console.log("top values", topMetricValue, topMetricName);
    };

    myMetric.getTopMetricName = function() {
        return topMetricName;
    };

    myMetric.getTopMetricValue = function() {
        return topMetricName;
    };

    myMetric.getChartData = function() {
        return mapData;
    };

    //return data that we have
    myMetric.getTableData = function() {
        return mapData.chartData || [];
    };
})((window.myMetric = window.myMetric || {}), jQuery);
