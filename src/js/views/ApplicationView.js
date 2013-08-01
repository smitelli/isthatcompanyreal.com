define([
    'jquery',
    'lodash',
    'backbone',
    'models/Fakeometer',
    'views/ResultsView',
    'views/InputFormView',
    'views/HintBoxView',
    'views/BackgroundView'
], function(
    $,
    _,
    Backbone,
    Fakeometer,
    ResultsView,
    InputFormView,
    HintBoxView,
    BackgroundView
) {
    'use strict';

    return Backbone.View.extend({
        el : 'body',

        /**
         * Wire up the application's model and subviews.
         */
        initialize : function() {
            _.bindAll(this);

            // Fakeometer model, handles AJAX lookups and parses responses
            this.fakeometer = new Fakeometer();

            // The text area where results are displayed
            this.resultsView = new ResultsView({
                el    : this.$('#results'),
                model : this.fakeometer
            });

            // The URL entry box and submit button
            this.inputFormView = new InputFormView({
                el    : this.$('#lookupForm'),
                model : this.fakeometer
            });

            // The hint popup when the model fails validation
            this.hintBoxView = new HintBoxView({
                el    : this.$('#hintBox'),
                model : this.fakeometer
            });

            // The background image layers and body style control
            this.backgroundView = new BackgroundView({
                el     : this.$('#bgContainer'),
                bodyEl : this.el,
                model  : this.fakeometer,
            });
        }
    });
});
