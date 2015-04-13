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

    this.xml = {
        sax: sax.parser(false, {trim:true}),
        open: function(tag) {
            $this.parseTag(tag.name, tag);
        },
        close: function(tagName) {
            $this.clearBuffer();
        },
        text: function(body) {
            $this.parseText(body);
        },
        end: function(){
        }
    };

    this.xml.sax.onopen = this.xml.open;
    this.xml.sax.onclose = this.xml.close;
    this.xml.sax.ontext = this.xml.text;
    this.xml.sax.onend = this.xml.end;

    EventEmitter.call(this);
}

Parser.prototype.buffer = function(tag) {
    this.bufferTag = tag;
};

Parser.prototype.clearBuffer = function() {
    this.bufferTag = null;
};

Parser.prototype.parseTag = function(tagName, tag) {
    switch(tag) {
        case 'RETS':
            this.parseStatus(tag);
        break;
        case 'RETS-STATUS':
            this.parseStatus(tag);
        break;
        case 'RETS-RESPONSE':
            this.buffer(tag);
        break;
        case 'COLUMNS':
            this.buffer(tag);
        break;
        case 'COUNT':
            this.emit('count', tag.attributes.RECORDS);
        break;
        case 'DATA':
            this.buffer(tag);
        break;
        case 'DELIMITER':
            this.emit('delimiter', String.fromCharCode(parseInt(tag.attributes.VALUE)));
        break;
        case 'MAXROWS':
            this.emit('maxrows');
        break;
        default:
    }
};

Parser.prototype.parseStatus = function(tag) {
    this.emit('status', { 
        code: tag.attributes.REPLYCODE, 
        message: tag.attributes.REPLYTEXT
    });

    if (this.replyCode !== '0') {
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
            this.callback(text);
        break;
        case "COLUMNS":
            this.columns = text.split(this.delimiter);
            this.emit("columns", this.columns);
            this.callback(text);
        break;
        case "DATA":
            if (this.options.format === "object") {
               var values = text.split(this.delimiter);
               var record = {};
               this.columns.forEach(function(column,index){
                    record[column] = values[index];
               });
               this.callback(record);
            } else if (this.options.format === "csv") {
               // this.emit("data",text.split(this.delimiter));
               this.callback(text);
            }
            this.records++;
        break;
        default:
            this.callback(text);
    }
};

Parser.prototype.write = function(chunk, callback) {
    if (typeof callback === 'function') this.callback = callback;
    this.xml.sax.write(chunk);
};