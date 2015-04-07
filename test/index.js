var fs = require('fs');
var assert = require('assert');
var nock = require('nock');

var RETS = require('../');
var RETSError = require('../lib/error');

var NockURLS = {
    host: 'http://rets.server.com:9160',
    login: '/Login.asmx/Login',
    getMetadata: '/njs/GetMetadata',
    search: '/njs/Search',
    logout: '/njs/Logout'
};

var RETSLogin = 'http://user:pass@rets.server.com:9160/Login.asmx/Login';

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

var RETSLoginFailResponse = [
    '<RETS ReplyCode="20807" ReplyText="Unauthorized" >',
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

var RETSMetadataSuccessResponse = [
    '<RETS ReplyCode="0" ReplyText="Operation Successful">',
    '<METADATA>',
        '<METADATA-RESOURCE Date="2015-03-11T12:37:12" Version="1.00.00010">',
            '<Resource>',
                '<ResourceID>Property</ResourceID>',
                '<StandardName/>',
                '<VisibleName>Property</VisibleName>',
                '<Description>Property</Description>',
                '<KeyField>ListingKey</KeyField>',
                '<ClassCount>7</ClassCount>',
                '<ClassVersion>1.00.00006</ClassVersion>',
                '<ClassDate>2014-12-15T09:29:58</ClassDate>',
                '<ObjectVersion>1.00.00000</ObjectVersion>',
                '<ObjectDate>2014-06-20T11:32:55</ObjectDate>',
                '<SearchHelpVersion>1.00.00000</SearchHelpVersion>',
                '<SearchHelpDate>2014-06-20T11:32:55</SearchHelpDate>',
                '<EditMaskVersion>1.00.00000</EditMaskVersion>',
                '<EditMaskDate>2014-06-20T11:32:55</EditMaskDate>',
                '<LookupVersion>1.00.00002</LookupVersion>',
                '<LookupDate>2014-12-15T09:29:58</LookupDate>',
                '<UpdateHelpVersion>1.00.00000</UpdateHelpVersion>',
                '<UpdateHelpDate>2014-06-20T11:32:55</UpdateHelpDate>',
                '<ValidationExpressionVersion>1.00.00000</ValidationExpressionVersion>',
                '<ValidationExpressionDate>2014-06-20T11:32:55</ValidationExpressionDate>',
                '<ValidationLookupVersion>1.00.00000</ValidationLookupVersion>',
                '<ValidationLookupDate>2014-06-20T11:32:55</ValidationLookupDate>',
                '<ValidationExternalVersion>1.00.00000</ValidationExternalVersion>',
                '<ValidationExternalDate>2014-06-20T11:32:55</ValidationExternalDate>',
            '</Resource>',
        '</METADATA-RESOURCE>',
    '</METADATA>',
    '</RETS>'
].join('\n');

nock(NockURLS.host).persist()
    .get(NockURLS.login)
    .reply(200,RETSLoginSuccessResponse)
    .get(NockURLS.getMetadata + '?Type=METADATA-RESOURCE&ID=Property&Format=STANDARD-XML')
    .reply(200,RETSMetadataSuccessResponse)
    .get(NockURLS.search + '?SearchType=Property&Class=ResidentialProperty&Query=%28Status%3D%7CA%29&QueryType=DMQL2&Count=1&Format=COMPACT-DECODED&Limit=3&StandardNames=1')
    .reply(200,RETSMetadataSuccessResponse)
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

        rets.login()
        .on('error',function(err){
            rets.removeAllListeners('login');
            clearTimeout(_timeout);
            assert(false, err.message);
            done();
        });
    });

    it('Can read capabilities from the server',function(){
        assert(rets.session.capabilities.Search && rets.session.capabilities.GetMetadata);
    });

    it('Can get metadata from the server',function(done){

        var timeout = setTimeout(function(){
            rets.removeAllListeners('metadata');
            assert(false, 'No event fired');
            done();
        },1000);

        rets.addListener('metadata',function(err){
            rets.removeAllListeners('metadata');
            clearTimeout(timeout);
            assert(err === null);
            done();
        });

        rets.getMetadata({ Type:'METADATA-RESOURCE', ID: 'Property'});
    });

    it('Can search for property listings',function(done){

        var timeout = setTimeout(function(){
            rets.removeAllListeners('search');
            assert(false, 'No event fired');
            done();
        },1000);

        rets.addListener('search',function(err){
            rets.removeAllListeners('search');
            clearTimeout(timeout);
            assert(err === null);
            done();
        });

        rets.search({
            SearchType: 'Property',
            Class: 'ResidentialProperty',
            Query: '(Status=|A)',
            QueryType: 'DMQL2',
            Limit: 3,
            StandardNames: 1
        });
    });

    it('Can get object from the server: NOT IMPLEMENTED',function(done){

        var timeout = setTimeout(function(){
            rets.removeAllListeners('object');
            assert(false, 'No event fired');
            done();
        },1000);

        rets.addListener('object',function(err){
            rets.removeAllListeners('object');
            clearTimeout(timeout);
            assert(err.message === 'Not implemented');
            done();
        });

        rets.getObject();
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

                this.timeout(15000);
                var _timeout = setTimeout(function(){
                    rets.removeAllListeners('login');
                    assert(false, 'No event fired');
                    done();
                },15000);

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

            it('Can get metadata from my server',function(done){
                var metadata = '';

                this.timeout(30000);
                var timeout = setTimeout(function(){
                    rets.removeAllListeners('metadata');
                    assert(false, 'No event fired');
                    done();
                },30000);

                rets.addListener('metadata',function(err){
                    rets.removeAllListeners('metadata');
                    clearTimeout(timeout);
                    assert(err === null && metadata !== '');
                    done();
                });

                rets.getMetadata({ Type:'METADATA-RESOURCE', ID: 'Property'})
                .on('data',function(line){
                    metadata += line.toString();
                });
            });

            it('Can search for property listings',function(done){
                var search = '';

                this.timeout(30000);
                var timeout = setTimeout(function(){
                    rets.removeAllListeners('search');
                    assert(false, 'No event fired');
                    done();
                },30000);

                rets.addListener('search',function(err){
                    rets.removeAllListeners('search');
                    clearTimeout(timeout);
                    assert(err === null && search !== '');
                    done();
                });

                rets.search(item.search)
                .on('data',function(line){
                    search += line.toString();
                });
            });

            it('Can logout of my RETS server: ' + rets.session.url.host, function(done){

                this.timeout(15000);
                var _timeout = setTimeout(function(){
                    rets.removeAllListeners('logout');
                    assert(false, 'No event fired');
                    done();
                },15000);

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
