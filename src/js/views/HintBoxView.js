define([
    'jquery',
    'lodash',
    'backbone',
    'conf/defaults'
], function(
    $,
    _,
    Backbone,
    defaults
) {
    'use strict';

    var THROB_EASING = 'linear';  //any of the jQuery 'easing' function names

    return Backbone.View.extend({
        /**
         * Grab references to the DOM elements and start listening to the model.
         */
        initialize : function() {
            _.bindAll(this);

            this.listenTo(this.model, 'change',  this._hide);
            this.listenTo(this.model, 'invalid', this._show);
        },

        /**
         * Hide the hint box. We don't want to stop the animations because that
         * will abruptly stop the throb. _throb() will stop recursing if the
         * element becomes invisible.
         */
        _hide : function() {
            this.$el.fadeOut();
        },

        /**
         * Show the hint box and start the throb animation.
         */
        _show : function() {
            this.$el.stop(true).fadeIn();

            this._throb();
        },

        /**
         * Throb animation - slowly move the box up and down. This method calls
         * itself recursively as long as the element is visible. I really can't
         * remember why I did it this way instead of using CSS animations.
         */
        _throb : function() {
            var twoPi = 2 * Math.PI;

            // Do not continue if the element is not visible.
            if (!this.$el.is(':visible')) {
                return;
            }

            // Feed a linear ramp from 0 to 1 into the sine function and set
            // the element's margin-top to the resulting value. Creates a smooth
            // zero->down->zero->up->zero animation cycle.
            this.$el.css({dummyProp : 0}).animate({dummyProp : 1}, {
                easing : THROB_EASING,
                queue  : false,
                step   : _.bind(function(now, fx) {
                    var theta  = now * twoPi,
                        offset = Math.sin(theta) * defaults.throbOffsetRange;

                    this.$el.css({marginTop : offset});
                }, this),
                duration : defaults.throbSpeed,
                complete : this._throb
            });
        }
    });
});
