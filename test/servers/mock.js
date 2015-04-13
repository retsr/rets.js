var assert = require('assert');
var debug = require('debug')('rets.js:test:servers:mock');
var nock = require('nock');
var fs = require('fs');

var RETS = require('../../');
var RETSError = require('../../lib/error');

var RETSHost = 'rets.server.com:9160';

var RETSLogin = 'https://user:pass@' + RETSHost + '/contact/rets/login';

var fixtures = './test/mock/fixtures';
var nocks = [];

nocks = nocks.concat(JSON.parse(fs.readFileSync(fixtures + '/' + RETSHost + '-login.json')));
nocks = nocks.concat(JSON.parse(fs.readFileSync(fixtures + '/' + RETSHost + '-logout.json')));
nocks = nocks.concat(JSON.parse(fs.readFileSync(fixtures + '/' + RETSHost + '-metadata-class.json')));
nocks = nocks.concat(JSON.parse(fs.readFileSync(fixtures + '/' + RETSHost + '-metadata-lookup.json')));
nocks = nocks.concat(JSON.parse(fs.readFileSync(fixtures + '/' + RETSHost + '-metadata-resource.json')));
nocks = nocks.concat(JSON.parse(fs.readFileSync(fixtures + '/' + RETSHost + '-metadata-table.json')));
nocks = nocks.concat(JSON.parse(fs.readFileSync(fixtures + '/' + RETSHost + '-search.json')));

nocks.forEach(function(n){
    nock(n.scope).get(n.path).reply(n.status, n.response, n.headers);
});

var rets = new RETS({
    url: RETSLogin
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

        rets.addListener('metadata',function(err, result){
            rets.removeAllListeners('metadata');
            clearTimeout(timeout);
            assert(err === null);
            done();
        });

        rets.getMetadata({ Type:'METADATA-RESOURCE', ID: '0'});
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
            Class: 'Residential',
            Query: '(TimestampModified=2015-04-01+),(Status=|A)',
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
