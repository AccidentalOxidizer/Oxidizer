var auth = require('../middleware').auth;
var Promise = require('bluebird');
var xssFilters = require('xss-filters');
var Url = Promise.promisifyAll(require('../components/url'));
var Heart = Promise.promisifyAll(require('../components/heart'));
var HeartModel = require('../components').Heart;
var Flag = Promise.promisifyAll(require('../components/flag'));
var Comment = Promise.promisifyAll(require('../components/comment'));
var User = Promise.promisifyAll(require('../components/user'));
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var _ = require('underscore');

module.exports = function(app) {

  // Get all comments with search parameters in query string
  // With auth.isLoggedIn middleware, we should always have a 
  // valid req.user.
  app.get('/api/comments/', jsonParser, auth.isLoggedIn, Comment.getCommentsForUrl);
  
  // this was handled by including a parameter for 'filterByUser'
  app.get('/api/comments/user/', jsonParser, auth.isLoggedIn, Comment.getCommentsForUser);

  app.post('/api/comments/add', jsonParser, auth.isLoggedIn, Comment.addComment);

  app.delete('/api/comments/remove/:id', jsonParser, auth.isAuthorized, Comment.remove);
  
  // Users marks a specific comment as a new favorite.
  app.post('/api/comments/fave', jsonParser, Heart.fave);

  // return all replies to a given comment
  app.get('/api/comments/replies', jsonParser, Comment.getRepliesForComment);

  // Count favorites for a specific comment
  app.get('/api/comments/faves/get', jsonParser, function(req, res, next) {
    
    var favesToGet = {
      url: req.body.commentId
    };
  });

  // Get all favorited comments for the logged in user
  app.get('/api/comments/faves/getForUser', jsonParser, auth.isLoggedIn, Comment.getHeartedCommentsForUser);

  // Users marks a specific comment as flagged for bad behavior.
  app.post('/api/comments/flag', jsonParser, function(req, res, next) {
    Flag.flag({
        UserId: req.user.id,
        CommentId: req.body.CommentId
      })
      .then(function(result) {
        console.log('Comment flagged!');
        console.log('Flagged result: ', result);
        // The result returned is the number of favorites for this particular comment.
        var flagCount = {
          flags: result
        };
        res.send(flagCount);
      })
      .catch(function(err) {
        console.log("Error: Comment not flagged...", err);
      });
  });

  // Get all flags for a specific comment.
  app.get('/api/comments/flags/get', jsonParser, function(req, res, next) {
    var flagsToGet = {
      url: req.body.commentId
    };
  });

  // Remove all flags for a specific comment.
  app.delete('/api/flags/remove/:id', jsonParser, auth.isAuthorized, function(req, res, next) {
    // Delete all flags!
    return Flag.removeAll(req.params.id)
            .then(function(flag) {
              res.send(200, "Deleted all flags!");
            })
            .catch(function(err) {
              console.log("Err: ", err);
              res.send(200);
            });
  });
};