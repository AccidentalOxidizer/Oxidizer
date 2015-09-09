// EXPRESS
var express = require('express');
var http = require('http');
var https = require('https');
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
var fs = require('fs');
var utils = require('./utils');

// CONFIG
var config = require('./config.js').get(process.env.NODE_ENV);

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

  routes(express, app, passport);

  http.createServer(app, function(req, res) {
    console.log('http running..');
  }).listen(3000);

  if (process.env.NODE_ENV === 'production') {
    var options = {
      key: fs.readFileSync(__dirname + '/../keys/key.pem', 'utf-8'),
      cert: fs.readFileSync(__dirname + '/../keys/api_oxidizer_io.crt', 'utf-8')
    };

    https.createServer(options, app, function(req, res) {
      console.log('https running..');
    }).listen(443);
  }
});


/*

Warning: connect.session() MemoryStore is not
designed for a production environment, as it will leak
memory, and will not scale past a single process.
// Maybe redis store or mongostore..
*/