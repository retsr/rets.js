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
var request       = require('./request');
var response      = require('./response');
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
    this.config = new Configuration(settings, options);

    /**
     * Hold reference to Session instance.
     *
     * @member {Session}
     */
    this.session = new Session(this.config);

    mixin(this, Provider.prototype);

    /**
     * Init EventEmitter
     */
    EventEmitter.call(this);
}

module.exports = RETS;
