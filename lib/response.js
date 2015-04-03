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
var debug = require('debug')('rets.js:response');
var Transform = require('stream').Transform;
var codes = require('./codes');

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

    this._parsing = false;

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
    var self = this;
    var chunks = chunk.toString().split("\n");
    chunks.forEach(function(line){
        // debug(line);
        self._parse(line);
        self.push(line);
    });
    done();
};

/**
 * Parse an incoming line for RETS Response data
 *
 * @see {@link http://www.reso.org/assets/RETS/Specifications/rets_1_8.pdf}
 * 
 * @param  {string} line - buffered chunk as single line
 * @return {string} transformed line to be pushed
 *
 * @todo migrate tags and matching expressions out
 * @todo generic detection for starting/closing tags
 * @todo detect count
 * @todo detect maxrows
 * @todo detect columns
 * @todo detect row data
 * @todo rets-response is always in key/value pairs and not necessarily capabilities
 * @todo detect metadata
 * @todo detect rets-status
 * @todo implement RETS Error
 */
response.prototype._parse = function(line) {
    var replyCode = /.*<RETS.*ReplyCode=\"([0-9]*)\".*>/i;
    var replyText = /.*<RETS.*ReplyText=\"(.*)\".*>/i;
    var retsResponse = /.*<RETS-RESPONSE>(.*)/ig;
    var closeTag = /<\.*>/i;

    var matches;

    if ((matches = line.match(replyCode))) {
        //todo: emit RETS Error
        if (matches[1] !== '0') {
            this.emit('error', new Error(codes[matches[1]]));
        }
    }

    if ((matches = line.match(replyText))) {
        // debug(matches[1]);
    }

    if ((matches = line.match(retsResponse))) {
        this._parsing = true;
    }

    if (this._parsing === true) {
        /**
         * key-value-body
         * ::= <RETS-RESPONSE>CRLF
         * *(key = value CRLF)
         *  </RETS-RESPONSE>
         */
        if (closeTag.test(line)) {
            this._parsing = false;
        }

        if (/^[^\s+<]/.test(line)) {
            var split   =  line.split( '=' );
            var key     =  split[0].replace(/^\s+|\s+$/g, '' );
            var value   =  split[1].replace(/^\s+|\s+$/g, '' );
            // if (value.indexOf('/') === 0) {
            if (/^\//.test(value)) { //todo: test for FQDN URLs vs site-root relative links
                //todo: parse capabilities and ensure a full url path
                this.emit('capability', key, value);
            } else {
                this.emit('setting', key, value);
            }
        }
    }

};

module.exports = response;