window.myMetricView = countlyView.extend({
    //initalize out model
    beforeRender: function() {
        return $.when(myMetric.initialize()).then(function() {});
    },

    //render our data
    renderCommon: function(isRefresh) {
        var data = myMetric.getData();

        //prepare template data
        this.templateData = {
            "page-title": jQuery.i18n.map["ourmetric.title"],
            "logo-class": "",
            "graph-type-double-pie": true,
            "pie-titles": {
                left: jQuery.i18n.map["common.total-users"],
                right: jQuery.i18n.map["common.new-users"]
            }
        };

        //if loading first time and not refershing
        if (!isRefresh) {
            //build template with data
            $(this.el).html(this.template(this.templateData));

            //create datatable with chart data
            this.dtable = $(".d-table").dataTable(
                $.extend({}, $.fn.dataTable.defaults, {
                    //provide data to datatables
                    aaData: data.chartData,

                    //specify which columns to show
                    aoColumns: [
                        {
                            mData: "ourmetric",
                            sType: "session-duration",
                            sTitle: jQuery.i18n.map["ourmetric.title"]
                        },
                        {
                            mData: "t",
                            sType: "formatted-num",
                            mRender: function(d) {
                                return countlyCommon.formatNumber(d);
                            },
                            sTitle:
                                jQuery.i18n.map["common.table.total-sessions"]
                        },
                        {
                            mData: "u",
                            sType: "formatted-num",
                            mRender: function(d) {
                                return countlyCommon.formatNumber(d);
                            },
                            sTitle: jQuery.i18n.map["common.table.total-users"]
                        },
                        {
                            mData: "n",
                            sType: "formatted-num",
                            mRender: function(d) {
                                return countlyCommon.formatNumber(d);
                            },
                            sTitle: jQuery.i18n.map["common.table.new-users"]
                        }
                    ]
                })
            );

            //make table headers sticky
            $(".d-table").stickyTableHeaders();

            //draw chart with total data
            countlyCommon.drawGraph(
                data.chartDPTotal,
                "#dashboard-graph",
                "pie"
            );

            //draw chart with new data
            countlyCommon.drawGraph(
                data.chartDPNew,
                "#dashboard-graph2",
                "pie"
            );
        }
    },

    //refreshing out chart
    refresh: function() {
        var self = this;
        $.when(myMetric.refresh()).then(function() {
            //not our view
            if (app.activeView != self) {
                return false;
            }

            //populate and regenerate template data
            self.renderCommon(true);

            //replace existing elements in view with new data
            newPage = $("<div>" + self.template(self.templateData) + "</div>");
            $(self.el)
                .find(".dashboard-summary")
                .replaceWith(newPage.find(".dashboard-summary"));

            var data = myMetric.getData();

            //refresh charts
            countlyCommon.drawGraph(
                data.chartDPTotal,
                "#dashboard-graph",
                "pie"
            );
            countlyCommon.drawGraph(
                data.chartDPNew,
                "#dashboard-graph2",
                "pie"
            );

            //refresh datatables
            CountlyHelpers.refreshTable(self.dtable, data.chartData);
        });
    }
});

//create view
app.myMetricView = new myMetricView();

//register route
app.route("/my-metric", "my-metric", function() {
    this.renderWhenReady(this.myMetricView);
});
