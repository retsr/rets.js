var assert = require('assert');
// var debug = require('debug')('rets.js:rets.test.js');

module.exports = describe('RETS', function(){

    var RETS = null;
    var instance = null;
    var config = {
        url: 'http://user:pass@rets.server.com:9160/Login.asmx/Login',
        userAgent: 'RETS-Connector1/2',
        userAgentPassword: ''
    };

    before('Load RETS', function() {
        RETS = require('../lib/rets');
    });

    after('after description', function(){
        RETS = null;
    });

    beforeEach('beforeEach description', function(){
        instance = new RETS(config);
    });

    afterEach('afterEach description', function(){
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

    it('Accepts a string as options.', function(){
        instance = new RETS(config.url);
        assert.equal(instance.config.url, config.url);
    });

    it('Accepts an object as options.', function(){
        assert.equal(instance.config.url, config.url);
        assert.equal(instance.config.userAgent, config.userAgent);
        assert.equal(instance.config.userAgentPassword, config.userAgentPassword);
    });

    it('Has a session.capabilities object.', function(){
        assert.equal(typeof instance.session.capabilities, 'object');
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
