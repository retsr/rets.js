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

    return request.Request.defaults({
        headers: session.headers,
        auth: {
            user: session.user.name,
            pass: session.user.pass,
            sendImmediately: false // Required for Digest Auth
        },
        jar: true, // Preserve Cookies
        rejectUnauthorized: false // Ignore invalid (expired, self-signed) certificates
        // requestCert: true, // Let's go with default; this seems to cause failures
    }).get(url, options)
    .on('response', function(res){
        if (res.statusCode !== 200) {
            callback(new Error('HTTP: '+res.statusCode),res);
            return;
        }

        // Set RETS Session ID
        if (session.id === '') {
            var cookies = cookiejar.getCookies(url);
            cookies.forEach(function(cookie){
                if (cookie.key === 'RETS-Session-ID') {
                    session.id = cookie.value;
                    session.headers['RETS-UA-Authorization'] = 'Digest ' + session.hash();
                }
            });
        }
    })
    .on('error',function(err){
        console.trace(err);
        callback(err);
    });
}

