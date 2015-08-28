var bodyParser = require('body-parser');
var auth = require('../middleware').auth;

var jsonParser = bodyParser.json();

module.exports = function(app) {
  app.get('/api/comments', jsonParser, auth.isLoggedIn, function(req, res, next) {
    // Get list of comments
    res.send(200);
  });

  app.get('/api/comments/:id', jsonParser, auth.isLoggedIn, function(req, res, next) {
    // Get individual comment
    res.send(200);
  });

  app.post('/api/comments', jsonParser, auth.isAuthorized, function(req, res, next) {
    // Add a new comment!
  });

  app.put('/api/comments/:id', jsonParser, auth.isAuthorized, function(req, res, next) {
    // Updates a comment!
  });

  app.delete('/api/comments/:id', jsonParser, auth.isAuthorized, function(req, res, next) {
    // Delete a comment!
  });
}
