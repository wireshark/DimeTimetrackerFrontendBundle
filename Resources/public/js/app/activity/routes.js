'use strict';

/**
 * Dime - app/activity/routes.js
 */
(function ($, App) {

    App.menu({
        name:"activity",
        title:"Activity",
        route:"activity",
        weight:-20,
        active:true,
        callback:function () {
            App.UI.menu.activateItem('activity');
            App.UI.router.switchView(new App.Views.Activity.Index());
        }
    });

    // Define Routes
    App.route("activity:add", "activity/add", function () {
        var model = new App.Model.Activity();

        App.UI.menu.activateItem('activity');
        App.UI.router.switchView(new App.Views.Activity.Form({
            defaults:{
                title:'Add Activity',
                template:'DimeTimetrackerFrontendBundle:Activities:form',
                templateEl:'#activity-form',
                backNavigation:'activity'
            },
            model:model
        }));
    });

    App.route("activity:edit", "activity/:id/edit", function (id) {
        var model = new App.Model.Activity({id:id});
        model.fetch({async:false});

        App.UI.menu.activateItem('activity');
        App.UI.router.switchView(new App.Views.Activity.Form({
            defaults:{
                title:'Edit Activity',
                template:'DimeTimetrackerFrontendBundle:Activities:form',
                templateEl:'#activity-form',
                backNavigation:'activity'
            },
            model:model
        }));
    });

    App.route("activity:add-timeslice", "activity/:id/timeslice/add", function (id) {
        var activity = new App.Model.Activity({id:id});
        activity.fetch({async:false});

        var model = new App.Model.Timeslice({
            activity:activity.get('id')
        });

        model.set({
            'startedAt-date': moment().format('YYYY-MM-DD'),
            'stoppedAt-date': moment().format('YYYY-MM-DD')
        }, {silent: true});

        App.UI.menu.activateItem('activity');
        App.UI.router.switchView(new App.Views.Timeslice.Form({
            defaults:{
                title:'Edit Timeslice',
                template:'DimeTimetrackerFrontendBundle:Timeslices:form',
                templateEl:'#timeslice-form',
                backNavigation:'activity/' + activity.get('id') + '/edit'
            },
            model:model
        }));
    });

    App.route("timeslice:edit", "timeslice/:id/edit", function (id) {
        var model = new App.Model.Timeslice({id:id});
        model.fetch({async:false});

        App.UI.menu.activateItem('activity');
        App.UI.router.switchView(new App.Views.Core.Form({
            defaults:{
                title:'Edit Timeslice',
                template:'DimeTimetrackerFrontendBundle:Timeslices:form',
                templateEl:'#timeslice-form',
                backNavigation:'activity/' + model.relation('activity').get('id') + '/edit'
            },
            model:model
        }));
    });

})(jQuery, Dime);