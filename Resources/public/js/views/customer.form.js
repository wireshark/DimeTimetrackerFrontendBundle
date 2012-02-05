/*
 * Dime - customer form view
 */

(function ($, app) {

  // init views
  if ('undefined' == typeof(app.views.customer)) {
    app.views['customer'] = {};
  }

  // customer form view
  app.views.customer.form = Backbone.View.extend({
    events: {
      'click .save': 'save',
      'click .cancel': 'close'
    },
    initialize: function() {
        _.bindAll(this);
        this.form = this.$el.form();
    },
    render: function() {
        this.form.clear();
        this.form.fill(this.model.toJSON());
        this.$el.modal({backdrop: 'static', show: true});
        return this;
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
})(jQuery, dime);
