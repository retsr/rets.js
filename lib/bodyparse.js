/**
 * RETSr.io rets.js RETS Client
 * @module RETS
 * @license MIT
 * @author Danny Graham
 *
 * @see {@link http://usejsdoc.org/}
 *
 */

// var debug = require('debug')('rets.js:bodyparse');
var RETSError = require("./error");

var bufferTag = null;

function buffer(tag) {
     bufferTag = tag;
}
function clearBuffer() {
     bufferTag = null;
}

var bodyparser = {};
bodyparser.open = {
    "RETS": function(tag){
        this.replyCode = tag.attributes.REPLYCODE;
        this.replyText = tag.attributes.REPLYTEXT;

        if (this.replyCode !== "0") {
            this.emit("error", new RETSError(this.replyCode));
        }
    },
    "RETS-STATUS": function(tag){
        this.replyCode = tag.attributes.REPLYCODE;
        this.replyText = tag.attributes.REPLYTEXT;

        if (this.replyCode !== "0") {
            this.emit("error", new RETSError(this.replyCode));
        }
    },
    "RETS-RESPONSE": buffer,
    "COLUMNS": buffer,
    "COUNT": function(tag){
        this.count = tag.attributes.RECORDS;
        // debug('discovered %s records', this.count);
    },
    "DATA": buffer,
    "DELIMITER": function(tag){
        this.delimiter = String.fromCharCode(parseInt(tag.attributes.VALUE));
    },
    "MAXROWS": function(/* tag */){
        // debug('maxrows hit at record %s of %s records',this.records, this.count);
    },
};

bodyparser.close = {
    "RETS-RESPONSE": clearBuffer,
    "COLUMNS": clearBuffer,
    "DATA": clearBuffer,
};

bodyparser.text = function(text) {
    if (bufferTag === null) {
        return;
    }

    var self = this;
    switch(bufferTag.name) {
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
                    self.emit("capability", key, value);
                } else {
                    self.emit("setting", key, value);
                }
            });
        break;
        case "COLUMNS":
            this.columns = text.split("\t");
            this.emit("columns", this.columns);

            // If we're streaming csv, the first chunk will be the columns
            if (this.options.format === "csv") {
               this.emit("data", this.columns);
            }
        break;
        case "DATA":
            if (this.options.format === "object") {
               var values = text.split(this.delimiter);
               var record = {};
               this.columns.forEach(function(column,index){
                    record[column] = values[index];
               });
               this.push(record);
            } else if (this.options.format === "csv") {
               // this.emit("data",text.split(this.delimiter));
               this.push(text);
            }
            this.records++;
        break;
    }
};


module.exports = bodyparser;
