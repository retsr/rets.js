var debug = require('debug')('rets.js:servers/index.js');
var glob = require("glob");
var url = require('url');

var servers = [];

var files = glob.sync("**/!(index).js", {cwd:__dirname});
    files.forEach(function(file){
        var server = require('./' + file);
            server.config.url = url.parse(server.config.url);
        debug("server.config.url: %o", server.config.url);
        servers.push(server);
    });

module.exports = servers;
