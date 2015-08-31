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
var port = process.env.PORT || 3000;

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
  app.use(session({
    secret: 'iron oxide',
    resave: false,
    saveUninitialized: true
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  routes(app, passport);

  app.listen(port, function() {
    console.log('Server running on port ' + port);
  });
});
