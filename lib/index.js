/**
 * RETSr.io rets.js RETS Client
 * @module RETS
 * @license MIT
 * @author Luis Gomez
 *
 * @see {@link http://usejsdoc.org/}
 *
 */


var assert = require('assert');
var URL = require('url');
var util = require('util');
var _ = require('lodash');
var debug = require('debug')('rets.js:rets');
var md5 = require('MD5');
var es = require('event-stream');
var Transform = require('stream').Transform;
var request = require('request');

var codes = require('./codes');
var Session = require('./session');

/**
 * @description Constructs a RETS instance.
 * @example
 *
 *  var rets = new RETS('http://user:pass@example.com/Login.asmx/Login');
 *
 * @constructor
 * @class
 * @public
 * @requires module:Session
 * @requires module:codes
 *
 * @param {(string|object)} options - A compliant URL string or URL module compatible url object.
 * @param {string} options.auth - The `user` and `password` separated by a colon.
 * @param {string} options.host - Host domain.
 * @param {string} options.path - Target URL path.
 *
 * @returns {RETS} Returns an instance of RETS.
 *
 * @throws {RETSError} Rets-defined error?
 * @throws {Error} If an invalid URL object or string is passed.
 *
 * @todo Migrate code from rest-old.
 *
 */
function RETS(options) {

    var url = (typeof options === 'string') ? options : options.url;

    /** @member {Session} */
    this.session = new Session(url);

    if (!(this instanceof RETS)) {
        return new RETS(options);
    }

    // init Transform
    // Transform.call(this, options);
}
// util.inherits(Upper, Transform);

/**
 * Execute login action/capability against RETS service.
 * @param  {string|object} url A compliant URL string or URL module compatible url object.
 *
 * @this RETS
 *
 * @todo Migrate code from rest-old.
 *
 */
RETS.prototype.login = function (options) {
};

/**
 * Execute search action/capability against RETS service.
 *
 * @param  {Object} query - A compliant URL string or URL module compatible url object.
 * @param  {Object} options - A compliant URL string or URL module compatible url object.
 *
 * @this RETS
 *
 * @todo Migrate code from rest-old.
 *
 */
RETS.prototype.search = function (query, options) {
};

module.exports = RETS;
