/* jshint unused: false */

'use strict';

/** log facility */
var log = require('./logger');
var extend = require('extend');
var url    = require('url');

function Configuration(settings, options) {

    /**
     * @todo Document this pattern.
     */
    if (!(this instanceof Configuration)) {
        return new Configuration(settings, options);
    }

    /**
     * If settings is a string, the user passed a url so move it into settings.url
     * as a parsed url.
     */
    if (typeof settings === 'string') {
        settings = {url: url.parse(settings)};
    }

    /**
     * If settings is not an object, throw an error.
     */
    if (typeof settings !== 'object') {
        throw new Error('settings is required and must be a string or an object.');
    }

    /**
     * If settings is not an object, throw an error.
     */
    if (typeof settings.url === 'string') {
        settings.url = url.parse(settings.url);
    }

    /**
     * If settings.url.auth is not null, parse it to extract the user and
     * password and assign these to settings.user and settings.pass respectively.
     */
    if (settings.url.auth !== null) {
        var auth = settings.url.auth.split(':');
        settings.user = {
            name: auth[0]
        };
        if (auth.length > 1) {
            settings.user.password = auth[1];
        }
    }

    /**
     * If by now settings.host is null, throw an error as we need at least that
     * to connect to a rets server.
     */
    if (settings.url.host === null) {
        throw Error("settings.url.host is not valid");
    }

    if (settings.user === null) {
        throw Error("settings.user is required");
    }

    /**
     * Holds default settingsuration values for the instance.
     *
     * @member {object}
     * @property {string} options.url - URL module compatible url object.
     * @property {string} options.user.name - The provided user.
     * @property {string} options.user.password -The provided password for user.
     * @property {string} options.client.name - The provided user agent for authenticating.
     * @property {string} options.client.password -The provided password for user agent authentication.
     * @property {string} options.version - The version of RETS to speak: RETS/1.7.2
     */
    var defaults = {
        url: null,
        user: {
            name: null,
            password: null
        },
        client: {
            name: 'RETS.JS@0.0.1',
            password: null
        },
        version: 'RETS/1.7.2'
    };

    return extend(true, this, defaults, settings, options);

}
module.exports = Configuration;
