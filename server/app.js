// EXPRESS
var express = require('express');
var app = express();

// MIDDLEWARE
var path = require('path');
// var session = require('express-session');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var middleware = require('./middleware');

// UTILITIES
var utils = require('./utils');

// CONFIG
var config = require('./config.js').get(process.env.NODE_ENV);
var port = process.env.PORT || 3000;

// ROUTES
var routes = require('./routes');
