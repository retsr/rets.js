/**
 * RETSr.io rets.js RETS Client
 * @module RETS
 * @license MIT
 *
 * @see {@link http://retsr.io/rets.js}
 */

'use strict';

module.exports = request;

/** statically bind node-request */
request.Request = require('request');

// require('request-debug')(request.Request, function(type, data) {
//     debug("Request Type: %o", type);
//     debug("Request Data: %s", "\n"+JSON.stringify(data, null, 2));
// });

/** log facility */
var debug = require('debug')('rets.js:request');

/** @type {Object} Reference to node-request cookiejar */
var cookiejar = request.Request.jar();

/**
 * @description  Constructs a RETS Response that wraps `node-request`
 * Handles proper use of session data and authentication
 * info as well as validating calls
 *
 * @param  {object}   session - An instance of RETS Session
 * @param  {string}   action - The action/capability to execute
 * @param  {object}   options - additional options to pass request
 * @param  {Function} callback - request error handling
 * @return {object}     Returns and instance of RETS response
 */
function request(session, action, options, callback) {

    if (!callback) {
        callback = function noop(){};
    }

    if (!session.capabilities[action]) {
        return callback(new Error('Action unavailable'));
    }

    var http = /^http.*/i;
    var url = (http.test(session.capabilities[action])) ?
        session.capabilities[action] :
        session.url.protocol + '//' + session.url.host + session.capabilities[action];

    debug(url, options);
    // var digest = (session.id) ? false : true;

    return request.Request.defaults({
        headers: session.headers,
        auth: {
            user: session.user.name,
            pass: session.user.pass,
            sendImmediately: false // Required for Digest Auth
        },
        jar: cookiejar, // Preserve Cookies
        rejectUnauthorized: false // Ignore invalid (expired, self-signed) certificates
        // requestCert: true, // Let's go with default; this seems to cause failures
    }).get(url, options, function(){})
    .on('response', function(res){

        debug('cookies', cookiejar.getCookies(url));

        // Set RETS Session ID
        if (session.id === '') {
            var cookies = cookiejar.getCookies(url);
            cookies.forEach(function(cookie){
                if (cookie.key === 'RETS-Session-ID') {
                    session.id = cookie.value;
                    debug('Discovered session id %s:', session.id);
                    // session.headers['RETS-Session-ID'] = session.id;
                    session.headers['RETS-UA-Authorization'] = 'Digest ' + session.hash();
                }
            });
        }

        if (res.statusCode !== 200) {
            callback(new Error('HTTP: '+res.statusCode),res);
            return;
        }
    })
    .on('error',function(err){
        debug('HTTP request error', err);
        callback(err);
    });
}
