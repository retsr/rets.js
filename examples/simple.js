// DEBUG=rets.js:simple* USER=**** PASSWORD=**** node examples/simple.js

// var util       = require('util');
var Table = require('cli-table');
var RETS       = require('../');
var debug      = require('debug')('rets.js:simple');
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

var settings = new Table({
    head: ['key', 'value']
});

var capabilities = new Table({
    head: ['key', 'value']
});

rets.login().on('setting',function(key, value){
    settings.push([key, value]);
}).on('capability',function(key, value){
    capabilities.push([key, value]);
});

rets.on('login',function(err){
    if (err) {debug("err: %o", err);}

    debug("SETTINGS:");
    settings.toString().split("\n").forEach(function(line){
        debug(line);
    });

    debug("CAPABILITIES:");
    capabilities.toString().split("\n").forEach(function(line){
        debug(line);
    });

    rets.on('metadata', function(err, metadata){
        if (err) {debug("err: %o", err);}
        var resources = metadata.metadata['metadata-system'].system['metadata-resource'].resource;//[1]['metadata-class'].class;
        // debug("resources: \n%s", util.inspect(resources, { colors: true, depth: 2 }));// resources[i].resourceid, "\n" + util.inspect(resources[i], { depth: 0 }) + "\n");
        var classes = [];
        var table = new Table({
            head: ['resourceid', 'standardname', 'visiblename', 'description', 'keyfield', 'classcount']
        });
        resources.forEach(function(resource){
            if (parseInt(resource.classcount) === 1) {
                classes.push(resource['metadata-class'].class);
            } else {
                resource['metadata-class'].class.forEach(function(cls){
                    classes.push(cls);
                });
            }
            table.push([
                resource.resourceid,
                resource.standardname,
                resource.visiblename,
                resource.description,
                resource.keyfield,
                resource.classcount
            ]);
        });
        debug("RESOURCES:");
        table.toString().split("\n").forEach(function(line){
            debug(line);
        });

        table = new Table({
            head: ['classname', 'standardname', 'visiblename', 'description']
        });
        classes.forEach(function(cls){
            table.push([
                cls.classname,
                cls.standardname,
                cls.visiblename,
                cls.description
            ]);
        });

        debug("CLASSES:");
        table.toString().split("\n").forEach(function(line){
            debug(line);
        });

    });
    rets.getMetadata();
});
