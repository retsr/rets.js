var assert = require('assert');
var debug = require('debug')('rets.js:rets.test.js');
var nock = require('nock');
var URL = require('url');

module.exports = describe('RETS', function(){

    var RETS = null;
    var instance = null;
    var mock = require('./servers/mock');
    var config = mock.config;
    var servers = require('./servers');
        servers.push(mock);

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

    servers.forEach(function(server){
        describe('Testing against: ' + server.name, function(){

            var instance = null;
            // var _nock = nock(server.config.url).persist();


            before('Mocking server', function() {
                instance = new RETS(server.config.url);
            });

            after('after description', function(){
                // _nock.cleanAll();
            });

            Object.keys(server.capabilities).forEach(function(key) {
                // debug("server.capabilities[key].path: %o", server.capabilities[key].path);
                // debug("server.capabilities[key].success: %o", server.capabilities[key].success);
                // _nock.get(server.capabilities[key].path).reply(200,server.capabilities[key].success);
                // assert.equal(server.capabilities[key], instance.defaults[key]);
            });

            it('Calling ' + server.config.url + server.capabilities['Login'].path, function(done){

                nock("http://rets.server.com:9160").persist().get("/Login.asmx/Login").reply(200,"HOLA!");
                var request = require('request');
                request("http://rets.server.com:9160/Login.asmx/Login", function(response){
                    done();
                });

                // var _timeout = setTimeout(function(){
                //     instance.removeAllListeners('login');
                //     assert(false, 'No event fired');
                //     done();
                // },1000);

                // instance.addListener('login',function(err){
                //     instance.removeAllListeners('login');
                //     clearTimeout(_timeout);
                //     assert(err === null);
                //     done();
                // });

                // instance.login().on("response", function(response){
                //     debug("Login response: %o", response);
                //     done();
                // }).on("error", function(err){
                //     debug("Login error: %o", err);
                // });
                // .on('error',function(err){
                //     instance.removeAllListeners('login');
                //     clearTimeout(_timeout);
                //     assert(false, err.message);
                //     done();
                // });

            });
            it('Can read capabilities from the server');
            it('Can get metadata from the server');
            it('Can search for property listings');
            it('Can get object from the server: NOT IMPLEMENTED');
            it('Can logout of a RETS server');
        });
    });

});
