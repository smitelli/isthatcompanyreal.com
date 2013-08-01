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

    // Following list from: http://data.iana.org/TLD/tlds-alpha-by-domain.txt
    // I removed the IDN TLDs because I guess I'm a little americentric.
    var VALID_TLDS = [
        'ac','ad','ae','aero','af','ag','ai','al','am','an','ao','aq','ar','arpa','as','asia','at','au','aw','ax','az',
        'ba','bb','bd','be','bf','bg','bh','bi','biz','bj','bm','bn','bo','br','bs','bt','bv','bw','by','bz','ca','cat',
        'cc','cd','cf','cg','ch','ci','ck','cl','cm','cn','co','com','coop','cr','cu','cv','cw','cx','cy','cz','de',
        'dj','dk','dm','do','dz','ec','edu','ee','eg','er','es','et','eu','fi','fj','fk','fm','fo','fr','ga','gb','gd',
        'ge','gf','gg','gh','gi','gl','gm','gn','gov','gp','gq','gr','gs','gt','gu','gw','gy','hk','hm','hn','hr','ht',
        'hu','id','ie','il','im','in','info','int','io','iq','ir','is','it','je','jm','jo','jobs','jp','ke','kg','kh',
        'ki','km','kn','kp','kr','kw','ky','kz','la','lb','lc','li','lk','lr','ls','lt','lu','lv','ly','ma','mc','md',
        'me','mg','mh','mil','mk','ml','mm','mn','mo','mobi','mp','mq','mr','ms','mt','mu','museum','mv','mw','mx','my',
        'mz','na','name','nc','ne','net','nf','ng','ni','nl','no','np','nr','nu','nz','om','org','pa','pe','pf','pg',
        'ph','pk','pl','pm','pn','post','pr','pro','ps','pt','pw','py','qa','re','ro','rs','ru','rw','sa','sb','sc',
        'sd','se','sg','sh','si','sj','sk','sl','sm','sn','so','sr','st','su','sv','sx','sy','sz','tc','td','tel','tf',
        'tg','th','tj','tk','tl','tm','tn','to','tp','tr','travel','tt','tv','tw','tz','ua','ug','uk','us','uy','uz',
        'va','vc','ve','vg','vi','vn','vu','wf','ws','xxx','ye','yt','za','zm','zw'
    ];

    return Backbone.Model.extend({
        /**
         * Tell Backbone where it can GET the AJAX for a query.
         */
        url : function() {
            return '/fakeometer/?q=' + encodeURIComponent(this.get('query'));
        },

        /**
         * Validation method. A model is valid if the `query` attributes
         * contains a string that looks plausibly like a URL or domain name.
         */
        validate : function(attrs, options) {
            var url = attrs.query,
                hostname, tld;

            // Make the URL absolute if it is not already. This is moderately
            // robust, matching every scheme I've ever seen used.
            if (!/^[A-Za-z0-9\.+-]+:\/\//.test(url)) {
                url = '//' + url;
            }

            // Leverage an HTMLAnchorElement's ability to extrach a hostname
            hostname = $('<a/>').attr('href', url).prop('hostname');

            // Find the TLD -- whatever's after the last period
            tld = hostname.split('.').pop();

            // We'll call it valid if the hostname ends in a known TLD
            if (!_.contains(VALID_TLDS, tld)) {
                return 'The query is not valid.';
            }
        },

        /**
         * Wrap Backbone's native toJSON() method to add the return values of
         * our model helper functions.
         */
        toJSON : function() {
            var json = Backbone.Model.prototype.toJSON.apply(this);

            _.extend(json, {
                isZeroState   : this.isZeroState(),
                isError       : this.isError(),
                isRealCompany : this.isRealCompany(),
                isFakeCompany : this.isFakeCompany()
            });

            return json;
        },

        /**
         * Updates the model's `query` to the supplied text. Checks the query
         * for validity and fetches the results if everything looks okay.
         */
        sendQuery : function(searchQuery) {
            this.set('query', searchQuery, {silent : true});

            // If the model isn't valid, it will automatically trigger `invalid`
            if (this.isValid()) {
                // Query looks okay; fetch the results
                this.fetch();
            }
        },

        /**
         * Is this model in a zero state? Returns true if there is no data
         * currently loaded into this model, false otherwise.
         */
        isZeroState : function() {
            return !this.has('query');
        },

        /**
         * Did the API service return an error? Returns true if an error
         * occurred, false otherwise.
         */
        isError : function() {
            return !this.get('success');
        },

        /**
         * Is the company real? Returns true if the current score is equal to or
         * greater than the configured threshold, false otherwise.
         */
        isRealCompany : function() {
            return (this.get('score') >= defaults.realnessThreshold);
        },

        /**
         * Is the company fake? Returns the logical opposite of isRealCompany().
         */
        isFakeCompany : function() {
            return !this.isRealCompany();
        }
    });
});
