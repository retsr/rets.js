/* jshint -W079 */

var util = require('util');
var md5 = require('MD5');
var debug = require('debug')('rets.js:session');
var url = require('url');

/**
 * @description Constructs a RETS Session instance
 * @constructor
 * @class
 * @private
 *
 * @param {(string|object)} url - A compliant URL string or URL module compatible url object
 * @param {object} options - Session credentials, user-agent, and version options
 */
function Session(options) {

    /**
     * Holds the original options passed by the user.
     *
     * @member {object|string}
     */
    this.options = options;

    if (typeof this.options.url === 'undefined') {
        throw new Error('options.url is required.');
    }
    if (typeof this.options.url !== 'string' && typeof this.options.url !== 'object') {
        throw new Error('options.url is not a string or an object.');
    }
    if (typeof this.options.url === 'string') {
        this.url = this.options.url = url.parse(this.options.url);
    } else {
        this.url = this.options.url;
    }
    if (typeof this.url.host !== 'string' || this.url.host.length < 1) {
        throw new Error('invalid options.url.host.');
    }
    if (typeof this.url.auth !== 'string' || this.url.auth.length < 2 || this.url.auth.indexOf(':') < 0 ) {
        throw new Error('invalid options.url.auth.');
    }

    /**
     * Holds default configuration values for the instance.
     *
     * @member {object}
     * @property {string} options.UA - URL module compatible url object.
     * @property {string} options.UAP - The provided user agent for authenticating.
     * @property {string} options.version - The version of RETS to speak: RETS/1.7.2
     */
    this.defaults = {
        url: null,
        ua: {
            name: 'RETS-Connector1/2',
            pass: ''
        },
        version: 'RETS/1.7.2'
    };

    /**
     * Holds the final configuration for the instance
     * after processing, defaults, validation, etc.
     * Extend defaults with processed config and re-set config to
     * hold final configuration for instance.
     */
    this.config = {};
    util._extend(this.config, this.defaults);
    util._extend(this.config, this.options);

    /**
     * Default User Agent
     * @default
     * @member {String} UA - The User Agent for the Session
     */
    this.ua = this.config.ua;

    /** @member {Object} */
    this.user = {
        name: null,
        pass: null
    };
    if (typeof this.url.auth === 'string' && this.url.auth.indexOf(':') > -1) {
        this.user.name = this.url.auth.split(':')[0];
        this.user.pass = this.url.auth.split(':')[1];
    }

    /** 
     * RETS Session ID
     * @type {String}
     */
    this.id = '';

    /** 
     * RETS-Request-ID placeholder
     * This client does not currently support RETS-Request-ID
     * 
     * @type {Object}
     */
    this.request = { id: '' };

    /** @member {String} */
    this.version = this.config.version;

    /** @member {Object} */
    this.headers = {
        'RETS-UA-Authorization': 'Digest ' + this.hash(),
        'RETS-Version': this.version,
        'User-Agent': this.ua.name
    };

    /** @member {Object} */
    this.capabilities = {
        Login: this.url.protocol + '//' + this.url.host + this.url.pathname
    };
    /** @member {Object} */
    this.settings = {};
}

/**
 * Calculate Digest hash for RETS-UA-Authorization headers
 * @return {string} MD5 Digest hash
 */
Session.prototype.hash = function () {
    /**
     * This is fully expressed following the spec to help readers see and understand
     * how to properly compute the RETS-UA-Authorization value
     *
     * @see {@link http://www.reso.org/assets/RETS/Specifications/rets_1_8.pdf}
     */

    // a1 ::= MD5( product ":" UserAgent-Password )
    var a1 = md5( this.ua.name + ':' + this.ua.pass );

    // ::= LHEX( MD5( LHEX(a1)":" RETS-Request-ID ":" session-id ":" version-info))
    return md5( a1 + ':' + this.request.id + ':' + this.id + ':' + this.version );
};

module.exports = Session;

