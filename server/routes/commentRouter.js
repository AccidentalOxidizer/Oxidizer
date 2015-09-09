
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
        UserId: req.user.id,
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
  app.get('/api/comments/get', jsonParser, function(req, res, next) {
    var searchObject = {};
    
    // if there is a userId, add it to searhcObject
    if (req.user) {
      searchObject.UserId = req.user.id;
    }

    // if there is a isPrivate parameter, add it to the searchObject
    if(req.query.isPrivate !== undefined){
      searchObject.isPrivate = req.query.isPrivate;
    }

    if (req.query.repliesToId){
      searchObject.repliesToId = req.query.repliesToId;
    } else {
      // if we don't include repliesToId, only return non-replies
      searchObject.repliesToId = null;
    }

    // translate public/private from string ('true' or 'false') to number (1 or 0)
    if (req.query.isPrivate === 'true' || req.query.isPrivate === '1'){
      searchObject.isPrivate = 1
    } else {
      searchObject.isPrivate = 0;
    }

    if (req.query.lastCommentId) {
      searchObject.lastCommentId = req.query.lastCommentId
    }

    return new Promise(function(resolve, reject){
      // if there is a url search parameter, get the urls id, then search comments
        if (req.query.url !== undefined) {
          Url.getId(req.query.url)
            .then(function(urlId){
              searchObject.UrlId = urlId;
              resolve(searchObject);
            });
        //if there is a urlString parameter, get Comments with the string
        } else if (req.query.urlString !== undefined){
          resolve(searchObject, req.query.urlString);
        // if there is no url or urlString, just search comments
        } else {
          resolve(searchObject);
        }
      })
      .then(function(searchObj, urlStr){
        return Comment.get(searchObj, urlStr);
      })
      .then(function(result) {
        // TODO: Handle case where URL exists but no comments??
        // TODO: Make this look like contract!
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


  // // Get all comments for a given user. Defaults to loading all the
  // // comments for the logged in user.
  // // TODO? Add support to load comments for a given user via user id.
  // app.get('/api/comments/get/user', jsonParser, function(req, res, next) {
  //   // TODO: when we have our middleware checks in place,
  //   // this shouldn't be necessary
  //   if (req.user === undefined) {
  //     console.log("Comments: get comments for user - user not logged in.");
  //     res.send(401); // unauthorized
  //     return;
  //   }

  //   var userId = req.user.id;
  //   console.log("Comments: get comments for userId " + userId + " maxCommentId " + req.query.oldestLoadedCommentId);
  //   console.log("Comments: get comments req.query");
  //   console.log(req.query);

  //   var searchObj = { 
  //     UserId: userId,
  //     isPrivate: req.query.isPrivate
  //   };

  //   // If this request is searching for a string in the comments, add it
  //   // to our search query
  //   if (req.query.text !== 'undefined') {
  //     searchObj.text = {$like: '%' + req.query.text + '%'};
  //     console.log("Comments: get - updated searchObj: ");
  //     console.log(searchObj);
  //   }

  //   Comment.get(searchObj, req.query.oldestLoadedCommentId, userId, true, req.query.url)
  //     .then(function(data) {
  //       res.send(200, {
  //         displayName: req.user.name,
  //         comments: data.rows,
  //         numComments: data.count,
  //         currentTime: new Date()
  //       });
  //     })
  //     .catch(function(err) {
  //       console.log("Comments: get comments for user error ", err);
  //       res.send(500);
  //     });
  // });


  app.get('/api/comments/id/:id', jsonParser, auth.isLoggedIn, function(req, res, next) {
    // Get individual comment
    res.send(200);
  });

  // add isAuth
  app.post('/api/comments/add', jsonParser, auth.isLoggedIn, function(req, res, next) {
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

  // app.put('/api/comments/:id', jsonParser, auth.isAuthorized, function(req, res, next) {
  //   // Updates a comment!
  // });

  // app.delete('/api/comments/:id', jsonParser, auth.isAuthorized, function(req, res, next) {
  //   // Delete a comment!
  // });
};