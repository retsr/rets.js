var URL = require('url');
var util = require('util');
var request = require('request');
var debug = require('debug')('rets.js:session');
var md5 = require('MD5');
var _ = require('lodash');
var es = require('event-stream');
var Transform = require('stream').Transform;

function Session(url, options) {

    /**
     * Default User Agent
     * @default
     * @member {String} UA - The User Agent for the Session
     */
    this.UA = options.userAgent || 'RETS-Connector1/2';

    /**
     * Default User Agent Password
     * @default
     * @member {String} UAP - User Agent Password for the Session
     */
    this.UAP = options.userAgentPassword || '';

    /** @member {Object} */
    this.url = URL.parse(url);

    /** @member {Object} */
    this.user = {
        name: this.url.auth.split(':')[0] || null,
        pass: this.url.auth.split(':')[1] || null
    };

    /** @member {String} */
    this.version = options.version || 'RETS/1.7.2';

    /** @member {Object} */
    this.headers = {
        'RETS-UA-Authorization': 'Digest ' + this.hash(),
        /** @default */
        'RETS-Version': this.version,
        'User-Agent': this.UA
    };

    /** @member {Object} */
    this.capabilities = {
        Login: this.url.protocol + '//' + this.url.host + this.url.pathname
    };

    /** @member {Object} */
    this.settings = {
    };

    /** @member {Object} */
    this.request = request = request.defaults({
        headers: this.headers,
        auth: {
            user: this.user.name,
            pass: this.user.pass,
            sendImmediately: false // Required for Digest Auth
        },
        jar: true // Preserve Cookies
    });

}

Session.prototype.hash = function () {
    return md5([md5([this.UA, this.UAP].join(':').trim()),'','',this.version].join(':'));
};

Session.prototype.login = function (callback) {
    var self = this;
    var headers;

    this.request.get(this.capabilities.Login)
    .on('response', function(res){
        headers = res.headers;
        if (res.statusCode !== 200) callback(new Error('HTTP: '+status),res);
    })
    .on('error',function(err){
        callback(new Error('HTTP Error', err));
    })
    .pipe(es.split())
    .pipe(es.map(function(line, cb){
        if (/^[^\s+<]/.test(line)) {
            // debug(line);
            var split   =  line.split( '=' );
            var key     =  split[0].replace(/^\s+|\s+$/g, '' );
            var value   =  split[1].replace(/^\s+|\s+$/g, '' );
            // if (value.indexOf('/') === 0) {
            if (/^\//.test(value)) {
                self.capabilities[key] = value;
            } else {
                self.settings[key] = value;
            }
        }
        cb();
    })).pipe(es.through(function(data){
        this.emit('data', data);
    }, function(){
        this.emit('end');
        callback(null);
        // debug("session: %s", util.inspect(self.capabilities, {colors: true}));
    }));
};

module.exports = Session;

