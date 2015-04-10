var assert = require('assert');
var debug = require('debug')('rets.js:test:servers:live');
var fs = require('fs');

var RETS = require('../../');
var RETSError = require('../../lib/error');

if(fs.existsSync('./test/servers/servers.json')) {
    var servers = require('./servers.json');
    servers.forEach(function(item){

        var rets = new RETS({
            url: item.url,
            ua: {
                name: item.ua.name,
                pass: item.ua.pass
            },
            version: item.version
        });

        describe('RETS calls work against: ' + rets.session.url.host, function(){

            it('Can login', function(done){

                this.timeout(15000);
                var _timeout = setTimeout(function(){
                    rets.removeAllListeners('login');
                    assert(false, 'No event fired');
                    done();
                },15000);

                rets.addListener('login',function(err){
                    rets.removeAllListeners('login');
                    clearTimeout(_timeout);
                    // if (err) { console.trace(err); }
                    assert(err === null);
                    done();
                });

                rets.login();
            });

            it('Can read capabilities from the server', function(){
                assert(rets.session.capabilities.Search && rets.session.capabilities.GetMetadata);
            });

            /**
             * These are dependent on knowing something about the server
             */
            if (item.metadata) {

                it('Can get metadata resources from my server',function(done){
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
                        // console.log(metadata);
                        done();
                    });

                    rets.getMetadata({ Type:'METADATA-RESOURCE', ID: item.metadata.resources.ID })
                    .on('data',function(line){
                        metadata += line.toString();
                    });
                });

                it('Can get metadata classes from my server',function(done){
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
                        // console.log(metadata);
                        done();
                    });

                    rets.getMetadata({ Type:'METADATA-CLASS', ID: item.metadata.classes.ID })
                    .on('data',function(line){
                        metadata += line.toString();
                    });
                });

                it('Can get metadata fields from my server',function(done){
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
                        // console.log(metadata);
                        done();
                    });

                    rets.getMetadata({ Type:'METADATA-TABLE', ID: item.metadata.fields.ID })
                    .on('data',function(line){
                        metadata += line.toString();
                    });
                });

                it('Can get metadata status values from my server',function(done){
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
                        // console.log(metadata);
                        done();
                    });

                    rets.getMetadata({ Type:'METADATA-LOOKUP_TYPE', ID: item.metadata.status.ID })
                    .on('data',function(line){
                        metadata += line.toString();
                    });
                });

            }

            /**
             * Also depends on knowing something about the server
             */
            if (item.search) {
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
            }

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
