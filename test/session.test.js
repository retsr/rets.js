var assert = require('assert');
var debug = require('debug')('rets.js:session.test.js');

module.exports = describe('Session', function(){

    var Session = null;
    var instance = null;
    var url = 'http://user:pass@rets.server.com:9160/Login.asmx/Login';
    var config = {
        userAgent: 'test-ua',
        userAgentPassword: 'test-password',
        version: 'blah'
    };
    var expectedDefaults = {
        UA: 'RETS-Connector1/2',
        UAP: '',
        version: 'RETS/1.7.2'
    };

    before('Load RETS', function() {
        Session = require('../lib/session');
    });

    after('after description', function(){
        Session = null;
    });

    beforeEach('beforeEach description', function(){
        instance = new Session(url, config);
    });

    afterEach('afterEach description', function(){
        instance = null;
    });

    it('Loads correctly.', function(){
        assert.notEqual(typeof Session, 'undefined');
    });

    it('Is a function.', function(){
        assert.equal(typeof Session, 'function');
    });

    it('Instantiates correctly.', function(){
        assert(instance instanceof Session);
    });

    it('Is an object.', function(){
        assert.equal(typeof instance, 'object');
    });

    it('Has the correct set of expected defaults.', function(){
        var instance = new Session(url);
        Object.keys(expectedDefaults).forEach(function(key) {
            assert.equal(expectedDefaults[key], instance.defaults[key]);
        });
    });

    it('instance.url is an object.', function(){
        assert.equal(typeof instance.url, 'object');
    });

    it('Instance.url.auth set to expected value.', function(){
        var auth = 'user:pass';
        assert.equal(instance.url.auth, auth);
    });

    it('Instance.url.host set to expected value.', function(){
        var host = 'rets.server.com:9160';
        assert.equal(instance.url.host, host);
    });

    it('Instance.url.path set to expected value.', function(){
        var path = '/Login.asmx/Login';
        assert.equal(instance.url.path, path);
    });

    it('Has a .headers object.', function(){
        assert.equal(typeof instance.headers, 'object');
    });

    it('Has a .capabilities object.', function(){
        assert.equal(typeof instance.capabilities, 'object');
    });

    it('Has a .settings object.', function(){
        assert.equal(typeof instance.settings, 'object');
    });

    it('Has a .hash() method.', function(){
        assert.equal(typeof instance.hash, 'function');
    });

    it('.hash returns the expected hash.', function(){
        var md5 = require('MD5');
        var hash = md5([md5([config.userAgent, config.userAgentPassword].join(':').trim()),'','',instance.version].join(':'));
        assert.equal(instance.hash(), hash);
    });

});
