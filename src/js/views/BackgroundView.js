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

    var TRANSFORM_PROP = (function() {
            // This helper function determines the best CSS transform property
            // name to use during future animations.
            var $div  = $('<div/>'),
                props = 'transform|WebkitTransform|MozTransform|msTransform|OTransform'.split('|'),
                found = '';

            _.each(props, function(prop) {
                if (prop in $div.prop('style')) {
                    found = prop;
                    return false;  //break
                }
            });

            return found;
        })(),
        FRONT_LAYER = 'frontLayer',
        BACK_LAYER  = 'backLayer';

    return Backbone.View.extend({
        /**
         * Grab references to the DOM elements and start listening to the model.
         */
        initialize : function(options) {
            options = options || {};

            _.bindAll(this);

            this.$body   = $(options.bodyEl);
            this.$bursts = this.$('.burst');

            this.listenTo(this.model, 'change', this.render);
        },

        /**
         * When the model changes, this method is called. Depending on the state
         * of the model, select a background layer to expose.
         */
        render : function() {
            if (this.model.isZeroState()) {
                this._expose('zero');

            } else if (this.model.isError()) {
                this._expose('error');

            } else if (this.model.isRealCompany()) {
                this._expose('real');

            } else if (this.model.isFakeCompany()) {
                this._expose('fake');
            }

            return this;
        },

        /**
         * Stop all background layer animations, remove the z-indexing classes,
         * and reset the rotations to zero.
         */
        _reset : function() {
            this.$bursts.stop(true).removeClass(BACK_LAYER).css(TRANSFORM_PROP, this._getRotation(0));
        },

        /**
         * Exposes the layer with the CSS class matching `className` in the DOM.
         * Replaces the previously-shown layer using a needlessly complex
         * animation.
         *
         * There is an 'out' layer and an 'in' layer. The 'out' layer is the one
         * that is visible before _expose() is called -- it is being hidden. The
         * 'in' layer is animating into view. The animation is performed in the
         * following steps:
         * 1) The 'out' layer has a z-index that places it in front. The 'in'
         *    layer has a z-index that places it in back. The 'out' layer NEVER
         *    moves during the course of the animation. The page background
         *    color is visible through any uncovered areas.
         * 2) The 'in' layer starts its animation such that it is behind 'out',
         *    completely obscured by it. The 'in' layer rotates from 0 to
         *    `bgDeflection` degrees, peeking out from behind 'out' and covering
         *    up the page background.
         * 3) At this point, the animation is half over. The 'in' and 'out'
         *    layers are both completely visible -- neither one is covering the
         *    other and the page background is completely obscured. The 'in' and
         *    'out' layers swap z-indexes. The page background color changes.
         * 4) The 'in' layer jumps from `bgDeflection` to `-bgDeflection`
         *    degrees. The image is constructed so this jump is not visible.
         * 5) The 'in' layer rotates from `-bgDeflection` to 0 degrees. It is
         *    now beginning to cover up the 'out' layer while simultaneously
         *    exposing the new page background color.
         * 6) The animation completes with the 'in' layer at 0 degrees. The
         *    reset method is called and the animation is armed to run again.
         */
        _expose : function(className) {
            this._reset();

            // If we're trying to expose the already-visible layer, bail out.
            if (this.$(this._getClass(className)).is(':visible')) {
                return;
            }

            // `$out` is the layer currently showing -- it is animating away.
            // `$in` is the layer that is being made visible.
            var $out = this.$(this._getClass(FRONT_LAYER)),
                $in  = this.$(this._getClass(className)).addClass(BACK_LAYER),
                swap = _.once(_.bind(function() {
                    // This becomes a no-op after executing one time
                    $out.addClass(BACK_LAYER).removeClass(FRONT_LAYER);
                    $in.addClass(FRONT_LAYER).removeClass(BACK_LAYER);
                    this.$body.removeClass().addClass(className);
                }, this)),
                twoDeflection = 2 * defaults.bgDeflection;

            $in.css({dummyProp : 0}).animate({dummyProp : 1}, {
                step : _.bind(function(now, fx) {
                    var theta = fx.pos * twoDeflection;

                    if (theta > defaults.bgDeflection) {
                        // In the second half of the animation
                        theta -= twoDeflection;
                        swap();
                    }

                    $in.css(TRANSFORM_PROP, this._getRotation(theta));
                }, this),
                duration : defaults.transitionSpeed,
                complete : this._reset
            });
        },

        /**
         * Convenience function to convert `className` into a format expected in
         * a jQuery/Sizzle selector string.
         */
        _getClass : function(className) {
            return '.' + className;
        },

        /**
         * Convenience function to convert a numeric `degrees` value into a CSS
         * "rotate(...deg)" format.
         */
        _getRotation : function(degrees) {
            return 'rotate(' + degrees + 'deg)';
        }
    });
});
