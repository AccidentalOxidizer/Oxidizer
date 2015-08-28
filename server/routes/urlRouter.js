var bodyParser = require('body-parser');
var auth = require('../middleware').auth;

var jsonParser = bodyParser.json();

module.exports = function(app) {
  app.get('/api/urls', jsonParser, auth.isAuthorized, function(req, res, next) {
    // Get list of urls
  });

  app.get('/api/urls/:id', jsonParser, auth.isLoggedIn, function(req, res, next) {
    // Get individual url
  });

  app.post('/api/urls', jsonParser, auth.isAdmin, function(req, res, next) {
    // Add new url!
  });

  app.put('/api/urls/:id', jsonParser, auth.isAdmin, function(req, res, next) {
    // Updates url!
  });

  app.delete('/api/urls/:id', jsonParser, auth.isAdmin, function(req, res, next) {
    // Delete a url!
  });
}
