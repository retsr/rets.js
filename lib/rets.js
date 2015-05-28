/* jshint unused: false */

/**
 * RETSr.io rets.js RETS Client
 * @module RETS
 * @license MIT
 *
 * @see {@link http://retsr.io/rets.js}
 */

'use strict';

/** log facility */
var log = require('./logger');

/** core deps */
var path          = require('path');
var os            = require('os');
var fs            = require('fs');
var util          = require('util');
var extend        = require('extend');
var url           = require('url');
var EventEmitter  = require('events').EventEmitter;
var xml           = require('xml2js').parseString;
var mixin         = require('merge-descriptors');

var Configuration = require('./configuration');
var response      = require('./response');
var User          = require('./user');
var Client        = require('./client');
var Session       = require('./session');
var Provider      = require('./provider');

/**
 * Constructs a RETS instance.
 *
 * @example
 *
 *  var rets = new RETS('http://user:pass@example.com/Login.asmx/Login');
 *
 * @constructor
 * @class
 * @inherits events.EventEmitter
 * @public
 * @requires module:Session
 * @requires module:codes
 * @requires module:request
 *
 * @param {(string|object)} options - A compliant URL string or settings object.
 * @param {string} options.url - URL module compatible url object.
 * @param {string} options.userAgent - The provided user agent for authenticating.
 * @param {string} options.userAgentPassword -The provided password for user agent authentication.
 * @param {string} options.version - The version of RETS to speak: RETS/1.7.2
 *
 * @returns {RETS} Returns an instance of RETS.
 *
 * @throws {RETSError} Rets-defined error?
 * @throws {Error} If an invalid URL object or string is passed.
 */
util.inherits(RETS, EventEmitter);
function RETS(settings, options) {

    /**
     * @todo Document this pattern.
     */
    if (!(this instanceof RETS)) {
        return new RETS(settings, options);
    }

    /**
     * Hold reference to Configuration instance.
     *
     * @member {Configuration}
     */
    var config = new Configuration(settings, options);

    this.url = config.url;

    /**
     * Hold reference to User instance.
     *
     * @member {User}
     */
    this.user = new User(config.user.name, config.user.password);

    /**
     * Hold reference to Client instance.
     *
     * @member {Client}
     */
    this.client = new Client(config.client.name, config.client.password);

    /**
     * Hold reference to Session instance.
     *
     * @member {Session}
     */
    this.session = new Session();

    /**
     * Hold reference to Session instance.
     *
     * @member {Session}
     */
    this.provider = new Provider(config.url);

    mixin(this, Provider.prototype);

    /**
     * Init EventEmitter
     */
    EventEmitter.call(this);
}

module.exports = RETS;
