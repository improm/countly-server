var plugin = {},
    plugins = require("../../pluginManager.js"),
    countlyCommon = require('../../../api/lib/countly.common.js'),
    common = require('../../../api/utils/common.js');

(function (plugin) {


    plugins.register("/i/my-metric", function (obj) {

        //get request parameters
        var paramInstance = obj.params,
            validateUserForWriteAPI = obj.validateUserForWriteAPI;

        // Validate if user has provided correct params in request
        validateUserForWriteAPI(function (params) {
            const queryStringValidations = {
                app_key: {
                    required: true,
                    type: "String"
                },
                device_id: {
                    required: true,
                    type: ""
                },
                my_metric: {
                    required: true,
                    type: "String"
                },
                my_metric_count: {
                    required: true,
                    type: "String"
                }
            };
            const isValidRequest = common.validateArgs(
                params.qstring,
                queryStringValidations
            );

            if (isValidRequest) {
                const { my_metric, my_metric_count } = params.qstring;

                const dataToInsert = {
                    my_metric,
                    my_metric_count,
                    ts: new Date().getTime() // ** NOTE
                };

                /** 
              NOTE: The dashboard displays data at day level. So we can take a call if  we can
             floor this timeStamp to save day only.
             This will make read queries faster. But then we would loose precision. 
             And if in future we are asked an hourly/minute analysis it won't be possible
             **/
                common.db
                    .collection("myMetric")
                    .insert(dataToInsert, function (err) {
                        if (err) {
                            common.returnMessage(params, 500, err);
                            return false;
                        } else {
                            common.returnMessage(params, 200, "Success");
                            return true;
                        }
                    });
            }
            else {
                // log using log utility maybe
                common.returnOutput(params, { error: "Not enough args" });
                return false;
            }
        }, paramInstance);

        return true;
    });

    plugins.register("/o/my-metric", function (obj) {
        const params = obj.params;
        obj.validateUserForDataReadAPI(params, function () {
            var periodObj = countlyCommon.getPeriodObj(params);

            const isValidRequest = !!(periodObj.start && periodObj.end);

            if (isValidRequest) {
                common.db
                    .collection("myMetric")
                    .find({ ts: countlyCommon.getTimestampRangeQuery(params) })
                    .toArray(function (err, items) {
                        if (err) {
                            common.returnMessage(params, 400, err);
                            return false;
                        }
                        else {
                            common.returnOutput(params, {
                                data: items
                            });
                            common.returnMessage(params, 200, "Success");
                            return true;
                        }
                    });
            }
            else {
                // log using log utility maybe
                common.returnOutput(params, { error: "Not enough args" });
                return false;
            }
        });
        return true;
    });
})(plugin);

module.exports = plugin;
