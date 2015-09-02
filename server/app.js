// EXPRESS
var express = require('express');
var app = express();

// MIDDLEWARE
var path = require('path');
var compression = require('compression');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var middleware = require('./middleware');
var morgan = require('morgan');
var passport = require('passport');
var sequelize = require('./components').sequelize;

// UTILITIES
var utils = require('./utils');

// CONFIG
var config = require('./config.js').get(process.env.NODE_ENV);

// initialize passport settings
require('./components/user/passport')(passport, config);

// initialize database
require('./components/dbconfig');

// ROUTES
var routes = require('./routes');

var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var ipaddr = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

app.set('port', process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 8080);
app.set('ipaddr', process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1");



console.log(process.env);
console.log('openshift env var', process.env.OPENSHIFT_ENV_VAR);
console.log('openshift port?', process.env.OPENSHIFT_NODEJS_PORT);
console.log('opensdhift ip?', process.env.OPENSHIFT_NODEJS_IP);
console.log('ip', app.get('ipaddr'));
console.log('port', app.get('port'));
app.set('port', process.env.OPENSHIFT_NODEJS_PORT || 8080);
app.set('ipaddr', process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1");

sequelize.sync().then(function() {
  app.use(morgan('dev'));
  app.use(cookieParser());

  // using sessions for auth for now
  app.use(session({
    secret: 'iron oxide',
    resave: false,
    saveUninitialized: true
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  routes(app, passport);

  http.createServer(app).listen(app.get('port'), app.get('ipaddr'), function() {
    console.log("✔ Express server listening at %s:%d ", app.get('ipaddr'), app.get('port'));
  });

  // app.listen(app.get('port'), app.get('ip'), function() {
  //   console.log('Server running on port ' + port);
  // });
});
