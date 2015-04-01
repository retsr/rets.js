/**
 * RETSr.io rets.js RETS Client
 * @module RETS
 * @license MIT
 * @author Luis Gomez
 *
 * @see {@link http://usejsdoc.org/}
 *
 */

function request(session, action, options, callback) {

	if (!callback) callback = function noop(){};

	return request.Request.defaults({
        headers: session.headers,
        auth: {
            user: session.user.name,
            pass: session.user.pass,
            sendImmediately: false // Required for Digest Auth
        },
        jar: true // Preserve Cookies
	}).get(action, options)
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