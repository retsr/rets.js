var util = require('util');
var RETS = require('../');

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
        console.trace(err);
    })
    .on('data', function(chunk){
        beans++;
        // console.log(chunk);
        // do something
    });
};

rets.on('login',function(err){
    if (err) {
        console.trace(err);
        return;
    }
    console.log('Connected');
    fetch({});
})
.on('search', function(error, res){
    if (error) {
        console.trace(error);
        return;
    }

    console.log('Received %s records; %s of %s', res.records, beans, res.count);
    if (expect === 0 && loops === 0) {
        expect = res.count;
        loops = (expect - res.records) / 1000;

        for (var i=0; i<loops; i++) {
            var offset = ((i+1) * 1000);
            console.log('Queue request for offset %s', offset);
            fetch({ Offset: offset });
        }
    }

    if (beans >= res.count) {
        console.log('Completed looping records');
        rets.logout();
    }
})
.login();