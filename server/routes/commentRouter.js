var bodyParser = require('body-parser');
var auth = require('../middleware').auth;
var Promise = require('bluebird');
var Url = Promise.promisifyAll(require('../components/url'));
var Comment = Promise.promisifyAll(require('../components/comment'));
var jsonParser = bodyParser.json();

module.exports = function(app) {
  // TODO: isLoggedIn
  app.post('/api/comments/get', jsonParser, function(req, res, next) {
    // Get all comments for a specific URL

    console.log("REQ BODY LINE 13: ", req.body);

    var urlToGet = {
      url: req.body.url
    };

    Url.get(urlToGet)
      .then(function(url) {
        return Comment.get({
          id: url.id
        });
      })
      .then(function(comments) {
        console.log("COMMENTS?? ", comments);
        res.send(200, {
          comments: comments
        });
      })
      .catch(function(err) {
        return err;
      });

  });

  app.get('/api/comments/id/:id', jsonParser, auth.isLoggedIn, function(req, res, next) {
    // Get individual comment
    res.send(200);
  });

  // add isAuth
  app.post('/api/comments/add', jsonParser, function(req, res, next) {
    // Add a new comment!
    console.log('%%%%%%%%%%', req.session);
    Url.save({
        url: req.body.url
      })
      .then(function(url) {
        return Comment.post({
          text: req.body.text,
          isPrivate: req.body.isPrivate,
          UserId: req.user.id,
          UrlId: url.get('id')
        });
      })
      .then(function(comment) {
        res.send(comment);
      })
      .catch(function(err) {
        console.log(err);
        res.end(500);
      });
  });

  app.put('/api/comments/:id', jsonParser, auth.isAuthorized, function(req, res, next) {
    // Updates a comment!
  });

  app.delete('/api/comments/:id', jsonParser, auth.isAuthorized, function(req, res, next) {
    // Delete a comment!
  });

}