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


var util = require('util');
var debug = require('debug')('rets.js:rets');
var EventEmitter = require('events').EventEmitter;

// var codes = require('./codes');
var request = require('./request');
var response = require('./response');
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

    // init EventEmitter
    EventEmitter.call(this);
}

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

    return request(this.session, 'Login', {}, function(err){
        self.emit('login',err);
    })
    .pipe(response())
    .on('capability',function(key, value){
        self.session.capabilities[key] = value;
    })
    .on('setting',function(key, value){
        self.session.settings[key] = value;
    })
    .on('finish',function(){
        self.emit('login',null);
    });
};

/**
 * Execute logout action/capability against RETS service.
 * 
 * @this RETS
 */
RETS.prototype.logout = function () {
    var self = this;

    return request(this.session, 'Logout', {}, function(err){
        self.emit('logout',err);
    })
    .pipe(response())
    .on('finish',function(){
        self.emit('logout',null);
    });
};

/**
 * Execute GetMetadata action/capability against RETS service.
 *
 * @see {@link http://www.reso.org/assets/RETS/Specifications/rets_1_8.pdf}
 * 
 * @param  {Object} options   GetMetadata Request Options:
 * @param  {string} options.type   Metadata types can be:
 *                         METADATA-LOOKUP, METADATA-LOOKUP_TYPE, METADATA-FOREIGN_KEY, METADATA-FILTER, 
 *                         METADATA-FILTER_TYPE, METADATA-RESOURCE, METADATA-CLASS, METADATA-OBJECT, 
 *                         METADATA-TABLE, METADATA-SYSTEM, METADATA-UPDATE, METADATA-UPDATE_TYPE, 
 *                         METADATA-SEARCH_HELP, etc.
 * @param  {string} options.id     Resource ID to lookup
 * @param  {string} options.format XML-Standard
 */
RETS.prototype.getMetadata = function (options) {
    var self = this;

    var defaults = {
        Type: 'METADATA-RESOURCE',
        ID: 'Property',
        Format: 'STANDARD-XML'
    };

    var qs = util._extend(defaults, options);

    return request(this.session, 'GetMetadata', { qs: qs }, function(err){
        self.emit('metadata',err);
    })
    .pipe(response())
    .on('finish',function(){
        self.emit('metadata',null);
    });
};

/**
 * Execute GetObject action/capability against RETS service.

 * @see Section 5 {@link http://www.reso.org/assets/RETS/Specifications/rets_1_8.pdf}
 * 
 * @param  {Object} options GetObject Request Options
 * @param  {string} options.resource Resource identifier
 * @param  {string} options.type     Object type
 * @param  {string} options.id       Related record id
 * @param  {bool} options.location Return binary or as URL
 */
RETS.prototype.getObject = function (options) {
    var self = this;
    
    var defaults = {
        Resource: 'Property',
        Type: 'PHOTO',
        ID: '*',
        Location: 0
    };

    var qs = util._extend(defaults, options);
    this.emit('object', new Error('Not implemented'));
};

/**
 * Execute search action/capability against RETS service.
 *
 * @param  {Object} options - A compliant URL string or URL module compatible url object.
 *
 * @this RETS
 *
 * @todo Migrate code from rest-old.
 *
 */
RETS.prototype.search = function (options) {
    var self = this;

    var defaults = {
        SearchType: 'Property',
        Class: 'ResidentialProperty',
        Query: '(Status=|A)',
        QueryType: 'DMQL2', // 'DMQL'
        Count: 1,
        Format: 'COMPACT-DECODED',//'STANDARD-XML',
        Limit: 0,
        StandardNames: 1
    };

    var qs = util._extend(defaults, options);

    return request(this.session, 'Search', { qs: qs }, function(err){
        self.emit('search',err);
    })
    .pipe(response())
    .on('finish',function(){
        self.emit('search',null);
    });

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
