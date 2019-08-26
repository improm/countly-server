window.myMetricView = countlyView.extend({
    //need to provide at least empty initialize function
    //to prevent using default template
    initialize: function () {
        //we can initialize stuff here
    },

    beforeRender: function () {
        //check if we already have template
        if (this.template)
            //then lets initialize our mode
            return $.when(myMetric.initialize()).then(function () { });
        else {
            //else let's fetch our template and initialize our mode in paralel
            var self = this;
            return $.when(
                $.get(
                    countlyGlobal["path"] + "/ourplugin/templates/default.html",
                    function (src) {
                        //precompiled our template
                        self.template = Handlebars.compile(src);
                    }
                ),
                myMetric.initialize()
            ).then(function () { });
        }
    },

    //here we need to render our view
    renderCommon: function () {
        //provide template data
        this.templateData = {
            "page-title": "My Metric",
            "logo-class": "",
            data: myMetric.getData()
        };

        //populate template with data and attach it to page's content element
        $(this.el).html(this.template(this.templateData));
    },

    //here we need to refresh data
    refresh: function () {
        var self = this;
        $.when(myMetric.initialize()).then(function () {
            //our view is not active
            if (app.activeView != self) {
                return false;
            }

            //here basically we want to do the same we did in renderCommon method
            self.renderCommon();
        });
    }
});

//create view
app.myMetricView = new myMetricView();

//register route
app.route("/my-metric", "my-metric", function () {
    this.renderWhenReady(this.myMetricView);
});


$(document).ready(function () {
    var menu = '<a href="#/my-metric" class="item" ">' +
        '<div class="logo fa fa-cubes" style="background-image:none; font-size:24px; text-align:center; width:35px; margin-left:14px; line-height:42px;"></div>' +
        '<div class="text" data-localize="my-metric.title">My Metric</div>' +
        '</a>';

    if ($('.sidebar-menu #management-menu').length)
        $('.sidebar-menu #management-menu').before(menu);
    else
        $('.sidebar-menu').append(menu);
});