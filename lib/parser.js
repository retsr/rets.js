/**
 * RETSr.io rets.js RETS Client
 * @module RETS
 * @license MIT
 *
 * @see {@link http://retsr.io/rets.js}
 */

'use strict';

module.exports = Parser;

/** log facility */
var debug = require('debug')('rets.js:parser');

/** core deps */
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var sax = require('sax');

var RETSError = require("./error");

var CRLF = "\n";

util.inherits(Parser,EventEmitter);
function Parser(options){

    var $this = this;

    this.callback = function noop(){};
    this.bufferTag = null;

    this.options = options;

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

    // Seting the default value this way since that's what a RETS
    // server will typically send back: '09'
    this.delimiter = String.fromCharCode(9);

    // We definitely don't want to lose whitespace;
    this.xml = sax.createStream(false, {trim:false});

    this.xml.onopentag = function(tag) {
        // debug('sax:onopen');
        $this.parseTag(tag.name, tag);
    };

    this.xml.onclosetag = function(tagName) {
        // debug('sax:onclose');
        switch(tagName) {
            case 'RETS-RESPONSE':
                debug('sax:onclose tag %s', tagName);
                $this.clearBuffer();
            break;
            case 'COLUMNS':
                debug('sax:onclose tag %s', tagName);
                $this.clearBuffer();
            break;
            case 'DATA':
                debug('sax:onclose tag %s', tagName);
                $this.clearBuffer();
            break;
            default:
        }
    };

    this.xml.ontext = function(body) {
        // debug('sax:ontext');
        $this.parseText(body);
    };

    this.xml.onend = function() {
        debug('sax:onend');
    };

    this.xml.onerror = function(error) {
        $this.emit('error',error);
        $this.xml.error = null;
        $this.xml.resume();
    };

    EventEmitter.call(this);
}

Parser.prototype.buffer = function(tag) {
    debug('buffering tag %s', tag.name);
    this.bufferTag = tag;
};

Parser.prototype.clearBuffer = function() {
    debug('clearing buffer');
    this.bufferTag = null;
    this.callback();
};

Parser.prototype.parseTag = function(tagName, tag) {
    switch(tagName) {
        case 'RETS':
            debug('discovered tag %s', tagName);
            this.parseStatus(tag);
            this.callback();
        break;
        case 'RETS-STATUS':
            debug('discovered tag %s', tagName);
            this.parseStatus(tag);
            this.callback();
        break;
        case 'RETS-RESPONSE':
            debug('discovered tag %s', tagName);
            this.buffer(tag);
        break;
        case 'COLUMNS':
            debug('discovered tag %s', tagName);
            this.buffer(tag);
        break;
        case 'COUNT':
            debug('discovered tag %s', tagName);
            this.emit('count', tag.attributes.RECORDS);
            this.callback();
        break;
        case 'DATA':
            debug('discovered tag %s', tagName);
            this.buffer(tag);
        break;
        case 'DELIMITER':
            debug('discovered tag %s', tagName);
            this.emit('delimiter', String.fromCharCode(parseInt(tag.attributes.VALUE)));
            this.callback();
        break;
        case 'MAXROWS':
            debug('discovered tag %s', tagName);
            this.emit('maxrows');
            this.callback();
        break;
        default:
    }
};

Parser.prototype.parseStatus = function(tag) {
    this.emit('status', {
        code: tag.attributes.REPLYCODE,
        message: tag.attributes.REPLYTEXT
    });

    if (tag.attributes.REPLYCODE !== '0') {
        this.emit('error', new RETSError(tag.attributes.REPLYCODE, tag.attributes.REPLYTEXT));
    }
};

Parser.prototype.parseText = function(text) {
    if (this.bufferTag === null) {
        return;
    }

    var $this = this;
    switch(this.bufferTag.name) {
        case 'RETS-RESPONSE':
            debug('parsing %s', this.bufferTag.name);
            /**
             * key-value-body
             * ::= <RETS-RESPONSE>CRLF
             * *(key = value CRLF)
             *  </RETS-RESPONSE>
             */
            var lines = text.trim().split("\n");
            lines.forEach(function(line){
                var split   =  line.split( '=' );
                var key     =  split[0].replace(/^\s+|\s+$/g, '' );
                var value   =  split[1].replace(/^\s+|\s+$/g, '' );
                if (/^\//.test(value)) { //todo: test for FQDN URLs vs site-root relative links
                    $this.emit('capability', key, value);
                } else {
                    $this.emit('setting', key, value);
                }
            });
        break;
        case 'COLUMNS':
            debug('parsing %s', this.bufferTag.name);
            this.columns = text.trim().split(this.delimiter);

            if (this.options.objectMode) {
                this.emit('columns',this.columns);
            } else if (this.options.format === 'csv') {
                this.emit('columns',text + CRLF);
            } else {
                this.emit('columns',JSON.stringify(this.columns) + CRLF);
            }
        break;
        case 'DATA':
            debug('parsing %s', this.bufferTag.name);

            var cleantext = text.replace(/^\t/,'').replace(/\t$/,'');
            var record = null;

            if (this.options.format === 'objects') {
                var values = cleantext.split(this.delimiter);
                record = {};
                this.columns.forEach(function(column,index){
                    record[column] = values[index];
                });

                if (this.options.objectMode) {
                    this.emit('data',record);
                } else {
                    this.emit('data',JSON.stringify(record) + CRLF);
                }

            } else if (this.options.format === 'arrays') {
                if (this.options.objectMode) {
                    this.emit('data',cleantext.split(this.delimiter));
                } else {
                    this.emit('data',JSON.stringify(cleantext.split(this.delimiter)) + CRLF);
                }
            } else if (this.options.format === 'csv') {
                var linebreak = /.*([\n\r\"\,]*).*/g;
                record = cleantext.split(this.delimiter).map(function(value){
                    if (linebreak.test(value)) {
                        return '"' + value + '"';
                    } else {
                        return value;
                    }
                }).join(this.delimiter);

                this.emit('data',record + CRLF);
            }
            this.records++;
        break;
        default:
    }
};

Parser.prototype.write = function(chunk, callback) {
    if (typeof callback === 'function') {
        this.callback = callback;
    }
    this.xml.write(chunk);
};
