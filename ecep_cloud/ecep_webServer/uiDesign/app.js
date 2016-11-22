var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//var session=require('express-session');
var app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

var routes = require('./routes/index');
var users = require('./routes/users');

var create= require('./routes/createDocker');
var apps= require('./routes/createApplication');
var signin= require('./routes/index');
//var home=require('./routes/home');
//var home=require('./routes/home');


app.use('/', routes);
app.use('/users', users);
app.use('/create', create);
app.use('/apps', apps);



/*app.use(session({
  cookieName : 'session',
  secret : 'session_ass_test',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000
}));*/
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));


app.use('/', routes);
app.use('/users', users);

// app.get('/homepage',function (req,res) {
//   home.homepage(req,res);
// });

app.get('/signin',function (req,res) {
  home.signin(req,res);
})

app.post('/registeruser',function(req,res){
  console.log("inside register user app.js");
  home.registeruser(req,res);
});

app.post('/checklogin',function(req,res){
  console.log("inside check user app.js");
  home.checklogin(req,res);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


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
