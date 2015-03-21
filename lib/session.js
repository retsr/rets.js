var URL = require('url');
var util = require('util');
var debug = require('debug')('rets.js:session');
var md5 = require('MD5');

function Session(url) {

    this.url = URL.parse(url);
    this.user = {
        name: this.url.auth.split(':')[0] || null,
        pass: this.url.auth.split(':')[2] || null
    };
    this.version = 'RETS/1.7.2';
    this.headers = {
      'RETS-Version': this.version,
      'User-Agent': this.user.name
        'RETS-UA-Authorization': 'Digest ' + this.hash(),
    };
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
