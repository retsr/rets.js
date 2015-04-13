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

util.inherits(Parser,EventEmitter)
function Parser(options){

    var $this = this;

    this.callback = function noop(){};
    this.bufferTag = null;

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

    this.xml = sax.createStream(false, {trim:true});

    this.xml.onopentag = function(tag) {
        debug('sax:onopen');
        $this.parseTag(tag.name, tag);
    };

    this.xml.onclosetag = function(tagName) {
        debug('sax:onclose');
        $this.clearBuffer();
    };
    this.xml.ontext = function(body) {
        debug('sax:ontext');
        $this.parseText(body);
    };
    this.xml.onend = function(){
        debug('sax:onend');
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
    debug('discovered tag %s', tagName);
    switch(tagName) {
        case 'RETS':
            this.parseStatus(tag);
            this.callback();
        break;
        case 'RETS-STATUS':
            this.parseStatus(tag);
            this.callback();
        break;
        case 'RETS-RESPONSE':
            this.buffer(tag);
        break;
        case 'COLUMNS':
            this.buffer(tag);
        break;
        case 'COUNT':
            this.emit('count', tag.attributes.RECORDS);
            this.callback();
        break;
        case 'DATA':
            this.buffer(tag);
        break;
        case 'DELIMITER':
            this.emit('delimiter', String.fromCharCode(parseInt(tag.attributes.VALUE)));
            this.callback();
        break;
        case 'MAXROWS':
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
        this.emit('error', new RETSError(tag.attributes.REPLYCODE));
    }
};

Parser.prototype.parseText = function(text) {
    if (this.bufferTag === null) {
        return;
    }

    var $this = this;
    switch(this.bufferTag.name) {
        case "RETS-RESPONSE":
            /**
             * key-value-body
             * ::= <RETS-RESPONSE>CRLF
             * *(key = value CRLF)
             *  </RETS-RESPONSE>
             */
            var lines = text.split("\n");
            lines.forEach(function(line){

                var split   =  line.split( "=" );
                var key     =  split[0].replace(/^\s+|\s+$/g, "" );
                var value   =  split[1].replace(/^\s+|\s+$/g, "" );
                if (/^\//.test(value)) { //todo: test for FQDN URLs vs site-root relative links
                    $this.emit("capability", key, value);
                } else {
                    $this.emit("setting", key, value);
                }
            });
        break;
        case "COLUMNS":
            this.columns = text.split(this.delimiter);
            this.emit("columns", this.columns);
        break;
        case "DATA":
            if (this.options.format === "object") {
               var values = text.split(this.delimiter);
               var record = {};
               this.columns.forEach(function(column,index){
                    record[column] = values[index];
               });
               this.emit("data",record);
            } else if (this.options.format === "csv") {
               this.emit("data",text.split(this.delimiter));
            }
            this.records++;
        break;
        default:
    }
};

Parser.prototype.write = function(chunk, callback) {
    if (typeof callback === 'function') this.callback = callback;
    this.xml.write(chunk);
};