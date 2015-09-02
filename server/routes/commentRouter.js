var bodyParser = require('body-parser');
var auth = require('../middleware').auth;
var Promise = require('bluebird');
var Url = Promise.promisifyAll(require('../components/url'));
var Comment = Promise.promisifyAll(require('../components/comment'));
var jsonParser = bodyParser.json();

module.exports = function(app) {
  // TODO: isLoggedIn
  // Get all comments for a specific URL
  app.post('/api/comments/get', jsonParser, function(req, res, next) {

    var urlToGet = {
      url: req.body.url
    };

    Url.get(urlToGet)
      .then(function(url) {
        if (url !== null) {
          return Comment.get({
            UrlId: url.id
          });
        } else {
          // We expect an empty comments array to be returned
          // for any webpage that we haven't yet visited / added
          // comments to.

          // var emptyComment = {
          //   comments: [],
          //   currentTime: '',
          //   userInfo: {
          //     username: ''
          //   }
          // };
          return [];
        }
      })
      .then(function(comments) {
        // TODO: Handle case where URL exists but no comments??
        // TODO: Make this look like contract!

        res.send(200, {
          comments: comments,
          currentTime: new Date(), // TODO: Fill this out!
          userInfo: {
            username: req.user.name || undefined// TODO: Fill this out!
          }
        });
      })
      .catch(function(err) {
        console.log("User not logged in", err);
        res.send(200);
      });

  });

  app.get('/api/comments/id/:id', jsonParser, auth.isLoggedIn, function(req, res, next) {
    // Get individual comment
    res.send(200);
  });

  // add isAuth
  app.post('/api/comments/add', jsonParser, function(req, res, next) {
    // Add a new comment!
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
        formatComment ={ 
          UrlId: comment.get('UrlId'),
          text: comment.get('text'),
          createdAt: comment.get('createdAt'),
          isPrivate: comment.get('isPrivate'),
          User: {
            name: req.user.name
          }
        };

        res.send({
          comments: [formatComment],
          currentTime: new Date(), // TODO: add currentTime
          userInfo: {
            username: req.user.name
          }
        });
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
};