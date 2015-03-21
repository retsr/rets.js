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
 * RETS Constructor.
 *
 *   Example code
 *
 * * List item 1
 * * List item 2
 *
 * @constructor
 * @param {string} options [description]
 *
 */
function RETS(options) {

    var url = (typeof options === 'string') ? options : options.url;

    this.session = new Session(url);

    if (!(this instanceof RETS)) {
        return new RETS(options);
    }

    // init Transform
    // Transform.call(this, options);
}
// util.inherits(Upper, Transform);

/**
 * Some description
 * @param  {options} options Some options being passed
 */
RETS.prototype.login = function (options) {
    console.trace();
  // var upperChunk = chunk.toString().toUpperCase();
  // this.push(upperChunk, enc);
  // cb();
};

/** will be module:search */
RETS.prototype.search = function (query, options) {
    console.trace();
  // var upperChunk = chunk.toString().toUpperCase();
  // this.push(upperChunk, enc);
  // cb();
};

/** will be module.headers */
RETS.prototype.headers = function () {
  this.session.headers = {
    'RETS-UA-Authorization': 'Digest ' + md5([md5([config.user, config.password].join(':').trim()),'','','RETS/1.7.2'].join(':')),
    'RETS-Version': 'RETS/1.7.2',
    'User-Agent': config.userAgent || 'RETS-Connector1/2'
  };
};

module.exports = RETS;
