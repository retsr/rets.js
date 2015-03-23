var express = require('express');
// var path = require('path');
var debug = require('debug')('lowmango:server');
var logger = require('morgan');
// var util = require('util');
var app = express();
// var config = require('./config.json');
var rets = require('./lib/rets-old');

app.set('port', (process.env.PORT || '3000'));

app.use(logger('dev'));

app.get('/properties/', rets.login, function(req, res){
    res.type('json');
    rets.search({Limit: 3}).pipe(res);
});

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

if (app.get('env') === 'development') {
    app.use(function(err, req, res) {
        res.status(err.status || 500);
        res.json({
            message: err.message,
            error: err
        });
    });
}

app.use(function(err, req, res) {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: {}
    });
});

app.listen(app.get('port'), function(){
    debug('App Started...');
});

module.exports = app;
