var fs = require('fs');
var assert = require('assert');
var nock = require('nock');

var RETS = require('../');
var RETSError = require('../lib/error');

var NockURLS = {
    host: 'http://rets.server.com:9160',
    login: '/Login.asmx/Login',
    logout: '/njs/Logout'
};

var RETSLogin = 'http://user:pass@rets.server.com:9160/Login.asmx/Login'

var RETSLoginSuccessResponse = [
    '<RETS ReplyCode="0" ReplyText="Operation Successful" >',
    '<RETS-RESPONSE>',
    'MemberName=John Doe',
    'User=user,0,IDX Vendor,0000RETS   00',
    'Broker=00,0',
    'MetadataVersion=03.08.00024',
    'MetadataTimestamp=2015-03-11T10:36:09',
    'MinMetadataTimestamp=2015-03-11T10:36:09',
    'TimeoutSeconds=1800',
    'GetObject=/njs/GetObject',
    'Login=/njs/Login',
    'Logout=/njs/Logout',
    'Search=/njs/Search',
    'GetMetadata=/njs/GetMetadata',
    '</RETS-RESPONSE>',
    '</RETS>'
].join('\n');

var RETSLogoutSuccessResponse = [
    '<RETS ReplyCode="0" ReplyText="Operation Successful" >',
    '<RETS-RESPONSE>',
    'ConnectTime=0 minutes',
    'SignOffMessage=Logged out.',
    '</RETS-RESPONSE>',
    '</RETS>'
].join('\n');

nock(NockURLS.host).persist()
    .get(NockURLS.login)
    .reply(200,RETSLoginSuccessResponse)
    .get(NockURLS.logout)
    .reply(200,RETSLogoutSuccessResponse);

nock.enableNetConnect();

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

var rets;

describe('RETS Instance (rets)', function(){
    it('Constructor accepts a string', function(){
        rets = new RETS( RETSLogin );
        assert(rets instanceof RETS);
    });
    it('Constructor accepts an object', function(){
        rets = new RETS({
            url: RETSLogin,
            userAgent: 'RETS-Connector1/2',
            userAgentPassword: ''
        });
        assert(rets instanceof RETS);
    });
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
    it('Is an event emitter', function(){
        assert.equal(typeof rets.addListener, 'function');
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
        assert(err.message === 'Invalid error code.');
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

describe('RETS Instance Methods',function(){

    it('Can login to a RETS server',function(done){

        var _timeout = setTimeout(function(){
            rets.removeAllListeners('login');
            assert(false, 'No event fired');
            done();
        },1000);

        rets.addListener('login',function(err){
            rets.removeAllListeners('login');
            clearTimeout(_timeout);
            assert(err === null);
            done();
        });

        rets.login();
    });

    it('Can read capabilities from the server',function(){
        assert(rets.session.capabilities.Search && rets.session.capabilities.GetMetadata);
    });

    it('Can search for property listings: NOT IMPLEMENTED',function(done){

        var timeout = setTimeout(function(){
            rets.removeAllListeners('search');
            assert(false, 'No event fired');
            done();
        },1000);

        rets.addListener('search',function(err){
            rets.removeAllListeners('search');
            clearTimeout(timeout);
            assert(err.message === 'Not implemented');
            done();
        });

        rets.search();
    });

    it('Can logout of a RETS server',function(done){

        var _timeout = setTimeout(function(){
            rets.removeAllListeners('logout');
            assert(false, 'No event fired');
            done();
        },1000);

        rets.addListener('logout',function(err){
            rets.removeAllListeners('logout');
            clearTimeout(_timeout);
            assert(err === null);
            done();
        });

        rets.logout();
    });

});


if(fs.existsSync('./test/servers.json')){
    var servers = require('./servers.json');

    describe('RETS calls work against my servers', function(){

        servers.forEach(function(item){

            var rets = new RETS({
                url: item.url,
                userAgent: item.userAgent,
                userAgentPassword: item.userAgentPassword,
                version: item.version
            });

            it('Can login to my RETS server: ' + rets.session.url.host, function(done){

                var _timeout = setTimeout(function(){
                    rets.removeAllListeners('login');
                    assert(false, 'No event fired');
                    done();
                },1000);

                rets.addListener('login',function(err){
                    rets.removeAllListeners('login');
                    clearTimeout(_timeout);
                    assert(err === null);
                    done();
                });

                rets.login();
            });

            it('Can read capabilities from the server', function(){
                assert(rets.session.capabilities.Search && rets.session.capabilities.GetMetadata);
            });

            it('Can logout of my RETS server: ' + rets.session.url.host, function(done){

                var _timeout = setTimeout(function(){
                    rets.removeAllListeners('logout');
                    assert(false, 'No event fired');
                    done();
                },1000);

                rets.addListener('logout',function(err){
                    rets.removeAllListeners('logout');
                    clearTimeout(_timeout);
                    assert(err === null);
                    done();
                });

                rets.logout();
            });


        });

    });

}

// process.stdout.write('\033c');
