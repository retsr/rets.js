var assert = require('assert');
// var debug = require('debug')('rets.js:rets.test.js');

module.exports = describe('RETS', function(){

    var RETS = null;
    var instance = null;
    var config = require('./servers/config.json')[0];

    before('Load RETS', function() {
        RETS = require('../');
    });

    after('Clanup after all tests.', function(){
        RETS = null;
    });

    beforeEach('Create new instance before each test.', function(){
        instance = RETS("http://user:pass@rets.server.com:9160/Login.asmx/Login");
    });

    afterEach('Clear instance after each test.', function(){
        instance = null;
    });

    it('Loads correctly.', function(){
        assert.notEqual(typeof RETS, 'undefined');
    });

    it('Is a function.', function(){
        assert.equal(typeof RETS, 'function');
    });

    it('Instantiates correctly.', function(){
        assert(instance instanceof RETS);
    });

    it('Throws an error if options is undefined.', function(){
        assert.throws(function(){
            new RETS();
        }, Error);
    });

    it('Throws an error if options.url is undefined.', function(){
        assert.throws(function(){
            new RETS({});
        }, Error);
    });

    it('Throws an error if options.url is not a string or object.', function(){
        assert.throws(function(){
            new RETS({url:true});
        }, Error);
    });

    it('Throws an error if options.url is not a valid url.', function(){
        assert.throws(function(){
            new RETS({url:"some invalid url"});
        }, Error);
    });

    it('Throws an error if options.url does not have credentials.', function(){
        assert.throws(function(){
            new RETS({url:"http://localhost:9160/mock/Login"});
        }, Error);
    });

    it('Accepts an object as options.', function(){
        assert.equal(instance.config.url, config.url);
        assert.equal(instance.config.ua.name, config.ua.name);
        assert.equal(instance.config.ua.pass, config.ua.pass);
    });

    it('Has a login method.', function(){
        assert.equal(typeof instance.login, 'function');
    });

    it('Has a search method.', function(){
        assert.equal(typeof instance.search, 'function');
    });

    it('Is an event emitter', function(){
        assert.equal(typeof instance.addListener, 'function');
    });

});
