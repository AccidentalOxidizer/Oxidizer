var bodyParser = require('body-parser');
var auth = require('../middleware').auth;
var Promise = require('bluebird');
var urlHelper = Promise.promisifyAll(require('../components/url'));

var jsonParser = bodyParser.json();

module.exports = function(app) {
  app.get('/api/urls', jsonParser, auth.isAuthorized, function(req, res, next) {
    // Get list of urls
  });

  //  app.get('/api/urls/:id', jsonParser, auth.isLoggedIn, function(req, res, next) {
  app.get('/api/urls/:url', jsonParser, function(req, res, next) {
    // Get individual url
    var urlToGet = {
      path: decodeURIComponent(req.params.url)
    };

    urlHelper.get(urlToGet)
      .then(function(url) {
        res.send(200, url);
      })

    //console.log(urlToGet);
  });

  //app.post('/api/urls', jsonParser, auth.isAdmin, function(req, res, next) {
  app.post('/api/urls', jsonParser, function(req, res, next) {
    // Add new url!
    var urlToSave = {
      path: req.body.url
    }

    //console.log(urlToSave);

    // Encoded UR
    var encodedURL = encodeURIComponent(urlToSave.path);

    // Save URL to database if it doesn't exist.
    // This method checks whether or not it's already in the database.
    urlHelper.save(urlToSave)
      .then(function() {
        res.send(201, "Encoded URL: " + encodedURL);
      })
      .catch(function(err) {
        res.send(403);
      })

  });

  app.put('/api/urls/:id', jsonParser, auth.isAdmin, function(req, res, next) {
    // Updates url!
  });

  app.delete('/api/urls/:id', jsonParser, auth.isAdmin, function(req, res, next) {
    // Delete a url!
  });
}