var debug = require('debug')('rets.js:servers/index.js');
var glob = require("glob");

var servers = [];

var files = glob.sync("**/!(index|mock).js", {cwd:__dirname});
    files.forEach(function(file){
        var server = require('./' + file);
        // debug("server: %o", server);
        servers.push(server);
    });

module.exports = servers;
