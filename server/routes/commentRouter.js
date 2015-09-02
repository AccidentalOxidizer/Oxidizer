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
        console.log("URL: ", url);

        if (url !== null) {
          return Comment.get({
            UrlId: url.id
          });
        } else {
          console.log("Null value, homies!");
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
        console.log("COMMENTS?? ", comments);
        // TODO: Make this look like contract!
        res.send(200, {
          comments: comments,
          currentTime: '', // TODO: Fill this out!
          userInfo: {
            username: '' // TODO: Fill this out!
          }
        });
      })
      .catch(function(err) {
        console.log("Potential error: ", err);
        //res.send(200);
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