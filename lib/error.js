// var debug = require('debug')('rets.js:error');
var codes = require('./codes');

function RETSError(code) {
    Error.call(this);
    Error.captureStackTrace(this, arguments.callee);
    this.code = code;
    this.name = 'RETSError';
    this.message = 'Invalid error code.';
    this.description = null;
    if (typeof codes[this.code] !== 'undefined') {
        this.message = codes[this.code][0];
        this.description = codes[this.code][1] || null;
    }
}

RETSError.prototype = new Error();

exports.codes = codes;
module.exports = RETSError;
