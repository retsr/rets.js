var util = require('util');
var RETS = require('../');
var log = require('../lib/logger');

var rets = new RETS({
    "url": "http://user:pass@rets.server.com:9160/Login.asmx/Login",
    "ua": {
        "name": "RETS-Connector1/2",
        "pass": ""
    },
    "version": "RETS/1.7.2",
});

var Query = {
    SearchType: 'Property',
    Class: 'Residential',
    Query: '(Status=|A)',
    Format: 'COMPACT-DECODED',
    Limit: 1000,
    objectMode: true,
    format: 'objects'
};

var beans = 0;
var loops = 0;
var expect = 0;

var fetch = function(options) {
    var _query = util._extend(options, Query);

    rets.search(_query)
    .on('error', function(err){
        log.error(err);
    })
    .on('data', function(/*chunk*/){
        beans++;
        // log.info({chunk: chunk});
    });
};

rets.on('login',function(err){
    if (err) {
        log.error(err);
        return;
    }
    log.info('Connected');
    fetch({});
})
.on('search', function(err, res){
    if (err) {
        log.error(err);
        return;
    }

    log.info({records: res.records, beans: beans, count: res.count}, 'Records:');
    if (expect === 0 && loops === 0) {
        expect = res.count;
        loops = (expect - res.records) / 1000;

        for (var i=0; i<loops; i++) {
            var offset = ((i+1) * 1000);
            log.info({offset:offset}, 'Queue request for offset:');
            fetch({ Offset: offset });
        }
    }

    if (beans >= res.count) {
        log.info('Completed looping records');
        rets.logout();
    }
})
.login();
