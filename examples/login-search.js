var util       = require('util');
var RETS       = require('../');
var debug      = require('debug')('rets.js:loop');
var Handlebars = require('handlebars');
var user       = process.env.USER;
var password   = process.env.PASSWORD;

if (!user)      {throw 'Must provide env USER.';}
if (!password)  {throw 'Must provide env PASSWORD.';}

var rets = new RETS({
    "url": "http://" + user + ":" + password + "@sef.rets.interealty.com/Login.asmx/Login",
    "ua": {
        "name": user,
        "pass": password
    }
});

rets.login().on('setting',function(key, value){
    // debug("Setting: %o => %o", key, value);
}).on('capability',function(key, value){
    // debug("Capability: %o => %o", key, value);
});

rets.on('login',function(err){
    if (err) {console.trace(err);}

    debug("Settings: ", "\n" + util.inspect(rets.session.settings, { colors: true, depth: 3 }) + "\n");
    debug("Capabilities: ", "\n" + util.inspect(rets.session.capabilities, { colors: true, depth: 3 }) + "\n");

    var template = Handlebars.compile("[{{ListingID}}] {{StreetNumber}} {{StreetName}}, {{City}}, {{State}}");

    console.time('Search');

    rets.search({
        SearchType: 'Property',
        Class: 'ResidentialProperty',
        Query: '(ListingStatus=A),(61=DADE)',
        Format: 'COMPACT-DECODED',
        // Limit: 30,
        objectMode: true,
        format: 'objects'
    }).on('error', function(err){
        debug(err);
    }).on('data', function(property){
        debug(template(property));
        // debug("Property: ", "\n" + util.inspect(property, { colors: true, depth: 3 }) + "\n");
    });

});

rets.on('search', function(err, res){
    if (err) {console.trace(err);}
    debug("Results: %o of %o", res.records, res.count);
    console.timeEnd('Search');
});
