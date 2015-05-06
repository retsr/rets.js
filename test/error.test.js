var assert = require('assert');
// var debug = require('debug')('rets.js:error.test.js');

module.exports = describe('Error [RETSError]', function(){

    var RETSError = null;
    var instance = null;
    var code = 20041;

    before('Load RETS', function() {
        RETSError = require('../lib/error');
    });

    after('after description', function(){
        RETSError = null;
    });

    beforeEach('beforeEach description', function(){
        instance = new RETSError(code);
    });

    afterEach('afterEach description', function(){
        instance = null;
    });

    it('Loads correctly.', function(){
        assert.notEqual(typeof RETSError, 'undefined');
    });

    it('Is a function.', function(){
        assert.equal(typeof RETSError, 'function');
    });

    it('Instantiates correctly.', function(){
        assert(instance instanceof RETSError);
    });

    it('Is an object.', function(){
        assert.equal(typeof instance, 'object');
    });

    it('Loads error codes dictionary correctly.', function(){
        assert.equal(typeof instance.codes, 'object');
    });

    it('Handles unknown errors correctly.', function(){
        instance = new RETSError();
        assert(typeof instance.code, 'undefined');
        assert(typeof instance.message, 'Invalid error code.');
    });

    it('Handles known errors correctly. [' + code + ']', function(){
        assert(instance.code === code);
        assert(instance.message === instance.codes[code][0]);
    });

    it('Handles aggregate errors correctly. [' + code + ']', function(){
        instance = new RETSError(code, "Fake aggregate message.");
        assert(instance.code === code);
        var aggregateMessage = instance.codes[instance.code][0] + instance.wrapper.start + instance.ReplyText + instance.wrapper.end;
        assert(instance.message === aggregateMessage);
    });

});
