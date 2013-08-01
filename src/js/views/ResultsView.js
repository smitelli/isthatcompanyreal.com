define([
    'jquery',
    'lodash',
    'backbone',
    'conf/defaults',
    'text!templates/resultsViewTemplate.html'
], function(
    $,
    _,
    Backbone,
    defaults,
    resultsViewTemplate
) {
    'use strict';

    var OPEN_DELAY = defaults.transitionSpeed / 2;

    return Backbone.View.extend({
        template : _.template(resultsViewTemplate),

        /**
         * Start listening to the model.
         */
        initialize : function() {
            _.bindAll(this);

            this.listenTo(this.model, 'change', this.render);
        },

        /**
         * When the model changes, this method is called. Depending on the state
         * of the model, hide/show the element and re-render the template.
         */
        render : function() {
            if (this.model.isZeroState()) {
                this._hide();
            } else {
                this.$el.html(this.template(this.model.toJSON()));

                // The UI looks better when this happens mid-transition
                _.delay(this._show, OPEN_DELAY);
            }

            return this;
        },

        /**
         * Hide the results view.
         */
        _hide : function() {
            this.$el.stop(true).slideUp();
        },

        /**
         * Show the results view.
         */
        _show : function() {
            this.$el.stop(true).slideDown();
        }
    });
});
