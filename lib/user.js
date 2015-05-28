/**
 * RETSr.io rets.js RETS Client
 * @module RETS
 * @license MIT
 *
 * @see {@link http://retsr.io/rets.js}
 */

'use strict';

module.exports = User;

/**
 * @constructor
 * @class
 * @public
 * @requires
 * @param
 * @returns
 * @throws
 */
function User(name, password) {

    if (!(this instanceof User)) {
        return new User(name, password);
    }

    this.name     = name || '';
    this.password = password || '';

}
