/*
 * Dime - activity form view
 */

(function ($, App) {

  // provide Base namespace in App.Views
  var BaseView = App.provide('Views.Base');

  // activity form view
  BaseView.Form = Backbone.View.extend({
    events: {
      'click .save': 'save',
      'click .close': 'close',
      'click .cancel': 'close'
    },
   initialize: function() {
      //_.bindAll(this);
      this.form = this.$el.form();
    },
    save: function() {
      if (this.model) {
        if (this.model.isNew()) {
          this.model.set(this.form.data());
          if (this.collection) {
            this.collection.create(this.model, {success: this.close});
          }
        } else {
          this.model.save(this.form.data(), {success: this.close});
        }
      }
    },
    close: function() {
        this.$el.data('modal').hide();
    }
  });
  
})(jQuery, Dime);