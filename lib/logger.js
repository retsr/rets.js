/**
 * RETSr.io rets.js RETS Client
 * @module RETS
 * @license MIT
 *
 * @see {@link http://retsr.io/rets.js}
 */

'use strict';

var bunyan = require('bunyan');
var pkg = require('../package');

exports = module.exports = (function Logger() {
    return bunyan.createLogger({
        name: pkg.name,
        stream: process.stdout,
        level: process.env.BUNYAN_LOG_LEVEL || 'warn',
        serializers: {
            err: bunyan.stdSerializers.err
        }
    });
})();
