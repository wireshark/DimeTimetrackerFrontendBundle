'use strict';

/*
 * Dime - core/views/form.js
 */
(function ($, App) {

    App.provide('Views.Core.Form', App.Views.Core.Content.extend({
        defaults:{
            backNavigation:'',
            events:{
                'submit form':'save',
                'click .save':'save',
                'click .close':'close',
                'click .cancel':'close'
            }
        },
        initialize:function (opt) {
            // Bind all to this, because you want to use
            // "this" view in callback functions
            _.bindAll(this);

            if (opt && opt.defaults) {
                this.defaults = $.extend(true, {}, this.defaults, opt.defaults);
            }

            if (this.defaults.events) {
                this.events = this.defaults.events;
            }

            if (this.defaults.template) {
                this.template = this.defaults.template;
            }
        },
        render:function () {
            this.setElement(this.defaults.templateEl, true);

            // Set title
            if (this.defaults.title) {
                $('header.page-header h1', this.$el).text(this.defaults.title);
            }

            // Fill form
            this.form = this.$el.form();
            this.form.clear();
            this.form.fill(this.model.toJSON());

            return this;
        },
        save:function (e) {
            e.preventDefault();
            var that = this;

            $('.save').append(' <i class="icon loading-14-white"></i>');
            $('.cancel').attr('disabled', 'disabled');

            this.formData = this.form.data();

            if (this.presave) {
                this.presave(this.formData);
            }

            this.model.save(this.formData, {
                wait:true,
                success:function () {
                    App.notify("Nice, all data are saved properly.", "success");
                    that.close();
                },
                error:function (model, response, scope) {
                    $('.save i.icon').remove();
                    $('.cancel').removeAttr('disabled');
                    var data = $.parseJSON(response.responseText);

                    if (data.errors) {
                        that.form.errors(data.errors);
                        App.notify("Hey, you have missed some fields.", "error");
                    } else {
                        App.notify(response.status + ": " + response.statusText, "error");
                    }

                }
            });
        },
        close:function () {
            App.router.navigate(this.defaults.backNavigation, { trigger:true });
        }
    }));


})(jQuery, Dime);
