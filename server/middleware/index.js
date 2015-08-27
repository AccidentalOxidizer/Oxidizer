var auth = {};
auth.isLoggedIn = require('./isLoggedIn');
auth.isAuthorized = require('./isAuthorized');
auth.isAdmin = require('./isAdmin');

exports.auth = auth;
