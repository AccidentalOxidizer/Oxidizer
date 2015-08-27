var auth = require('../middleware').auth;

module.exports = function(app) {
  app.get('/api/users', auth.isAuthorized, function(req, res, next) {
    // Get list of users
  });

  app.get('/api/users/:id', auth.isAuthorized, function(req, res, next) {
    // Get individual user
  });

  app.post('/api/users', auth.isAuthorized, function(req, res, next) {
    // Add new user!
  });

  app.put('/api/users/:id', auth.isAuthorized, function(req, res, next) {
    // Updates user!
  });

  app.delete('/api/users/:id', auth.isAuthorized, function(req, res, next) {
    // Delete a user!
  });
}
