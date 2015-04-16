var assert = require('assert');
var url = require('url');
// var debug = require('debug')('rets.js:session.test.js');

module.exports = describe('Session', function(){

    var Session = null;
    var instance = null;
    var config = require('./servers/config.json')[0];
    var expectedDefaults = {
        url: null,
        ua: {
            name: 'RETS-Connector1/2',
            pass: ''
        },
        version: 'RETS/1.7.2'
    };

    before('Load RETS', function() {
        Session = require('../lib/session');
    });

    after('after description', function(){
        Session = null;
    });

    beforeEach('beforeEach description', function(){
        instance = new Session(config);
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
        var instance = new Session(config);
        assert.deepEqual(expectedDefaults, instance.defaults);
    });

    it('Requires a url to instantiate',function(){
        // assert.throws(function(){
        //     new Session();
        // }, Error);
        try {
            new Session({});
        } catch(e) {
            assert.equal(e.message, 'options.url is required.');
        }
    });

    it('Requires a url to be a string or an object',function(){
        try {
            new Session({ url: true });
        } catch(e) {
            assert.equal(e.message, 'options.url is not a string or an object.');
        }
    });

    it('Requires string urls to be valid',function(){
        try {
            new Session({ url: 'htp:/rets.org' });
        } catch(e) {
            assert.equal(e.message, 'invalid options.url.host.');
        }
    });

    it('Requires string urls to contain auth credentials',function(){
        try {
            new Session({ url: 'http://localhost:9160/mock/Login' });
        } catch(e) {
            assert.equal(e.message, 'invalid options.url.auth.');
        }
    });

    it('instance.url is an object.', function(){
        assert.equal(typeof instance.url, 'object');
    });

    it('Instance.url.auth set to expected value.', function(){
        var parsed = url.parse(config.url);
        assert.equal(instance.url.auth, parsed.auth);
    });

    it('Instance.url.host set to expected value.', function(){
        var parsed = url.parse(config.url);
        assert.equal(instance.url.host, parsed.host);
    });

    it('Instance.url.path set to expected value.', function(){
        var parsed = url.parse(config.url);
        assert.equal(instance.url.path, parsed.path);
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
        var hash = md5([md5([config.ua.name, config.ua.pass].join(':').trim()),'','',instance.version].join(':'));
        assert.equal(instance.hash(), hash);
    });

});
