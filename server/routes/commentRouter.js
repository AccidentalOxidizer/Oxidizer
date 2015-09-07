var auth = require('../middleware').auth;
var Promise = require('bluebird');
var xssFilters = require('xss-filters');
var Url = Promise.promisifyAll(require('../components/url'));
var Heart = Promise.promisifyAll(require('../components/heart'));
var Flag = Promise.promisifyAll(require('../components/flag'));
var Comment = Promise.promisifyAll(require('../components/comment'));
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

module.exports = function(app) {

  // Users marks a specific comment as a new favorite.
  app.post('/api/comments/fave', jsonParser, function(req, res, next) {
    Heart.fave({
        UserId: req.body.UserId,
        CommentId: req.body.CommentId
      })
      .then(function(result) {
        console.log('Comment faved!');
        console.log('Faved result: ', result);
        // The result returned is the number of favorites for this particular comment.
        var faveCount = {
          favs: result
        };
        res.send(faveCount);
      })
      .catch(function(err) {
        console.log("Error: Comment not faved...", err);
      });
  });

  // Get all favorites for a specific comment
  app.get('/api/comments/faves/get', jsonParser, function(req, res, next) {
    console.log('getting');
    
    var favesToGet = {
      url: req.body.commentId
    };
  });

  // Users marks a specific comment as flagged for bad behavior.
  app.post('/api/comments/flag', jsonParser, function(req, res, next) {
    Flag.flag({
        UserId: req.body.UserId,
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

  // TODO: isLoggedIn
  // Get all comments for a specific URL
  app.get('/api/comments/get', jsonParser, function(req, res, next) {
    // Handle undefined URLs to prevent crashing? Maybe...
    if (req.query.url === undefined) {
      return;
    }

    var urlToGet = {
      url: req.query.url
    };

    // if there is no repliesTo parameter, set it to null
    if (req.query.repliesToId === undefined || req.query.repliesToId === 'undefined') {
      req.query.repliesToId = null;
    }

    // translate public/private from string ('true' or 'false') to number (1 or 0)
    if (req.query.isPrivate === 'false'){
      req.query.isPrivate = 0;
    } else {
      req.query.isPrivate = 1;
    }
    
    Url.get(urlToGet)
      .then(function(url) {
        if (url !== null) {
          return Comment.get({
            UrlId: url.id,
            isPrivate: req.query.isPrivate,
            repliesToId: req.query.repliesToId
          }, req.query.lastUpdateId);
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
            userId: req.user.id || undefined,
            username: req.user.name || undefined // TODO: Fill this out!
          }
        });
      })
      .catch(function(err) {
        console.log("User not logged in", err);
        res.send(200);
      });

  });


  // Get all comments for a given user. Defaults to loading all the
  // comments for the logged in user.
  // TODO? Add support to load comments for a given user via user id.
  app.get('/api/comments/get/user', jsonParser, function(req, res, next) {

    // TODO: when we have our middleware checks in place,
    // this shouldn't be necessary
    if (req.user === undefined) {
      console.log("Comments: get comments for user - user not logged in.");
      res.send(401); // unauthorized
      return;
    }

    var userId = req.user.id;
    var maxCommentId = req.query.maxCommentId || null;
    console.log("Comments: get comments for userId " + userId + " maxCommentId " + maxCommentId);
    console.log("Comments: get comments req.query");
    console.log(req.query);

    Comment.get({UserId: userId}, maxCommentId)
      .then(function(comments) {
        res.send(200, {
          comments: comments,
        });
      })
      .catch(function(err) {
        console.log("Comments: get comments for user error ", err);
        res.send(500);
      });
  });


  app.get('/api/comments/id/:id', jsonParser, auth.isLoggedIn, function(req, res, next) {
    // Get individual comment
    res.send(200);
  });

  // add isAuth
  app.post('/api/comments/add', jsonParser, auth.isLoggedIn, function(req, res, next) {
    console.log(req.body);
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
        var isPrivate = typeof req.body.isPrivate === 'boolean' ? req.body.isPrivate : false;

        return Comment.post({
          text: text,
          isPrivate: isPrivate,
          UserId: req.user.id,
          UrlId: url.get('id'),
          repliesToId: req.body.repliesToId
        });
      })
      .then(function(comment) {

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