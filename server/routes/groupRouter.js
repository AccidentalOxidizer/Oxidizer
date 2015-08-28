var auth = require('../middleware').auth;

module.exports = function(app) {
  app.get('/api/groups', auth.isAuthorized, function(req, res, next) {
    // Get list of groups
  });

  app.get('/api/groups/:id', auth.isAuthorized, function(req, res, next) {
    // Get individual group
  });

  app.post('/api/groups', auth.isAuthorized, function(req, res, next) {
    // Add new group!
  });

  app.put('/api/groups/:id', auth.isAuthorized, function(req, res, next) {
    // Updates a group!
  });

  app.delete('/api/groups/:id', auth.isAuthorized, function(req, res, next) {
    // Delete a group!
  });
};