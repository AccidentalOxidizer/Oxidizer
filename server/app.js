// EXPRESS
var express = require('express');
var app = express();

// MIDDLEWARE
var path = require('path');
var compression = require('compression');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var middleware = require('./middleware');
var morgan = require('morgan');

// UTILITIES
var utils = require('./utils');

// CONFIG
var config = require('./config.js').get(process.env.NODE_ENV);
var port = process.env.PORT || 3000;

// ROUTES
var routes = require('./routes');

// connect to DB here and do following in callback:


routes(app);

app.listen(port, function() {
  console.log('Server running on port ' + port);
});
