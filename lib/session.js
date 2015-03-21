var URL = require('url');
var util = require('util');
var debug = require('debug')('lowmango:session');
var md5 = require('MD5');

function Session(url) {

    this.url = URL.parse(url);
    this.user = {
        name: this.url.auth.split(':')[0] || null,
        pass: this.url.auth.split(':')[2] || null
    };
    this.version = 'RETS/1.7.2';
    this.headers = {
      'RETS-UA-Authorization': 'Digest ' + md5([md5([this.user.name, this.user.pass].join(':').trim()),'','',this.version].join(':')),
      'RETS-Version': this.version,
      'User-Agent': this.user.name
    };
    this.capabilities = {
      Login: this.url.format()
    };

}

Session.prototype.login = function (options) {
};

module.exports = Session;
