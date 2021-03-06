'use strict';

/**
 * Dime - app/service/index.js
 */
(function ($, Backbone, _, App) {

    // Add menu item to main menu
    App.menu.get('admin').submenu.add({
        id:"service",
        title:"Service",
        route:"service",
        weight:0,
        callback:function () {
            App.menu.activateItem('admin.service');
            App.router.switchView(new App.Views.Service.Index());
        }
    });

    // Define Routes
    App.router.route("service/add", "service:add", function () {
        var model = new App.Model.Service();

        App.menu.activateItem('admin.service');
        App.router.switchView(new App.Views.Service.Form({
            defaults:{
                title:'Add Service',
                template:'DimeTimetrackerFrontendBundle:Services:form',
                templateEl:'#service-form',
                backNavigation:'service'
            },
            model:model
        }));
    });
    App.router.route("service/:id/edit", "service:edit", function (id) {
        var model = new App.Model.Service({id:id});
        model.fetch({async:false});

        App.menu.activateItem('admin.service');
        App.router.switchView(new App.Views.Service.Form({
            defaults:{
                title:'Edit Service',
                template:'DimeTimetrackerFrontendBundle:Services:form',
                templateEl:'#service-form',
                backNavigation:'service'
            },
            model:model
        }));
    });

    // Service view
    App.provide('Views.Service.Index', App.Views.Core.Content.extend({
        template:'DimeTimetrackerFrontendBundle:Services:index',
        initialize:function () {
            this.services = App.session.get('services', function () {
                return new App.Collection.Services();
            });
        },
        render:function () {
            // Render filter
            this.filter = new App.Views.Core.Filter({
                el: this.el,
                collection: this.services,
                defaults: {
                    name: 'service-filter',
                    preservedOnReset: {
                        open: true
                    },
                    ui: {
                        dates: false,
                        customers: false,
                        projects: false,
                        services: false
                    }
                }
            }).render();

            // Render pager
            this.pager = new App.Views.Core.Pager({
                collection: this.services
            });
            $('.pagination').html(this.pager.render().el);


            // Render service list
            this.list = new App.Views.Core.List({
                el:'#services',
                collection:this.services,
                defaults:{
                    fetch: false,
                    prefix:'service-',
                    emptyTemplate: '#tpl-service-empty',
                    item:{
                        attributes:{ "class":"service" },
                        tagName:"section",
                        template:'#tpl-service-item',
                        View:App.Views.Service.Item
                    }
                }
            }).render();

            this.filter.updateFilter();

            return this;
        },
        remove:function () {
            // Unbind events
            this.services.off();

            this.list.remove();
            this.filter.remove();
            this.pager.remove();

            // remove element from DOM
            this.$el.empty().detach();

            return this;
        }
    }));

})(jQuery, Backbone, _, Dime);
