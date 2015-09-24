// Deployment only: 
if (process.env.NODE_ENV === 'production') {
// require('newrelic');
}

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

// ROUTES
var routes = require('./routes');

// add all our models to the app so they are always on the request
var models = require('./components');
app.set('models', models);


if (process.env.NODE_ENV === 'production') {
  var nullfunc = function() {};
  console.log = nullfunc;
  console.info = nullfunc;
  console.error = nullfunc;
  console.warn = nullfunc;
}

sequelize.sync().then(function() {
  // app.use(morgan('dev'));
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
      key: fs.readFileSync(__dirname + '/../keys/www/key.pem', 'utf-8'),
      cert: fs.readFileSync(__dirname + '/../keys/www/www_oxidizer_io.crt', 'utf-8')
    }
    https.createServer(options, app).listen(443);
  }

});
