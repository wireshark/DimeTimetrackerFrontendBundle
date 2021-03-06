'use strict';

/**
 * Dime - model/activity.js
 *
 * Register Activity model to namespace App.
 */
(function ($, Backbone, _, moment, App) {

    // Create Activity model and add it to App.Model
    App.provide('Model.Activity', Backbone.Model.extend({
        urlRoot:App.Route.Activities,
        defaults:{
            duration:0
        },
        relation:function (name, item, defaultValue) {
            var relation = this.get('relation'),
                result = defaultValue;

            if (name) {
                if (relation && relation[name]) {
                    if (item && relation[name].get(item)) {
                        result = relation[name].get(item);
                    } else {
                        result = relation[name];
                    }
                    return result;
                } else {
                    return undefined;
                }
            } else {
                return relation;
            }
        },
        parse:function (response) {
            response.relation = {};

            if (response.customer) {
                response.relation.customer = new App.Model.Customer(response.customer);
                response.customer = response.customer.id;
            }

            if (response.project) {
                response.relation.project = new App.Model.Project(response.project);
                response.project = response.project.id;
            }

            if (response.service) {
                response.relation.service = new App.Model.Service(response.service);
                response.service = response.service.id;
            }

            var timeslices = new App.Collection.Timeslices();
            if (response.timeslices) {
                var slices = [];
                _.each(response.timeslices, function (item) {
                    slices[slices.length] = item.id;
                    item.activity = response.id;
                    timeslices.add(new App.Model.Timeslice(item));
                });
                response.duration = timeslices.duration();
                response.timeslices = slices;
            }
            response.relation.timeslices = timeslices;

            return response;
        },
        start:function (opt) {
            var timeslices = this.relation('timeslices');
            if (timeslices && !timeslices.firstRunning()) {
                timeslices.create(new App.Model.Timeslice({
                    activity:this.get('id'),
                    startedAt:moment(new Date).format('YYYY-MM-DD HH:mm:ss')
                }), opt);
            }
        },
        stop:function (opt) {
            var timeslices = this.relation('timeslices');
            if (timeslices && timeslices.firstRunning()) {
                var timeslice = timeslices.firstRunning();
                timeslice.save(
                    {
                        'stoppedAt':moment(new Date).format('YYYY-MM-DD HH:mm:ss')
                    },
                    opt
                );
            }
        },
        shortDescription:function (length, endChars) {
            return (this.get('description')) ? App.Helper.Format.Truncate(this.get('description'), length, endChars) : '<no description>';
        },
        addTimeslice: function (timeslice) {
            if (timeslice && this.relation('timeslices')) {
                var timeslices = this.relation('timeslices');
                timeslices.add(timeslice);
                this.set('duration', timeslices.duration());
            }
        },
        runningTimeslice:function () {
            return (this.relation('timeslices')) ? this.relation('timeslices').firstRunning() : undefined;
        },
        formatDuration:function (seconds) {
            return App.Helper.Format.Duration(seconds);
        }
    }));

})(jQuery, Backbone, _, moment, Dime);

