window.myMetricView = countlyView.extend({

    //initalize out model
    beforeRender: function () {
        myMetric.initialize()
    },

    renderCommon: function (isRefresh) {
        var tableData = myMetric.getTableData();
        var chartData = myMetric.getChartData();
        this.templateData = {
            "page-title": "My Metric",
            "no-data": jQuery.i18n.map["common.bar.no-data"],
            topMetric: myMetric.getTopMetricName()
        };

        if (!isRefresh) {
            countlyCommon.drawTimeGraph(chartData.chartDP, "#dashboard-graph");
            $(this.el).html(this.template(this.templateData));

            //create datatable with chart data
            this.dtable = $('.d-table').dataTable($.extend({}, $.fn.dataTable.defaults, {
                //provide data to datatables
                "aaData": tableData,

                //specify which columns to show
                "aoColumns": [
                    {
                        "mData": "date",
                        "mRender": function (d) {
                            return d;
                        }, "sTitle": "DATE"
                    },
                    {
                        "mData": "my_metric_count",
                        "mRender": function (d) { return d },
                        "sTitle": "COUNT"
                    }
                ]
            }));

            //make table headers sticky
            $(".d-table").stickyTableHeaders();
        }
    },
});

//create view
app.myMetricView = new myMetricView();

//register route
app.route("/my-metric", "my-metric", function () {
    this.renderWhenReady(this.myMetricView);
});

$(document).ready(function () {
    var menu =
        '<a href="#/my-metric" class="item" ">' +
        '<div class="logo fa fa-cubes" style="background-image:none; font-size:24px; text-align:center; width:35px; margin-left:14px; line-height:42px;"></div>' +
        '<div class="text" data-localize="my-metric.title">My Metric</div>' +
        "</a>";

    if ($(".sidebar-menu #management-menu").length)
        $(".sidebar-menu #management-menu").before(menu);
    else $(".sidebar-menu").append(menu);
});
