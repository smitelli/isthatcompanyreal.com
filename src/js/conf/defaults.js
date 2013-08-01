define([], function() {
    'use strict';

    return {
        /**
         * The minimum score needed for a company to be considered "real" by the
         * Fakeometer model. (no unit)
         */
        realnessThreshold : 75,

        /**
         * Amount of time to spend moving from one animation state to the next.
         * (ms)
         */
        transitionSpeed : 1000,

        /**
         * Amount of time for the hint box throb to make one complete down-up-
         * back cycle. (ms)
         */
        throbSpeed : 2500,

        /**
         * Total distance from the "rest" position the hint box throb can move.
         * The position range will be -throbOffsetRange to throbOffsetRange.
         * (pixels)
         */
        throbOffsetRange : 10,

        /**
         * Amount to rotate the background layers when transitioning. The angle
         * range will be -bgDeflection to bgDeflection. (degrees)
         */
        bgDeflection : 10,
    };
});
