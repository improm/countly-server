// (function(myMetric, $) {
//     //we will store our data here
//     var _data = {};

//     //Initializing model
//     myMetric.initialize = function() {
//         //returning promise
//         return $.ajax({
//             type: "GET",
//             url: "/o",
//             data: {
//                 //providing current user's api key
//                 api_key: countlyGlobal.member.api_key,
//                 //providing current app's id
//                 app_id: countlyCommon.ACTIVE_APP_ID,
//                 //specifying method param
//                 method: "ourplugin"
//             },
//             success: function(json) {
//                 //got our data, let's store it
//                 _data = json;
//             }
//         });
//     };

//     //return data that we have
//     myMetric.getData = function() {
//         return _data;
//     };
// })((window.myMetric = window.myMetric || {}), jQuery);


CountlyHelpers.createMetricModel(window.myMetric = window.myMetric || {}, "myMetric", jQuery);
