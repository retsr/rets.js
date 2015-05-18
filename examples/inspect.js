// DEBUG=rets.js:rets* USER=... PASSWORD=... node examples/simple.js
// 
var RETS       = require('../');
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

rets.on('metadata',function(err){
    if (err) {throw err;}
    rets.inspect();
});

rets.on('login',function(err){
    if (err) {throw err;}
    rets.getMetadata();
});

rets.login();
