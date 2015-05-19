/* jshint unused: false */

/**
 * RETSr.io rets.js RETS Client
 * @module RETS
 * @license MIT
 *
 * @see {@link http://retsr.io/rets.js}
 */

'use strict';

/** log facility */
var debug = require('debug')('rets.js:rets');

/** core deps */
var path         = require('path');
var os           = require('os');
var fs           = require('fs');
var util         = require('util');
var extend       = require('extend');
var url          = require('url');
var EventEmitter = require('events').EventEmitter;
var xml          = require('xml2js').parseString;

var request      = require('./request');
var response     = require('./response');
var Session      = require('./session');

/**
 * Constructs a RETS instance.
 *
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
 */
util.inherits(RETS, EventEmitter);
function RETS(options) {

    /**
     * @todo Document this pattern.
     */
    if (!(this instanceof RETS)) {
        return new RETS(options);
    }

    /**
     * Holds the original options passed by the user.
     *
     * @member {object|string}
     */
    this.options = options;

    if (typeof this.options === 'undefined') {
        throw new Error('options is required.');
    }
    if (typeof this.options.url === 'undefined') {
        throw new Error('options.url is required.');
    }
    if (typeof this.options.url !== 'string' && typeof this.options.url !== 'object') {
        throw new Error('options.url is not a string or an object.');
    }
    if (typeof this.options.url === 'string') {
        this.url = this.options.url = url.parse(this.options.url);
    } else {
        this.url = this.options.url;
    }
    if (typeof this.url.host !== 'string' || this.url.host.length < 1) {
        throw new Error('invalid options.url.host.');
    }
    if (typeof this.url.auth !== 'string' || this.url.auth.length < 2 || this.url.auth.indexOf(':') < 0 ) {
        throw new Error('invalid options.url.auth.');
    }

    /**
     * Holds default configuration values for the instance.
     *
     * @member {object}
     * @property {string} options.url - URL module compatible url object.
     * @property {string} options.ua.name - The provided user agent for authenticating.
     * @property {string} options.ua.pass -The provided password for user agent authentication.
     * @property {string} options.version - The version of RETS to speak: RETS/1.7.2
     */
    this.defaults = {
        url: null,
        ua: {
            name: 'RETS-Connector1/2',
            pass: ''
        },
        version: 'RETS/1.7.2'
    };

    /**
     * Holds the final configuration for the instance
     * after processing, defaults, validation, etc.
     */
    this.config = {};
    util._extend(this.config, this.defaults);
    util._extend(this.config, this.options);

    /**
     * Hold reference to Session instance.
     *
     * @member {Session}
     */
    this.session = new Session(this.config);

    /**
     * Init EventEmitter
     */
    EventEmitter.call(this);
}

/**
 * Execute login action/capability against RETS service.
 *
 * @param  {string|object} url A compliant URL string or URL module compatible url object.
 * @this RETS
 */
RETS.prototype.login = function (options) {
    var $this = this;

    return request(this.session, 'Login', {}, function(err){
        $this.emit('login',err);
    })
    .pipe(response())
    .on('capability',function(key, value){
        $this.session.capabilities[key] = value;
    })
    .on('setting',function(key, value){
        $this.session.settings[key] = value;
    })
    .on('finish',function(){
        $this.emit('login',null);
    });
};

/**
 * Execute logout action/capability against RETS service.
 *
 * @this RETS
 */
RETS.prototype.logout = function () {
    var $this = this;

    return request(this.session, 'Logout', {}, function(err){
        $this.emit('logout',err);
    })
    .pipe(response())
    .on('finish',function(){
        $this.emit('logout',null);
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
RETS.prototype.getMetadata = function () {
    var debug = require('debug')('rets.js:rets:Metadata Cache');
    var $this = this;
    var cache = null;
    var MetadataTimeStamp = new Date(this.session.settings.MetadataTimeStamp).getTime();
    var MetadataVersion = this.session.settings.MetadataVersion;
    // debug("this.session: \n%s", util.inspect(this.session, {colors: true}));
    var file = path.join(os.tmpdir(), this.session.url.host + '.metadata.json');
    debug("Time Stamp: %o", MetadataTimeStamp);
    debug("Version: %o", MetadataVersion);
    debug("File: %o", file);
    var exists = fs.existsSync(file);
    debug("File already exists: %o", exists);
    if ( exists ) {
        var CachedMetadataTimeStamp = null;
        var CachedMetadataVersion = null;
        cache = JSON.parse(fs.readFileSync(file));
        CachedMetadataTimeStamp = new Date(cache.timestamp).getTime();
        CachedMetadataVersion = cache.version;
        debug("Cache Time Stamp: %o", CachedMetadataTimeStamp);
        debug("Cache Version: %o", CachedMetadataVersion);
        var stale = (MetadataTimeStamp > CachedMetadataTimeStamp) && (MetadataVersion === CachedMetadataVersion);
        debug("Cache is stale?: %o", stale);
        if (!stale) {
            this.metadata = cache.payload;
            debug("Cache successfully loaded from file.");
            this.emit('metadata', null, this.metadata);
        }
    } else {
        var xml2js = require('xml2js');
        var parser = new xml2js.Parser({
            explicitRoot: false,
            normalizeTags: true,
            normalize: true,
            mergeAttrs: true,
            explicitArray: false,
            tagNameProcessors: [function(name){return name.toLowerCase();}],
            attrNameProcessors: [function(name){return name.toLowerCase();}]
        });

        var buffer = [];

        return request(this.session, 'GetMetadata', { qs: {Type: 'METADATA-SYSTEM', ID: '*', Format: 'STANDARD-XML'} }, function(err){
            $this.emit('metadata', err);
        })
        .pipe(response({parse:false}))
        .on('data',function(chunk){
            buffer.push(chunk.toString());
        })
        .on('finish',function(){
            buffer = buffer.join('');
            parser.addListener('end', function(result) {
                var cache = {
                    version: $this.session.settings.MetadataVersion,
                    timestamp: $this.session.settings.MetadataTimeStamp,
                    payload: result
                };
                $this.metadata = cache.payload;
                fs.writeFile(file, JSON.stringify(cache, null, 4), function(err) {
                    if(err) {debug(err);}
                    debug("Cache successfully written to file.");
                    $this.emit('metadata', null, $this.metadata);
                });
            });
            parser.parseString(buffer);
        });
    }
};

/**
 * Inspect RETS provider for this instance.
 *
 */
RETS.prototype.inspect = function () {

    var Table = require('cli-table');

    debug("SETTINGS:");
    var settings = new Table({
        head: ['key', 'value']
    });
    for (var setting in this.session.settings) {
        if (this.session.settings.hasOwnProperty(setting)) {
            settings.push([setting, this.session.settings[setting]]);
        }
    }
    settings.toString().split("\n").forEach(function(line){
        debug(line);
    });

    debug("CAPABILITIES:");
    var capabilities = new Table({
        head: ['key', 'value']
    });
    for (var capability in this.session.capabilities) {
        if (this.session.capabilities.hasOwnProperty(capability)) {
            capabilities.push([capability, this.session.capabilities[capability]]);
        }
    }
    capabilities.toString().split("\n").forEach(function(line){
        debug(line);
    });

    var resources = this.metadata.metadata['metadata-system'].system['metadata-resource'].resource;//[1]['metadata-class'].class;
    // debug("resources: \n%s", util.inspect(resources, { colors: true, depth: 2 }));// resources[i].resourceid, "\n" + util.inspect(resources[i], { depth: 0 }) + "\n");
    var classes = [];
    var table = new Table({
        head: ['resourceid', 'standardname', 'visiblename', 'description', 'keyfield', 'classcount']
    });
    resources.forEach(function(resource){
        if (parseInt(resource.classcount) === 1) {
            classes.push(resource['metadata-class'].class);
        } else {
            resource['metadata-class'].class.forEach(function(cls){
                classes.push(cls);
            });
        }
        table.push([
            resource.resourceid,
            resource.standardname,
            resource.visiblename,
            resource.description,
            resource.keyfield,
            resource.classcount
        ]);
    });
    debug("RESOURCES:");
    table.toString().split("\n").forEach(function(line){
        debug(line);
    });

    table = new Table({
        head: ['classname', 'standardname', 'visiblename', 'description']
    });
    classes.forEach(function(cls){
        table.push([
            cls.classname,
            cls.standardname,
            cls.visiblename,
            cls.description
        ]);
    });

    debug("CLASSES:");
    table.toString().split("\n").forEach(function(line){
        debug(line);
    });

};

/**
 * Execute GetObject action/capability against RETS service.
 *
 * @see Section 5 {@link http://www.reso.org/assets/RETS/Specifications/rets_1_8.pdf}
 *
 * @param  {Object} options GetObject Request Options
 * @param  {string} options.resource Resource identifier
 * @param  {string} options.type     Object type
 * @param  {string} options.id       Related record id
 * @param  {bool} options.location Return binary or as URL
 */
RETS.prototype.getObject = function (options) {
    var $this = this;

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
 * @this RETS
 *
 * @param {Object} options - A compliant URL string or URL module compatible url object.
 * @param {string} options.SearchType - Resource to search against
 * @param {string} options.Class - Class to search against
 * @param {string} options.Query - DMQL(2) query
 * @param {string} options.QueryType - Specify DMQL or DMQL2 query
 * @param {Number} options.Count - Boolean; should the server return a record count
 * @param {string} options.Offset - Offset record to start with
 * @param {string} options.Select - Fields to return
 * @param {String} options.Format - Data format type COMPACT, COMPACT-DECODED or STANDARD-XML
 * @param {Number} options.Limit - Record limit to fetch
 * @param {Number} options.StandardNames - Boolean to return fields as StandardNames
 */
RETS.prototype.search = function (options) {
    var $this = this;

    var objectMode = options.objectMode || false;
    var format = options.format || 'objects'; // arrays
    var headers = options.headers || true; // arrays

    delete options.objectMode;
    delete options.format;
    delete options.headers;

    var defaults = {
        SearchType: 'Property',
        Class: 'ResidentialProperty',
        Query: '(Status=|A)',
        QueryType: 'DMQL2', // 'DMQL'
        Count: 1,
        // Offset: 1, // Don't set offset by default
        // Select: '*',
        Format: 'COMPACT-DECODED',//'STANDARD-XML',
        // Limit: 0, // Disable default setting of limit
        StandardNames: 1
    };

    var qs = util._extend(defaults, options);

    return request(this.session, 'Search', { qs: qs }, function(err){
        $this.emit('search',err);
    })
    .pipe(response({format:format, objectMode: objectMode, headers: headers}))
    .on('finish',function(){
        $this.emit('search',null, this);
    });
};

module.exports = RETS;
