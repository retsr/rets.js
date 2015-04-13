/**
 * RETSr.io rets.js RETS Client
 * @module RETS
 * @license MIT
 *
 * @see {@link http://retsr.io/rets.js}
 */

'use strict';

module.exports = Response;

/** log facility */
var debug = require('debug')('rets.js:response');

/** core deps */
var util = require('util');
var Transform = require('stream').Transform;

var Parser = require('./parser');

/**
 * @description Constructs a RETS Response instance
 * @constructor
 * @class
 * @inherits stream.Transform
 * @requires module:codes
 *
 * @param  {Object} options - options to pass to `stream.Transform` constructor
 * @return {response} - Returns an instance of RETS Response
 */
util.inherits(Response,Transform);
function Response(options) {

    if (!(this instanceof Response)) {
        return new Response(options);
    }

    var $this = this;

    /**
     * The record count returned by the server
     * @member {Number} count - the record count returned by the server
     */
    this.count = 0;

    /**
     * The number of records processed
     * @member {Number} records - the total records processed
     */
    this.records = 0;

    this.columns = [];

    this.replyCode = -1;
    this.replyText = '';

    // Seting the default value this way since that's what a RETS
    // server will typically send back: '09'
    this.delimiter = String.fromCharCode(9);

    var defaults = {
        format: 'raw'
    };

    this.options = util._extend(defaults, options);

    /**
     * Will the transform be streaming objects
     * @member {bool}
     */
    this.objectMode = (this.options.format === 'object') ? true : false;

    this.parser = new Parser();
    this.parser.on('error',function(error){
        debug(error);
    })
    .on('status',function(status){
        debug('discovered status');
        $this.replyCode = status.code;
        $this.replyText = status.message;
    })
    .on('capability', function(key, value){
        debug('discovered capability');
        $this.emit("capability", key, value);
    })
    .on('setting', function(key, value){
        debug('discovered setting');
        $this.emit("setting", key, value);
    })
    .on('columns', function(columns){
        debug('discovered columns');
        $this.columns = columns;
    })
    .on('count', function(records){
        debug('discovered count');
        $this.count = records;
    })
    .on('data', function(record){
        debug('discovered record');
        $this.records++;
    })
    .on('delimiter', function(delimiter){
        debug('discovered delimiter');
        $this.delimiter = delimiter;
    })
    .on('maxrows', function(){
        debug('discovered maxrows');
        $this.emit('maxrows', {
            count: $this.count,
            records: $this.records
        });
    });

    // init Transform
    Transform.call(this, {
        objectMode: this.objectMode
    });
}

/**
 * Implements stream.Transform interface; Splits
 * chunks by CRLF and passes them to the parser
 *
 * @param  {Buffer}   chunk - original buffer chunk
 * @param  {string}   encoding - string for decoding chunk
 * @param  {Function} done - callback
 * @return {void}
 */
Response.prototype._transform = function(chunk, encoding, done) {
    var $this = this;
    this.parser.write(chunk.toString('utf8'),function(){
        debug('Callback');
    });
    this.push(chunk);
    done();
};

