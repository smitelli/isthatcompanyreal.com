define([
    'jquery',
    'lodash',
    'backbone'
], function(
    $,
    _,
    Backbone
) {
    'use strict';

    /**
     * Holds information about the last query entered, as well as the last query
     * submitted.
     */
    var InputState = Backbone.Model.extend({
        inputText  : undefined,
        submitText : undefined
    });

    return Backbone.View.extend({
        events : {
            'keyup'  : '_onKeyUp',
            'submit' : '_onSubmit'
        },

        /**
         * Grab references to the DOM elements and wire up events.
         */
        initialize : function() {
            _.bindAll(this);

            this.searchBox = this.$('input[type="text"]');

            this.state = new InputState({
                inputText : this._getSearchQuery()
            });

            this.state.on('change:inputText',  this._newInputText);
            this.state.on('change:submitText', this._newSubmitText);
        },

        /**
         * Read the current search query from the DOM.
         */
        _getSearchQuery : function() {
            return this.searchBox.val();
        },

        /**
         * When any key is released, sync our state object.
         */
        _onKeyUp : function() {
            this.state.set('inputText', this._getSearchQuery());
        },

        /**
         * When the form is submitted, prevent the default behavior and sync our
         * state object.
         */
        _onSubmit : function(ev) {
            ev.preventDefault();

            this.state.set('submitText', this._getSearchQuery());
        },

        /**
         * When the input text (content of the text box) legitimately changes,
         * reset the state object and the Fakeometer model.
         */
        _newInputText : function() {
            this.state.set('submitText', undefined, {silent : true});

            this.model.clear();
        },

        /**
         * When the submit text legitimately changes (user submitted something
         * that is different from the previous thing submitted), read the query
         * and pass it to the Fakeometer model so it can perform the lookup.
         */
        _newSubmitText : function() {
            var searchQuery = this.state.get('submitText');

            this.model.sendQuery(searchQuery);
        }
    });
});
