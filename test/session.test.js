var assert = require('assert');

module.exports = describe('Session', function(){

    var Session = null;
    var instance = null;

    before('Load RETS', function() {
        Session = require('../lib/session');
    });

    after('after description', function(){
        Session = null;
    });

    beforeEach('beforeEach description', function(){
        instance = new Session();
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
        var instance = new Session();
        assert.equal('', instance.id);
    });

    it('Has a .settings object.', function(){
        assert.equal(typeof instance.settings, 'object');
    });

});
