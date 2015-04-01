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
 * RETS request wraps `node-request`
 * Handles proper use of session data and authentication
 * info as well as validating calls
 * 
 * @param  {object}   session  [description]
 * @param  {string}   action   [description]
 * @param  {object}   options  [description]
 * @param  {Function} callback [description]
 * @return {void}            [description]
 */
function request(session, action, options, callback) {

	if (!callback) {
        callback = function noop(){};
    }

    if (!session.capabilities[action]) {
        return callback(new Error('Action unavailable'));
    }

	return request.Request.defaults({
        headers: session.headers,
        auth: {
            user: session.user.name,
            pass: session.user.pass,
            sendImmediately: false // Required for Digest Auth
        },
        jar: true // Preserve Cookies
	}).get(session.capabilities[action], options)
	.on('response', function(res){
        if (res.statusCode !== 200) {
            callback(new Error('HTTP: '+status),res);
        }
    })
    .on('error',function(err){
        callback(new Error('HTTP Error', err));
    });
}

module.exports = request;
request.Request = require('request');