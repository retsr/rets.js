var URL = require('url');
var util = require('util');
var debug = require('debug')('rets.js:session');
var md5 = require('MD5');

function Session(url) {

    /**
     * Default User Agent
     * @default
     * @readonly
     * @const {String}
     */
    this.UA = 'RETS-Connector1/2';

    /** @member {Object} */
    this.url = URL.parse(url);

    /** @member {Object} */
    this.user = {
        name: this.url.auth.split(':')[0] || null,
        pass: this.url.auth.split(':')[2] || null
    };

    /** @member {String} */
    this.version = 'RETS/1.7.2';

    /** @member {Object} */
    this.headers = {
        'RETS-UA-Authorization': 'Digest ' + this.hash(),
        /** @default */
        'RETS-Version': this.version,
        'User-Agent': this.user.name || this.UA
    };

    /** @member {Object} */
    this.capabilities = {
        Login: this.url.format()
    };

}

Session.prototype.hash = function () {
    return md5([md5([this.user.name, this.user.pass].join(':').trim()),'','',this.version].join(':'));
};

Session.prototype.login = function (options) {
};

module.exports = Session;

