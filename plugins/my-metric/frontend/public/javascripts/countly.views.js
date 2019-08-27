window.myMetricView = countlyView.extend({
    //initalize out model
    beforeRender: function() {
        if (this.template) {
            return $.when(myMetric.initialize()).then(function() {});
        } else {
            var self = this;
            return $.when(
                $.get(
                    countlyGlobal.path + "/my-metric/templates/my-metric.html",
                    function(src) {
                        self.template = Handlebars.compile(src);
                    }
                ),
                myMetric.initialize()
            ).then(function() {});
        }
    },

    renderCommon: function(isRefresh) {
        var crashData = myMetric.getData();
        var chartData = myMetric.getChartData();
        this.templateData = {
            "page-title": jQuery.i18n.map["myMetric.title"],
            "no-data": jQuery.i18n.map["common.bar.no-data"]
        };

        countlyCommon.drawTimeGraph(chartData.chartDP, "#dashboard-graph");
        chartData = myMetric.getChartData();
        $(this.el).html(this.template(this.templateData));
    }
});

//create view
app.myMetricView = new myMetricView();

//register route
app.route("/my-metric", "my-metric", function() {
    this.renderWhenReady(this.myMetricView);
});

$(document).ready(function() {
    var menu =
        '<a href="#/my-metric" class="item" ">' +
        '<div class="logo fa fa-cubes" style="background-image:none; font-size:24px; text-align:center; width:35px; margin-left:14px; line-height:42px;"></div>' +
        '<div class="text" data-localize="my-metric.title">My Metric</div>' +
        "</a>";

    if ($(".sidebar-menu #management-menu").length)
        $(".sidebar-menu #management-menu").before(menu);
    else $(".sidebar-menu").append(menu);
});
