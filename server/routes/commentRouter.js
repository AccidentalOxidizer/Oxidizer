
var auth = require('../middleware').auth;
var Promise = require('bluebird');
var xssFilters = require('xss-filters');
var Url = Promise.promisifyAll(require('../components/url'));
var Heart = Promise.promisifyAll(require('../components/heart'));
var Flag = Promise.promisifyAll(require('../components/flag'));
var Comment = Promise.promisifyAll(require('../components/comment'));
var User = Promise.promisifyAll(require('../components/user'));
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

module.exports = function(app) {

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

  // Get all comments with search parameters in query string
  // With auth.isLoggedIn middleware, we should always have a 
  // valid req.user.
  app.get('/api/comments/get', jsonParser, auth.isLoggedIn, function(req, res, next) {
    var searchObject = {};

    console.log("Comments get: req.query: ");
    console.log(req.query);
    
    // Are we requesting comments for the logged in user?
    if (req.query.filterByUser) {
      searchObject.UserId = req.user.id;
    }

    // translate public/private from string ('true' or 'false') to number (1 or 0)
    if (req.query.isPrivate === 'true' || req.query.isPrivate === '1'){
      searchObject.isPrivate = 1
    } else {
      searchObject.isPrivate = 0;
    }

    if (req.query.repliesToId){
      searchObject.repliesToId = req.query.repliesToId;
    } else {
      // if we don't include repliesToId, only return non-replies
      searchObject.repliesToId = null;
    }

    if (req.query.textSearch) {
      searchObject.text = {$like: '%' + req.query.textSearch + '%'};
      console.log("Comments: get - updated searchObj: ");
      console.log(searchObject);
    }

    return new Promise(function(resolve, reject){
      // if there is a url search parameter, get the urls id, then search comments
        if (req.query.url !== undefined) {
          Url.getId(req.query.url)
            .then(function(urlId){
              searchObject.UrlId = urlId;
              resolve(searchObject);
            });
        } else {
          resolve(searchObject);
        }
      })
      .then(function(searchObj){
        return Comment.get(searchObj, req.query.lastCommentId, req.query.urlSearch);
      })
      .then(function(result) {
        // TODO: Handle case where URL exists but no comments??
        // TODO: Make this look like contract!

        // XXX: req.user should never be undefined if logged in.
        var userInfo = {
          userId: undefined,
          username: undefined
        }

        if (req.user !== undefined){
          userInfo.userId = req.user.id;
          userInfo.username = req.user.name;
        }

        res.send({
          comments: result.rows,
          numComments: result.count,
          currentTime: new Date(), // TODO: Fill this out!
          userInfo: userInfo
        });
      })
      .catch(function(err) {
        throw err;
        console.log("User not logged in", err);
        res.send(200);
      });
  });

  // add isAuth
  app.post('/api/comments/add', jsonParser, auth.isLoggedIn, function(req, res, next) {
    // Add a new comment!
    console.log(req.body.repliesToId);
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
            username: req.user.name
          }
        });
      })
      .catch(function(err) {
        console.log(err);
        res.end(500);
      });
  });

  // app.put('/api/comments/:id', jsonParser, auth.isAuthorized, function(req, res, next) {
  //   // Updates a comment!
  // });

  // app.delete('/api/comments/:id', jsonParser, auth.isAuthorized, function(req, res, next) {
  //   // Delete a comment!
  // });
};