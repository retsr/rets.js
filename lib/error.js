/**
 * RETSr.io rets.js RETS Client
 * @module RETS
 * @license MIT
 *
 * @see {@link http://retsr.io/rets.js}
 */

'use strict';

module.exports = RETSError;

/** log facility */
// var debug = require('debug')('rets.js:error');

function RETSError(code) {
    Error.call(this);
    // Strict mode doesn't like arguments.callee
    Error.captureStackTrace(this);
    this.codes = require('./codes');
    this.code = code;
    this.name = 'RETSError';
    this.message = 'Invalid error code.';
    this.description = null;
    if (typeof this.codes[this.code] !== 'undefined') {
        this.message = this.codes[this.code][0];
        this.description = this.codes[this.code][1] || null;
    }
}

RETSError.prototype = new Error();

