require.config({
    paths : {
        backbone : 'lib/backbone/backbone',
        jquery   : 'lib/jquery/jquery',
        lodash   : 'lib/lodash/lodash',
        text     : 'lib/requirejs/text'
    },

    map : {
        '*' : {
            jquery     : 'lib/jquery/noconflict',
            lodash     : 'lib/lodash/noconflict',
            underscore : 'lib/lodash/noconflict'
        },
        'lib/jquery/noconflict' : {
            jquery : 'jquery'
        },
        'lib/lodash/noconflict' : {
            lodash : 'lodash'
        }
    },

    shim : {
        backbone : {
            deps : ['jquery', 'underscore'],
            init : function(jQuery) {
                Backbone.$ = jQuery;
                return Backbone.noConflict();
            }
        }
    }
});
