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

function RETSError(ReplyCode, ReplyText) {
    Error.call(this);
    // Strict mode doesn't like arguments.callee
    Error.captureStackTrace(this);
    this.codes = require('./codes');
    this.code = ReplyCode || null;
    this.name = 'RETSError';
    this.message = '';
    this.ReplyText = ReplyText || null;
    this.wrapper = {
        start: " - [ReplyText: ",
        end: "]"
    };
    if (typeof this.codes[this.code] !== 'undefined') {
        if (typeof this.codes[this.code][0] !== 'undefined') {
            this.message = this.codes[this.code][0];
        }
        if (this.ReplyText !== null) {
            this.message += this.wrapper.start + this.ReplyText + this.wrapper.end;
        }
    }
    this.description = this.message;
}

RETSError.prototype = new Error();
