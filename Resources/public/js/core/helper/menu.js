'use strict';

/**
 * Dime - core/helper/menu.js
 */
(function ($, Backbone, App) {

    App.provide('Model.Menu', Backbone.Model.extend({
        defaults:{
            weight:0,
            active:false
        },
        submenu:undefined,
        initialize: function() {
            this.submenu = new App.Collection.Menu();
        }
    }));

    App.provide('Collection.Menu', Backbone.Collection.extend({
        model: App.Model.Menu,
        currentActive:undefined,
        comparator:function (first, second) {
            if (first && second) {
                var opt1 = first.get('weight'), opt2 = second.get('weight');
                if (opt1 != undefined && opt2 != undefined) {
                    if (opt1 > opt2) {
                        return 1;
                    } else if (opt1 < opt2) {
                        return -1;
                    } else {
                        opt1 = first.get('title');
                        opt2 = second.get('title');
                        if (opt1 > opt2) {
                            return 1;
                        } else if (opt1 < opt2) {
                            return -1;
                        }
                    }
                }
            }
            return 0;
        },
        add: function(item) {
            if (item instanceof App.Model.Menu) {
                if (item.get('route') && item.get('callback')) {
                    App.router.route(item.get('route'), item.id, item.get('callback'));
                }
                return Backbone.Collection.prototype.add.call(this, item);
            } else if (item && item.id) {
                if (item.route && item.callback) {
                    App.router.route(item.route, item.id, item.callback);
                }
                return Backbone.Collection.prototype.add.call(this, item);
            }
            return this;
        },
        'get': function(id) {
            if (id && typeof(id) === "string") {
                var parts = id.split('.'),
                    item;

                for (var i=0; i<parts.length; i++) {
                    if (item) {
                        if (item.submenu && item.submenu.length > 0) {
                            item = item.submenu.get(parts[i]);
                        }
                    } else {
                        item = Backbone.Collection.prototype.get.call(this, parts[i]);
                    }
                }
                return item;
            }
            return undefined;
        },
        activateItem:function (id) {
            if (id && typeof(id) === "string") {
                var model,
                    parts = id.split('.').reverse();

                model = this.get(parts.pop());

                if (model) {
                    this.deactivateItem();
                    model.set('active', true);
                    this.currentActive = model;
                    if (parts.length > 0 && model.submenu && model.submenu.length > 0) {
                        model.submenu.activateItem(parts.reverse().join('.'));
                    }
                }
            }
        },
        deactivateItem:function () {
            if (this.currentActive) {
                this.currentActive.set('active', false);
                if (this.currentActive.submenu) {
                    this.currentActive.submenu.deactivateItem();
                }
                this.currentActive = undefined;
            }
        }
    }));

    /**
     * add a menu item to main menu
     *
     * @param item object { name: 'identifier', title: 'Title', weight: 0, route: 'route/to/:id', callback: func}
     * @return Dime or menu collection
     */
    App.provide('menu', new App.Collection.Menu());

    App.provide('Views.Core.MenuItem', Backbone.View.extend({
        tagName:"li",
        template:'<a href="#<%- uri %>" title="<%- title %>"><%- title %></a>',
        templateSubmenu:'<a href="#<%- uri %>" class="dropdown-toggle" data-toggle="dropdown" title="<%- title %>"><%- title %> <b class="caret"></b></a>',
        item:undefined,
        initialize:function () {
            _.bindAll(this, 'render');
        },
        render:function () {
            var temp, submenu = this.model.submenu;
            if (submenu && submenu.length > 0) {
                temp = _.template(this.templateSubmenu);
                this.$el.html(temp({
                    uri:this.model.get('route'),
                    title:this.model.get('title')
                }));

                var submenuView = new App.Views.Core.Menu({
                    collection: submenu,
                    attributes:{
                        'class':'dropdown-menu'
                    }
                });
                this.$el.append(submenuView.render().el);
                this.$el.addClass('dropdown');
            } else {
                temp = _.template(this.template);
                this.$el.html(temp({
                    uri:this.model.get('route'),
                    title:this.model.get('title')
                }));
            }
            return this;
        }
    }));

    App.provide('Views.Core.Menu', Backbone.View.extend({
        tagName:"ul",
        defaults:{
            itemView:App.Views.Core.MenuItem
        },
        initialize:function (opt) {
            // Bind all to this, because you want to use
            // "this" view in callback functions
            _.bindAll(this, 'render', 'addOne');

            // Assign function to collection events
            if (this.collection) {
                this.collection.on('add', this.addOne, this);
                this.collection.on('reset', this.render, this);
                this.collection.on('change', this.render, this);
            }

            // Grep default values from option
            if (opt && opt.defaults) {
                this.defaults = $.extend(true, {}, this.defaults, opt.defaults);
            }
        },
        render:function () {
            // remove all content
            this.$el.html('');

            if (this.collection && this.collection.length > 0) {
                this.collection.each(this.addOne);
            }

            return this;
        },
        addOne:function (model) {
            var view = new this.defaults.itemView({
                model:model,
                attributes:(model.get('active')) ? {'class':'active'} : {}
            });

            if (model.get('active')) {
                this.currentActive = model;
            }

            this.$el.append(view.render().el);
        }
    }));
})(jQuery, Backbone, Dime);
