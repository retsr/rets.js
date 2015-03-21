var path = require('path');
var util = require('util');
var debug = require('debug')('lowmango:tests');
var assert = require("assert");
var nock = require('nock');
// var http = require('http');

var RETS = require('../');
var RETSError = require('../lib/error');


describe('RETS Class', function(){

    before('before description', function() {
    // runs before all tests in this block
    });
    after('after description', function(){
    // runs after all tests in this block
    });
    beforeEach('beforeEach description', function(){
    // runs before each test in this block
    });
    afterEach('afterEach description', function(){
    // runs after each test in this block
    });

    it('Was found.', function(){
        assert.notEqual(typeof RETS, 'undefined');
    });
    it('Is a function.', function(){
        assert.equal(typeof RETS, 'function');
    });
});

var rets = new RETS('http://user:pass@sef.rets.interealty.com/Login.asmx/Login');

describe('RETS Instance (rets)', function(){
    it('Is an instance of RETS.', function(){
        assert(rets instanceof RETS);
    });
    it('Has a session.capabilities object.', function(){
        assert.equal(typeof rets.session.capabilities, 'object');
    });
    it('Has a login method.', function(){
        assert.equal(typeof rets.login, 'function');
    });
    it('Has a search method.', function(){
        assert.equal(typeof rets.search, 'function');
    });
});


describe('Session (rets.session)', function(){
    it('Is an object.', function(){
        assert.equal(typeof rets.session, 'object');
    });
    it('Has a valid URL.auth.', function(){
        assert.equal(typeof rets.session.url.auth, 'string');
    });
    it('Has a valid URL.host.', function(){
        assert.equal(typeof rets.session.url.host, 'string');
    });
    it('Has a valid URL.path.', function(){
        assert.equal(typeof rets.session.url.path, 'string');
    });
});

describe('RETSError Class', function(){
    it('Was found.', function(){
        assert.notEqual(typeof RETSError, 'undefined');
    });
    it('Is a function.', function(){
        assert.equal(typeof RETSError, 'function');
    });
});

describe('Unknown Errors', function(){

    var err = new RETSError();

    it('Should be an instance of RETSError.', function(){
        assert(err instanceof RETSError);
    });
    it('Error code should be undefined.', function(){
        assert(typeof err.code === 'undefined');
    });
    it('Error message should be "Invalid error code.".', function(){
        assert(err.message === "Invalid error code.");
    });
});

describe('Known Errors', function(){

    var codes = require('../lib/codes');

    it('Error codes loaded correctly.', function(){
        assert(typeof codes === 'object');
    });

    var code = 20041;
    var err = new RETSError(code);

    // debug(codes[code]);
    it('Should be an instance of RETSError.', function(){
        assert(err instanceof RETSError);
    });
    it('Error code should be "' + code + '".', function(){
        assert(err.code === code);
    });
    it('Error message should be "' + codes[code][0] + '".', function(){
        assert(err.message === codes[code][0]);
    });
});

// process.stdout.write('\033c');
