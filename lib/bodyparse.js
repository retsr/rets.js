/**
 * RETSr.io rets.js RETS Client
 * @module RETS
 * @license MIT
 * @author Danny Graham
 *
 * @see {@link http://usejsdoc.org/}
 *
 */

var debug = require('debug')('rets.js:bodyparse');
var RETSError = require('./error');

function noop(){};

var bufferTag = null;

var bodyparser = {};
bodyparser.open = {
    "RETS": function(tag){
          this.replyCode = tag.attributes.REPLYCODE;
          this.replyText = tag.attributes.REPLYTEXT;

          if (this.replyCode !== '0') {
               this.emit('error', new RETSError(this.replyCode));
          }
    },
    "RETS-RESPONSE": function(tag){
          bufferTag = tag;
    },
    "RETS-STATUS": noop,
    "COLUMNS": noop,
    "COUNT": noop,
    "DATA": noop,
    "DELIMITER": noop,
    "MAX-ROWS": noop,
};

bodyparser.close = {
    "RETS": noop,
    "RETS-RESPONSE": function(tagName){
          bufferTag = null;
    },
    "RETS-STATUS": noop,
    "COLUMNS": noop,
    "COUNT": noop,
    "DATA": noop,
    "DELIMITER": noop,
    "MAX-ROWS": noop,
};

bodyparser.text = function(text) {
    if (bufferTag === null) return;

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

                    var split   =  line.split( '=' );
                    var key     =  split[0].replace(/^\s+|\s+$/g, '' );
                    var value   =  split[1].replace(/^\s+|\s+$/g, '' );
                    if (/^\//.test(value)) { //todo: test for FQDN URLs vs site-root relative links
                         self.emit('capability', key, value);
                    } else {
                         self.emit('setting', key, value);
                    }
               });

          break;
    }
};


module.exports = bodyparser;