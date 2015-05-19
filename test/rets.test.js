var assert = require('assert');
// var debug = require('debug')('rets.js:rets.test.js');

module.exports = describe('RETS', function(){

    var RETS = null;
    var instance = null;

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

    it('Accepts a URL string with embeded auth credentials.', function(){
        assert(instance instanceof RETS);
    });

    it('Throws if instantiation attempted without user name (URL-embedded or as option).', function(){
        assert.throws(function(){
            new RETS("http://rets.server.com:9160/Login.asmx/Login");
        }, Error);
        assert.throws(function(){
            new RETS("http://rets.server.com:9160/Login.asmx/Login", {
                pass: 'opts_pass'
            });
        }, Error);
    });

    it('Accepts a URL string and an options object.', function(){
        var instance = RETS("http://user:pass@rets.server.com:9160/Login.asmx/Login", {
            user: 'opts_user',
            pass: 'opts_pass'
        });
        assert(instance instanceof RETS);
    });

    it('Accepts an object as the only parameter.', function(){
        var instance = RETS({
            url: "http://user:pass@rets.server.com:9160/Login.asmx/Login"
        });
        assert(instance instanceof RETS);
    });

    it('options.user overrides URL-embedded user.', function(){
        var instance = RETS("http://user:pass@rets.server.com:9160/Login.asmx/Login", {
            user: 'opts_user'
        });
        assert.equal(instance.config.user, 'opts_user');
    });

    it('options.pass overrides URL-embedded password.', function(){
        var instance = RETS("http://user:pass@rets.server.com:9160/Login.asmx/Login", {
            pass: 'opts_pass'
        });
        assert.equal(instance.config.pass, 'opts_pass');
    });

    it('Instantiates correctly.', function(){
        assert(instance instanceof RETS);
    });

    it('Throws an error if no parameters are passed when instantiating.', function(){
        assert.throws(function(){
            new RETS();
        }, Error);
    });

    it('Throws an error if URL is not a valid.', function(){
        assert.throws(function(){
            new RETS("some invalid url");
        }, Error);
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
