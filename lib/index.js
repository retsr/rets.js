/* jshint unused: false */

/**
 * RETSr.io rets.js RETS Client
 * @module RETS
 * @license MIT
 * @author Luis Gomez
 *
 * @see {@link http://usejsdoc.org/}
 *
 */


// var assert = require('assert');
// var URL = require('url');
var util = require('util');
// var _ = require('lodash');
// var debug = require('debug')('rets.js:rets');
// var md5 = require('MD5');
// var es = require('event-stream');
// var Transform = require('stream').Transform;
// var request = require('request');
var EventEmitter = require('events').EventEmitter;

// var codes = require('./codes');
var Session = require('./session');

/**
 * @description Constructs a RETS instance.
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
util.inherits(RETS, EventEmitter);
function RETS(options) {

	var url, sessionOptions = {};

    if (typeof options === 'string') {
    	url = options;
    	sessionOptions = {};
    } else {
    	url = options.url;
    	sessionOptions = {
    		userAgent: options.userAgent,
    		userAgentPassword: options.userAgentPassword,
    		version: options.version
    	};
    }

    /** @member {Session} */
    this.session = new Session(url, sessionOptions);

    if (!(this instanceof RETS)) {
        return new RETS(options);
    }

    // init Transform
    // Transform.call(this, options);

    // init EventEmitter
	EventEmitter.call(this);
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
	var self = this;
	this.session.login(function(err, res, body){
		self.emit('login', err);
	});
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
	this.emit('search', new Error('Not implemented'));

    /**
     * Imported code from ./rets-old.js as reference. Deprecating that file.
     * DELETE THIS AFTER IMPLEMENTING
     * ======================================================================
     *     // Imports form top of file.
     *     var es = require('event-stream');
     *     var request = require('request');
     *
     *     // Search code
     *     var defaults = {
     *         SearchType: 'Property',
     *         Class: 'ResidentialProperty',
     *         Query: '(ListingStatus=|A),(61=DADE)',
     *         QueryType: 'DMQL2', // 'DMQL'
     *         Count: 0,
     *         Format: 'COMPACT-DECODED',//'STANDARD-XML',
     *         Limit: 3,
     *         StandardNames: 1
     *     };
     *     var qs = util._extend(defaults, query);
     *     var delimiter = "\t";
     *     var headers = [];
     *     return request.get(config.host + rets.session.capabilities.Search, { qs: qs })
     *         .pipe(es.split())
     *         .pipe(es.map(function (line, cb) {
     *             if (/^<COLUMNS>/.test(line)) {
     *                 headers = _.trim(line.replace(/<\/?COLUMNS>/g, '')).split(delimiter);
     *                 cb();
     *             } else if (/^<DATA>/.test(line)) {
     *                 var row = _.zipObject(headers, _.trim(line.replace(/<\/?DATA>/g, '')).split(delimiter));
     *                 cb(null, JSON.stringify(row));
     *             } else if (/^<DELIMITER>/.test(line)) {
     *                 var octet = line.match(/value="([0-9]+)"/);
     *                 delimiter = String.fromCharCode(octet);
     *                 cb();
     *             } else {
     *                 cb();
     *             }
     *         }))
     *         .pipe(es.through(function (data) {
     *             this._buffer += data;
     *             if (typeof this._index === 'undefined') {
     *                 this.push('[');
     *                 this._index = 0;
     *             }
     *             this.push((this._index === 0 ? '':',') + data);
     *             this._index++;
     *         }, function () {
     *             this.push((typeof this._buffer === 'undefined' ? '[' : '') + ']');
     *             this.emit('end');
     *         }));
     * ======================================================================
     */
};

module.exports = RETS;
