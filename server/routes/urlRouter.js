var auth = require('../middleware').auth;

module.exports = function(app) {
  app.get('/api/urls', auth.isAuthorized, function(req, res, next) {
    // Get list of urls
  });

  app.get('/api/urls/:id', auth.isLoggedIn, function(req, res, next) {
    // Get individual url
  });

  app.post('/api/urls', auth.isAdmin, function(req, res, next) {
    // Add new url!
  });

  app.put('/api/urls/:id', auth.isAdmin, function(req, res, next) {
    // Updates url!
  });

  app.delete('/api/urls/:id', auth.isAdmin, function(req, res, next) {
    // Delete a url!
  });
}
