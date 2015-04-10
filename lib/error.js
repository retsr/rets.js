// var debug = require('debug')('rets.js:error');

function RETSError(code) {
    Error.call(this);
    Error.captureStackTrace(this, arguments.callee);
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

module.exports = RETSError;
