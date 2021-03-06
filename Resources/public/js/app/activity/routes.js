'use strict';

/**
 * Dime - app/activity/routes.js
 */
(function ($, App) {

    App.menu.add({
        id:"activity",
        title:"Activity",
        route:"activity",
        weight:-20,
        callback:function () {
            App.menu.activateItem('activity');
            App.router.switchView(new App.Views.Activity.Index());
        }
    });
    App.session.set('default-backlink', 'activity');

    // Define Routes
    App.router.route("activity/add", "activity:add", function () {
        var model = new App.Model.Activity();

        App.menu.activateItem('activity');
        App.router.switchView(new App.Views.Activity.Form({
            defaults:{
                title:'Add Activity',
                template:'DimeTimetrackerFrontendBundle:Activities:form',
                templateEl:'#activity-form',
                backNavigation:'activity'
            },
            model:model
        }));
    });

    App.router.route("activity/:id/edit", "activity:edit", function (id) {
        var model = new App.Model.Activity({id:id});
        model.fetch({async:false});

        App.menu.activateItem('activity');
        App.router.switchView(new App.Views.Activity.Form({
            defaults:{
                title:'Edit Activity',
                template:'DimeTimetrackerFrontendBundle:Activities:form',
                templateEl:'#activity-form',
                backNavigation:'activity'
            },
            model:model
        }));
    });

})(jQuery, Dime);
