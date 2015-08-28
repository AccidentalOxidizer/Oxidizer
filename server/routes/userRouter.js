var bodyParser = require('body-parser');
var auth = require('../middleware').auth;

var jsonParser = bodyParser.json();
module.exports = function(app) {
  app.get('/api/users', jsonParser, auth.isAuthorized, function(req, res, next) {
    // Get list of users
  });

  app.get('/api/users/:id', jsonParser, auth.isAuthorized, function(req, res, next) {
    // Get individual user
  });

  app.post('/api/users', jsonParser, auth.isAuthorized, function(req, res, next) {
    // Add new user!
  });

  app.put('/api/users/:id', jsonParser, auth.isAuthorized, function(req, res, next) {
    // Updates user!
  });

  app.delete('/api/users/:id', jsonParser, auth.isAuthorized, function(req, res, next) {
    // Delete a user!
  });
}
