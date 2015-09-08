/* TEST USER AUTHENTICATION */
var utils = require('../server/utils');
var Comment = require('../server/components/comment');
var commentModel = require('../server/components').Comment;
var userModel = require('../server/components').User;
var urlModel = require('../server/components').Url;
var Promise = require('bluebird');
var testHelpers = require('./testHelpers');
var request = Promise.promisifyAll(require('request'));
var config = require('../server/config.js').get(process.env.NODE_ENV);
var session = require('express-session');

console.log(config);