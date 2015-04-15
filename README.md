# rets.js [![Travis](https://img.shields.io/travis/retsr/rets.js.svg)](https://travis-ci.org/retsr/rets.js) [![Coverage Status](https://coveralls.io/repos/retsr/rets.js/badge.svg?branch=master)](https://coveralls.io/r/retsr/rets.js?branch=master)

Simplified RETS Node Client

## Motivation

Rets.js is an effort to bring a properly functioning and performant libRETS implementation to the Node.js community.
This library is _not_ a libRETS wrapper, but seeks to provide a similar API interface while offering additional feature support
that Node.js developers have come to rely on.

### Node.js features

    * Event driven
    * Non-blocking
    * Stream support

## Install

    npm install --save rets.js

## Examples

### Looping

```
var rets = new RETS({
    "url": "http://user:pass@rets.server.com:9160/Login.asmx/Login",
    "ua": {
        "name": "RETS-Connector1/2",
        "pass": ""
    },
    "version": "RETS/1.7.2",
});

rets.login();

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
        // do something
    });
};

rets.addListener('search', function(error, res){
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
});

process.nextTick(function(){
    fetch({});
});

```

## Contributing

Feel free to fork and send Pull Requests.

## Testing

    npm run test-watch

### Test targets

By default, testing using nock to intercept and simulate known RETS server responses. However, it is nice to also
test against your own live RETS servers. To enable additional tests against your server, rename ./test/servers.json.dist to ./test/servers.json
and add your own server path and credentials.

## License

See [LICENSE](LICENSE)
