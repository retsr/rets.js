/**
 * RETSr.io rets.js RETS Client
 * @module RETS
 * @license MIT
 *
 * @see {@link http://retsr.io/rets.js}
 */

'use strict';

var log     = require('./logger');
var util    = require('util');
var url     = require('url');
var md5     = require('MD5');
var extend  = require('extend');
var request = require('request');
// var uuid    = require('node-uuid');

module.exports = Request;

/**
 * @constructor
 * @class
 * @public
 * @requires
 * @param
 * @returns
 * @throws
 */
function Request(rets) {

    if (!(this instanceof Request)) {
        return new Request(rets);
    }

    this.id       = '';//uuid.v4();
    this.user     = rets.user;
    this.client   = rets.client;
    this.session  = rets.session;
    this.provider = rets.provider;
    this.jar      = request.jar();
    this.options = {
        url: rets.url,
        headers: this.headers(),
        auth: {
            user: this.user.name,
            pass: this.user.password,
            sendImmediately: false
        },
        jar: this.jar,
        rejectUnauthorized: false
    };
}

/**
 * @this Request
 *
 * ::= LHEX( MD5( LHEX(a1)":" RETS-Request-ID ":" session-id ":" version-info))
 *
 * MD5( LHEX(a1)::= See Rets.Client.hash
 *
 * RETS-Request-ID::=RETS-Request-ID
 * This value MUST be the same as that sent with the RETS-Request- ID header.
 * If the client does not use the RETS-Request-ID header, this token is empty
 * in the calculation.
 *
 * session-id::=
 * If the server has sent a Set-Cookie header with a cookie name of
 * RETS-Session-ID, session-id is the value of that cookie. If the server has
 * not sent a cookie with that name, or if the cookie by that name has expired,
 * this token is empty in the calculation.
 *
 * version-info::=
 * The value of the RETS-Version header sent by the client with this
 * transaction.
 */
Request.prototype.hash = function () {
    var parts        = [this.client.hash(), this.id, this.session.id, this.provider.version];
    var concatenated = parts.join(':');
    var hash         = md5( concatenated );
    log.info("Generating request hash using %j. Result: %s", parts, hash);
    return hash;
};

/**
 * @this Request
 */
Request.prototype.headers = function () {
    var headers = {
        'RETS-UA-Authorization': 'Digest ' + this.hash(),
        'RETS-Version'         : this.provider.version,
        'RETS-Session-ID'      : this.id,
        'User-Agent'           : this.client.name
    };
    log.info("Headers: %j", headers);
    return headers;
};

/**
 * @this Request
 */
Request.prototype.request = function (options) {
    var baseURL     = url.format(this.options.url);
    var requestURL  = url.format(options.url);
    var resolvedURL = url.resolve(baseURL, requestURL);
    var resolved    = {url: url.parse(resolvedURL)};
    var config      = extend(true, this.options, options, resolved);
    var req = request(config);
        req = req.on('response', function(response){
            log.info("Received response headers.");
            log.debug({headers: response.headers});
        });
        req = req.on('response', function(response){
            var header = response.headers['set-cookie'];
            if (util.isArray(header)) {
                this.session.id = header.join('').match(/RETS-Session-ID=([^;]+)/)[1] || '';
            }

            // if (response.statusCode !== 200) {
            //     callback(new Error('HTTP: ' + response.statusCode), response);
            //     return;
            // }

        }.bind(this));

    return req;
};
