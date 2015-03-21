var assert = require('assert');
var URL = require('url');
var util = require('util');
var _ = require('lodash');
var debug = require('debug')('lowmango:rets');
var md5 = require('MD5');
var es = require('event-stream');
var Transform = require('stream').Transform;
var request = require('request');

var rets = {};

rets.session = {
    capabilities: {}
};

request = request.defaults({
    headers: {
        'RETS-UA-Authorization': 'Digest ' + md5([md5([config.user, config.password].join(':').trim()),'','','RETS/1.7.2'].join(':')),
        'RETS-Version': 'RETS/1.7.2',
        'User-Agent': config.user
    },
    auth: {
        user: config.user,
        pass: config.password,
        sendImmediately: false
    },
    jar: true
});

rets.login = function (req, res, next) {
    debug("login()");
    request.get(config.host + config.path)
        .pipe(es.split())
        .pipe(es.map(function(line, cb){
            if (/^[^\s+<]/.test(line)) {
                var split   = line.split( '=' );
                var key     =  split[0].replace(/^\s+|\s+$/g, '' );
                var value   =  split[1].replace(/^\s+|\s+$/g, '' );
                // if (value.indexOf('/') === 0) {
                if (/^\//.test(value)) {
                    rets.session.capabilities[key] = value;
                } else {
                    rets.session[key] = value;
                }
                cb(null, JSON.stringify(rets.session));
            } else {
                cb();
            }
        })).pipe(es.through(function(data){
            this.emit('data', data);
        }, function(){
            this.emit('end');
            debug("session: %s", util.inspect(rets.session, {colors: true}));
            next();
        }));
};

rets.search = function (query) {
    debug("search()");
    var defaults = {
        SearchType: 'Property',
        Class: 'ResidentialProperty',
        Query: '(ListingStatus=|A),(61=DADE)',
        QueryType: 'DMQL2', // 'DMQL'
        Count: 0,
        Format: 'COMPACT-DECODED',//'STANDARD-XML',
        Limit: 3,
        StandardNames: 1
    };
    var qs = util._extend(defaults, query);
    var delimiter = "\t";
    var headers = [];
    return request.get(config.host + rets.session.capabilities.Search, { qs: qs })
        .pipe(es.split())
        .pipe(es.map(function (line, cb) {
            if (/^<COLUMNS>/.test(line)) {
                headers = _.trim(line.replace(/<\/?COLUMNS>/g, '')).split(delimiter);
                cb();
            } else if (/^<DATA>/.test(line)) {
                var row = _.zipObject(headers, _.trim(line.replace(/<\/?DATA>/g, '')).split(delimiter));
                cb(null, JSON.stringify(row));
            } else if (/^<DELIMITER>/.test(line)) {
                var octet = line.match(/value="([0-9]+)"/);
                delimiter = String.fromCharCode(octet);
                cb();
            } else {
                cb();
            }
        }))
        .pipe(es.through(function (data) {
            debug("data: %s", util.inspect(JSON.parse(data), {colors: true}));
            this._buffer += data;
            if (typeof this._index === 'undefined') {
                this.push('[');
                this._index = 0;
            }
            this.push((this._index === 0 ? '':',') + data);
            this._index++;
        }, function () {
            debug("this._buffer: %o", this._buffer);
            this.push((typeof this._buffer === 'undefined' ? '[' : '') + ']');
            this.emit('end');
        }));
};
module.exports = rets;
