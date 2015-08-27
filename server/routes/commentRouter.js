var auth = require('../middleware').auth;

module.exports = function(app) {
  app.get('/api/comments', auth.isLoggedIn, function(req, res, next) {
    // Get list of comments
    res.send(200);
  });

  app.get('/api/comments/:id', auth.isLoggedIn, function(req, res, next) {
    // Get individual comment
    res.send(200);
  });

  app.post('/api/comments', auth.isAuthorized, function(req, res, next) {
    // Add a new comment!
  });

  app.put('/api/comments/:id', auth.isAuthorized, function(req, res, next) {
    // Updates a comment!
  });

  app.delete('/api/comments/:id', auth.isAuthorized, function(req, res, next) {
    // Delete a comment!
  });
}
