var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var db = require('./config/db');
var session =  require('express-session');
var cookieSession = require('cookie-session');
var passport = require('./config/passport.js');
var uid = require('uid2')
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'modules'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public','img','favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cookieSession({secret:'as65d4gf560dsa5e98cqe11'}));
app.use(bodyParser.urlencoded({extended: true}));
//TODO validar sessions e fazer com que caso exista sessão, o user n precisa logar denovo
app.use(session({
  genid: function (req) {
    return uid(15);
  },
  secret: 'D5w7a9r3f*Cdzdwarf377uk1nkz',
  cookie: {
    secure : true,
    expires: 24*60*60*1000
  },
  resave : false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

//middleware inactive in first step
/*
app.use(function (req,res,next){
  if(req.path.split('/')[1] === 'api' && !req.user){
    res.status(401).send({success: false, message: 'Unlogged user'});
  }
  next();
});
*/

//routes
var routes = {};
routes.main = require('./modules/main/index');
routes.auth = require('./modules/main/auth');
var api = {};
api.users = require('./modules/users/api/routes');

app.use('/', routes.main);
app.use('/auth',routes.auth);
//Api
app.use('/api/users',api.users);

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
