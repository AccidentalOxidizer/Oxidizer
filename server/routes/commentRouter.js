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

  app.post('/api/comments/add/old', jsonParser, auth.isLoggedIn, function(req, res, next) {
    // Add a new comment!
    Url.save({
        url: req.body.url
      })
      .then(function(url) {

        // HOW IS USER ID VERIFIED? 
        // User ID needs to be a number
        if (typeof req.user.id !== 'number') {
          throw new Error('TypeError: User ID received is invalid.');
        }

        // sanitize against XSS etc
        var text = xssFilters.inHTMLData(req.body.text);

        // Defaults to false
        var isPrivate = (req.body.isPrivate === true || req.body.isPrivate === 'true') ? true : false;
        console.log('Comments add: isPrivate is ' + isPrivate);

        return Comment.post({
          text: text,
          isPrivate: isPrivate,
          UserId: req.user.id,
          UrlId: url.get('id'),
          repliesToId: req.body.repliesToId
        });
      })
      .then(function(comment) {
        // if this is a reply, add to the original user's notification
        var repliesToId = comment.get('repliesToId');

        if (repliesToId !== null){
          Comment.get({id: repliesToId})
            .then(function(comment){
              User.incrementNotification(comment.rows[0].UserId, "replies");
            })
            .catch(function(err){
              console.log('error adding to repliesToCheck', err);
            })
          ;
        }

        formatComment = {
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
            userAvatar: req.user.avatar,
            userId: req.user.id,
            username: req.user.name
          }
        });
      })
      .catch(function(err) {
        console.log(err);
        res.end(500);
      });
  });
  // Users marks a specific comment as a new favorite.
  app.post('/api/comments/fave', jsonParser, function(req, res, next) {
    Heart.fave({
        UserId: req.user.id,
        CommentId: req.body.CommentId
      })
      .then(function(result) {
        console.log('Comment faved!');
        console.log('Faved result: ', result);
        // The result returned is the number of favorites for this particular comment.
        var faveCount = {
          favs: result.count,
          faved: result.faved
        };
        res.send(faveCount);

        return Comment.getUserId(req.body.CommentId)
          .then(function(userId){
            return User.updateNotification(userId, 'hearts');
          });
      })
      .catch(function(err) {
        console.log("Error: Comment not faved...", err);
      });
  });

  // Count favorites for a specific comment
  app.get('/api/comments/faves/get', jsonParser, function(req, res, next) {
    
    var favesToGet = {
      url: req.body.commentId
    };
  });

  // Get all favorited comments for the logged in user
  app.get('/api/comments/faves/getForUser', jsonParser, auth.isLoggedIn, function(req, res, next) {

    console.log("Comments faves for user, query: ", req.query);

    HeartModel.getUserFaves(req.user.id, req.query.lastCommentId)
      .then(function(result) {
        console.log("getUserFaves, result[0]:");
        console.log("Comment text: ", result[0].Comment.text);
        console.log("Comment Url: ", result[0].Comment.Url.url);

        var comments = _.pluck(result, 'Comment');

        res.send({
          comments: comments,
          // numComments: result[0].count,
          currentTime: new Date(), // TODO: Fill this out!
          userInfo: {
            userId: req.user.id,
            username: req.user.name,
            // repliesToCheck: result[1].repliesToCheck,
            // heartsToCheck: result[1].heartsToCheck,
          }
        });
      })
      .catch(function(err) {
        console.log("Comments get faves for user err: ", err);
        res.send(500);
      });
      
    var favesToGet = {
      url: req.body.commentId
    };
  });

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

  app.delete('/api/comments/remove/:id', jsonParser, auth.isAuthorized, function(req, res, next) {
    // Delete a comment!
    return Comment.remove(req.params.id)
            .then(function(url) {
              res.send(200, "Deleted comment!");
            })
            .catch(function(err) {
              console.log("Err: ", err);
              res.send(500);
            });
  });

  // app.put('/api/comments/:id', jsonParser, auth.isAuthorized, function(req, res, next) {
  //   // Updates a comment!
  // });
};