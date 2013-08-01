require(['require-config'], function() {
    'use strict';

    require(['views/ApplicationView'], function(ApplicationView) {
        // Let 'er rip!
        new ApplicationView();
    });
});
