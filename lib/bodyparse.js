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

function bodyparse(buffer) {
    /**
     * Imported code from ./rets-old.js as reference. Deprecating that file.
     * DELETE THIS AFTER IMPLEMENTING
     * ======================================================================
     *     // Imports form top of file.
     *     var es = require('event-stream');
     *     var request = require('request');
     *
     *     // Search code
     *     var defaults = {
     *         SearchType: 'Property',
     *         Class: 'ResidentialProperty',
     *         Query: '(ListingStatus=|A),(61=DADE)',
     *         QueryType: 'DMQL2', // 'DMQL'
     *         Count: 0,
     *         Format: 'COMPACT-DECODED',//'STANDARD-XML',
     *         Limit: 3,
     *         StandardNames: 1
     *     };
     *     var qs = util._extend(defaults, query);
     *     var delimiter = "\t";
     *     var headers = [];
     *     return request.get(config.host + rets.session.capabilities.Search, { qs: qs })
     *         .pipe(es.split())
     *         .pipe(es.map(function (line, cb) {
     *             if (/^<COLUMNS>/.test(line)) {
     *                 headers = _.trim(line.replace(/<\/?COLUMNS>/g, '')).split(delimiter);
     *                 cb();
     *             } else if (/^<DATA>/.test(line)) {
     *                 var row = _.zipObject(headers, _.trim(line.replace(/<\/?DATA>/g, '')).split(delimiter));
     *                 cb(null, JSON.stringify(row));
     *             } else if (/^<DELIMITER>/.test(line)) {
     *                 var octet = line.match(/value="([0-9]+)"/);
     *                 delimiter = String.fromCharCode(octet);
     *                 cb();
     *             } else {
     *                 cb();
     *             }
     *         }))
     *         .pipe(es.through(function (data) {
     *             this._buffer += data;
     *             if (typeof this._index === 'undefined') {
     *                 this.push('[');
     *                 this._index = 0;
     *             }
     *             this.push((this._index === 0 ? '':',') + data);
     *             this._index++;
     *         }, function () {
     *             this.push((typeof this._buffer === 'undefined' ? '[' : '') + ']');
     *             this.emit('end');
     *         }));
     * ======================================================================
     */

}

module.exports = bodyparse;