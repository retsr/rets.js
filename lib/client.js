/**
 * RETSr.io rets.js RETS Client
 * @module RETS
 * @license MIT
 *
 * @requires module:./logger
 * @requires module:MD5
 * @exports {Function} Client
 *
 * @see {@link http://retsr.io/rets.js}
 */

'use strict';

var log = require('./logger');
var md5 = require('MD5');

/**
 * Client class encapsulates User Agent instance data.
 * @param {Object} config
 * @param {string} config.name - The user agent's name
 * @param {string} config.password - The user agent's password
 */
function Client(name, password) {

    if (!(this instanceof Client)) {
        return new Client(name, password);
    }

    this.name = name || 'RETS-Connector1/2';
    this.password = password || '';

}

/**
 * Calculates the user client hash as specified by the RETS Spec.
 * Ie: MD5( Client.name ":" Client.password )
 *
 * @return {String} MD5 hash.
 * @this Client
 *
 * @see {@link Request.hash}
 */
Client.prototype.hash = function () {

    /**
     * Elements of hash.
     * @type {Array}
     */
    var parts = [this.name, this.password];

    /**
     * Concatenation of elements of hash.
     * @type {String} Hash input string.
     */
    var concatenated = parts.join(':');

    /**
     * Generate the md5 hash.
     * @type {String} Hash.
     */
    var hash = md5( concatenated );

    log.info("Generating client hash using %j. Result: %s", parts, hash);

    return hash;

};

/**
 * Exports
 */
module.exports = Client;
