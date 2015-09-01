var bodyParser = require('body-parser');
var auth = require('../middleware').auth;
var urlParser = require('url');
var Promise = require('bluebird');
var Url = Promise.promisifyAll(require('../components/url'));
var Comment = Promise.promisifyAll(require('../components/comment'));
var jsonParser = bodyParser.json();

module.exports = function(app) {
  // TODO: isLoggedIn
  app.get('/api/comments/url*', jsonParser, function(req, res, next) {
    // Get all comments for a specific URL
    var url_parts = url.parse(req.url, true);
    var fullPath = url_parts.path;

    var urlToGet = {
      path: fullPath
    };

    Url.get(urlToGet)
      .then(function(url) {
        return Comment.get({id: url.id});
      })
      .then(function(comments){

      })
      .catch(function(err){
        return err;
      });
    res.send(200);
  });

  app.get('/api/comments/id/:id', jsonParser, auth.isLoggedIn, function(req, res, next) {
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