/**
 * RETSr.io rets.js RETS Client
 * @module RETS
 * @license MIT
 * @author Danny Graham
 *
 * @see {@link http://usejsdoc.org/}
 *
 */

var util = require('util');
// var debug = require('debug')('rets.js:response');
var Transform = require('stream').Transform;
var bodyparser = require('./bodyparse');
var sax = require('sax');

util.inherits(response,Transform);

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
function response(options) {

    if (!(this instanceof response))
        return new response(options);

    var self = this;
    
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

    this.parser = sax.parser(false, {trim:true});
    this.parser.onopentag = function(tag) {
        if (typeof bodyparser.open[tag.name] === 'function') {
            bodyparser.open[tag.name].call(self,tag);
        }
    };

    this.parser.onclosetag = function(tagName) {
        if (typeof bodyparser.close[tagName] === 'function') {
            bodyparser.close[tagName].call(self,tagName);
        }
    };

    this.parser.ontext = function(text) {
        bodyparser.text.call(self,text);
    };

    this.parser.onend = function() {
        // debug('saxend');
    };

    // init Transform
    Transform.call(this);
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
response.prototype._transform = function(chunk, encoding, done) {
    this.parser.write(chunk.toString('utf8'));
    this.push(chunk);
    done();
};

module.exports = response;