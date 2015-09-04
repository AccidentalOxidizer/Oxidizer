// EXPRESS
var express = require('express');
var app = express();

// SERVE STATIC FILES FROM CLIENT FOLDER
app.use(express.static('client'));

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
app.set('port', process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 3000);
app.set('ip', process.env.OPENSHIFT_NODEJS_IP || process.env.IP || '127.0.0.1');

// initialize passport settings
require('./components/user/passport')(passport, config);

// initialize database
require('./components/dbconfig');

// ROUTES
var routes = require('./routes');

sequelize.sync().then(function() {
  app.use(morgan('dev'));
  app.use(cookieParser());

  // using sessions for auth for now
  // need to switch to tokens 
  app.use(session({
    secret: config.secret,
    resave: false,
    saveUninitialized: true
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  routes(app, passport);

  app.listen(app.get('port'), app.get('ip'), function(err) {
    if (err) console.log(err);
    console.log('Server running on port ' + app.get('port') + ' on ' + app.get('ip'));
  });

  /*

  Warning: connect.session() MemoryStore is not
  designed for a production environment, as it will leak
  memory, and will not scale past a single process.

  */
});