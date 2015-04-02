/**
 * RETSr.io rets.js RETS Client
 * @module RETS
 * @license MIT
 * @author Luis Gomez
 *
 * @see {@link http://usejsdoc.org/}
 *
 */

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
    var url = (http.test(session.capabilities[action])) ? session.capabilities[action] : session.url.protocol + '//' + session.url.host + session.capabilities[action]

	return request.Request.defaults({
        headers: session.headers,
        auth: {
            user: session.user.name,
            pass: session.user.pass,
            sendImmediately: false // Required for Digest Auth
        },
        jar: true // Preserve Cookies
	}).get(url, options)
	.on('response', function(res){
        if (res.statusCode !== 200) {
            callback(new Error('HTTP: '+status),res);
        }
    })
    .on('error',function(err){
        console.trace(err);
        callback(err);
    });
}

module.exports = request;
request.Request = require('request');