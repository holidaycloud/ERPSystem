var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
//var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
var config = require('./config/config.json');

var uri = 'mongodb://'+config.db.host+':'+config.db.port+'/'+config.db.database;
global.db = mongoose.createConnection(uri);

var log4js = require('log4js');
//log4js config
log4js.configure({
    appenders : [ {
        type : 'console'
    }],
    replaceConsole : true
});
var logger = log4js.getLogger('normal');

var member = require('./routes/member');
var ent = require('./routes/ent');
var product = require('./routes/product');
var price = require('./routes/price');
var order = require('./routes/order');
var customer = require('./routes/customer');
var province = require('./routes/province');
var city = require('./routes/city');
var district = require('./routes/district');
var domain = require('./routes/domain');
var feedback = require('./routes/feedback');
var classify = require('./routes/classify');
var report = require('./routes/report');
var card = require('./routes/card');
var address = require('./routes/deliveryAddress');
var invoice = require('./routes/invoice');
var index = require('./routes/index');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(log4js.connectLogger(logger, {
    level : log4js.levels.INFO
}));
app.use(function(req,res,next){
    res.set('X-Powered-By','Server');
    next();
});
app.use('/', index);
app.use('/api/member', member);
app.use('/api/ent', ent);
app.use('/api/product', product);
app.use('/api/price', price);
app.use('/api/order', order);
app.use('/api/customer', customer);
app.use('/api/province', province);
app.use('/api/city', city);
app.use('/api/district', district);
app.use('/api/domain', domain);
app.use('/api/feedback', feedback);
app.use('/api/classify', classify);
app.use('/api/report', report);
app.use('/api/card', card);
app.use('/api/address', address);
app.use('/api/invoice', invoice);
/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        console.log(err);
        res.status(err.status || 500);
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    console.log(err);
    res.status(err.status || 500);
});

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + server.address().port);
});
module.exports = app;
