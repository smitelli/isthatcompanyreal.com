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

    return Backbone.Model.extend({
        /**
         * Tell Backbone where it can GET the AJAX for a query.
         */
        url : function() {
            return '/fakeometer.php?q=' + encodeURIComponent(this.get('query'));
        },

        /**
         * Validation method. A model is valid if the `query` attribute contains
         * a string that looks plausibly like a URL or domain name.
         */
        validate : function(attrs, options) {
            var url = attrs.query,
                hostname;

            // Make the URL absolute if it is not already. This is moderately
            // robust, matching every scheme I've ever seen used.
            if (!/^[A-Za-z0-9\.+-]+:\/\//.test(url)) {
                url = '//' + url;
            }

            // Leverage an HTMLAnchorElement's ability to extract a hostname
            hostname = $('<a/>').attr('href', url).prop('hostname');
        },

        /**
         * Wrap Backbone's native toJSON() method to add the return values of
         * our model helper functions.
         */
        toJSON : function() {
            var json = Backbone.Model.prototype.toJSON.apply(this);

            // TODO: Probably a good candidate for a view helper
            _.extend(json, {
                isZeroState   : this.isZeroState(),
                isError       : this.isError(),
                isRealCompany : this.isRealCompany(),
                isFakeCompany : this.isFakeCompany(),
                errorQuip     : this.getRandomQuipFor('error'),
                realQuip      : this.getRandomQuipFor('real'),
                fakeQuip      : this.getRandomQuipFor('fake')
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
        },

        /**
         * Returns a random quip based on the provided mode.
         */
        getRandomQuipFor : function(mode) {
            var quips = {
                real  : [
                    'Oh happy day!',
                    'This is the best news I\'ve given all day!',
                    'I am just ecstatic to be able to bring you this wonderful information!',
                    'Now go on and seize the day!',
                    'I can\'t wait to see what you use this data for!',
                    'Break out the champagne and put on a festive party hat!',
                    'What a wonderful and glorious internet this is!',
                    'How can you beat that? Don\'t even try to, that\'s how!',
                    'Huzzahs all around!',
                    'I tip my hat to you, you magnificent human being!'
                ],
                fake  : [
                    'Ouch, that\'s gotta hurt.',
                    'I know, right? I was as surprised as you were.',
                    'Who woulda thunk it?',
                    'Wow, it\'s like my whole world has been turned upside-down.',
                    'Win some, lose some.',
                    'Don\'t worry, time heals all wounds.',
                    'It could be a lot worse, though.',
                    'Look on the bright side -- you\'ve still got me.',
                    'This can be our little secret.',
                    'Try not to rub it in their face though, alright?'
                ],
                error : [
                    'I am so thoroughly embarrassed.',
                    'I\'m sorry. I really am.',
                    'I thought I could do a lot better than this.',
                    'I have failed you. I know.',
                    'We\'re still cool though, right?',
                    'This usually never happens.',
                    'To tell the truth, I don\'t think I\'ve been bringing my A-game lately.',
                    'Damn.',
                    'I\'ll try to be better next time.',
                    'Man, this ain\'t my day tonight.'
                ]
            };

            // Return a quip if we have one (otherwise return undefined)
            if (quips[mode]) {
                return _.sample(quips[mode]);
            }
        }
    });
});
