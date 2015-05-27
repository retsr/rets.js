// USER=[user] PASSWORD=[password] node login-search.js

var RETS       = require('../');
var log = require('../lib/logger');
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
    log.info({setting: [key, value]}, "Setting event.");
}).on('capability',function(key, value){
    log.info({key: key, value: value}, "Capability event.");
});

rets.on('login',function(err){
    if (err) {log.trace(err);}

    log.info({settings: rets.session.settings}, "Settings:");
    log.info({capabilities: rets.session.capabilities}, "Capabilities:");

    var template = Handlebars.compile("[{{ListingID}}] {{StreetNumber}} {{StreetName}}, {{City}}, {{State}}");

    rets.search({
        SearchType: 'Property',
        Class: 'ResidentialProperty',
        Query: '(ListingStatus=A),(61=DADE)',
        Format: 'COMPACT-DECODED',
        // Limit: 30,
        objectMode: true,
        format: 'objects'
    }).on('error', function(err){
        log.trace(err);
    }).on('data', function(property){
        log.info({property: template(property)}, "Formatted property:");
    });

});

rets.on('search', function(err, res){
    if (err) {log.trace(err);}
    log.info({records: res.records, count: res.count}, "Results:");
});
