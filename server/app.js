// Deployment only: 
// require('newrelic');

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
var RedisStore = require('connect-redis')(session);

var middleware = require('./middleware');
var morgan = require('morgan');
var passport = require('passport');
var sequelize = require('./components').sequelize;


// UTILITIES
var fs = require('fs');
var utils = require('./utils');

// CONFIG
var config = require('./config.js').get(process.env.NODE_ENV);
var port = config.port || 3000;

// initialize passport settings
require('./components/user/passport')(passport, config);

// initialize database
require('./components/dbconfig');

// ROUTES
var routes = require('./routes');

sequelize.sync().then(function() {
  app.use(morgan('dev'));
  app.use(cookieParser());

  if (process.env.NODE_ENV === 'production') {
    app.use(session({
      store: new RedisStore({
        port: config.redis.port,
        host: config.redis.host,
        pass: config.redis.pass
      }),
      secret: config.secret,
      resave: false,
      saveUninitialized: true
    }));
    app.use(passport.initialize());
    app.use(passport.session({
      store: new RedisStore({
        port: config.redis.port,
        host: config.redis.host,
        pass: config.redis.pass
      }),
      secret: config.secret
    }));
  } else {
    app.use(session({
      secret: config.secret,
      resave: false,
      saveUninitialized: true
    }));
    app.use(passport.initialize());
    app.use(passport.session());
  }


  routes(express, app, passport);
  http.createServer(app).listen(port);

  if (process.env.NODE_ENV === 'production') {
    var options = {
      key: fs.readFileSync(__dirname + '/../keys/key.pem', 'utf-8'),
      cert: fs.readFileSync(__dirname + '/../keys/api_oxidizer_io.crt', 'utf-8')
    }
    https.createServer(options, app).listen(443);
  }

});