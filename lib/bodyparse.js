/**
 * RETSr.io rets.js RETS Client
 * @module RETS
 * @license MIT
 * @author Luis Gomez
 *
 * @see {@link http://usejsdoc.org/}
 *
 */

var debug = require('debug')('rets.js:bodyparse');
var codes = require('./codes');

var replyCode = /.*<RETS.*ReplyCode=\"([0-9]*)\".*>/i;
var replyText = /.*<RETS.*ReplyText=\"(.*)\".*>/i;
var retsResponse = /.*<RETS-RESPONSE>(.*)/ig;
var retsStatus = /.*<RETS-STATUS>(.*)/ig;
var maxRows = /.*<MAX-ROWS>(.*)/ig;
var count = /.*<COUNT>(.*)/ig;
var columns = /^<COLUMNS>/i;
var endColumns = /<\/?COLUMNS>/ig;
var data = /^<DATA>/i;
var delimiter = /^<DELIMITER>/i;
var closeTag = /<\.*>/i;
