var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var about = require('./routes/about');
var contact = require('./routes/contact');
var wiki = require('./routes/wiki');
var wikiTreePrivilege = require('./routes/wikiTreePrivilege');
var users = require('./routes/users');
var adsTemplate = require('./routes/adsTemplate');
var sts = require('./routes/sts');
var adsBuild = require('./routes/adsBuild');
var adsUnitlScript = require('./routes/adsUnitlScript');

var template = require("hbs");
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'hbs');
app.set('view engine', 'html');
app.engine('html', template.__express);

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'static/common/images', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'static')));
app.use(express.static(path.join(__dirname, 'static/common')));
app.use(express.static(path.join(__dirname, 'static/bootstrap3')));
app.use(express.static(path.join(__dirname, 'static/epiceditor')));
app.use(express.static(path.join(__dirname, 'static/zTree3')));
app.use(express.static(path.join(__dirname, 'static/codemirror')));

app.use('/', routes);
app.use('/about', about);
app.use('/contact', contact);
app.use('/wiki', wiki);
app.use('/wikiTreePrivilege', wikiTreePrivilege);
app.use('/users', users);
app.use('/ads/template', adsTemplate);
app.use('/sts', sts);
app.use('/adsBuild', adsBuild);
app.use('/ads/unitlScript', adsUnitlScript);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
