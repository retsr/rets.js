// DEBUG=rets.js:login-search* USER=[user] PASSWORD=[password] node login-search.js

var util       = require('util');
var RETS       = require('../');
var debug      = require('debug')('rets.js:simple');
// var Handlebars = require('handlebars');
var user       = process.env.USER;
var password   = process.env.PASSWORD;

if (!user)      {throw 'Must provide env USER.';}
if (!password)  {throw 'Must provide env PASSWORD.';}

// var query = {
//     "ListingStatus": "A",
//     "61": "DADE",
// };
//
// var opts = {
//     SearchType: 'Property',
//     Class: 'ResidentialProperty',
//     Format: 'COMPACT-DECODED',
//     Limit: 30,
//     objectMode: true,
//     format: 'objects'
// };

// var rets = RETS("http://" + user + ":" + password + "@sef.rets.interealty.com/Login.asmx/Login").search(err, {}, {}, funciton(listings){
//
// }).on('data', function(listing){
//
// }).on('error', function(err){
//
// });
//
// rets.capabilities(); // ->
//
// rets.settings(); // ->
//
// rets.metadata(); // ->

var rets = new RETS({
    "url": "http://" + user + ":" + password + "@sef.rets.interealty.com/Login.asmx/Login",
    "ua": {
        "name": user,
        "pass": password
    }
});

rets.login().on('setting',function(key, value){
    debug("Setting: %o => %o", key, value);
}).on('capability',function(key, value){
    debug("Capability: %o => %o", key, value);
});

rets.on('login',function(err){
    if (err) {debug("err: %o", err);}
    debug("logged in");
    rets.on('metadata', function(err, metadata){
        if (err) {debug("err: %o", err);}
        var resources = metadata.metadata['metadata-system'].system['metadata-resource'].resource;
        for (var i = 0; i < resources.length; i++) {
            debug("Resource: %o", resources[i].resourceid, "\n" + util.inspect(resources[i], { depth: 0 }) + "\n");
        }
    });
    rets.getMetadata();
});
