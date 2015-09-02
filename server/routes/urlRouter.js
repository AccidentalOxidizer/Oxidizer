var bodyParser = require('body-parser');
var auth = require('../middleware').auth;
var urlParser = require('url');
var Promise = require('bluebird');
var Url = Promise.promisifyAll(require('../components/url'));

var jsonParser = bodyParser.json();

module.exports = function(app) {
  //app.get('/api/urls', jsonParser, auth.isAuthorized, function(req, res, next) {
  app.get('/api/urls*', jsonParser, function(req, res, next) {
    // Get url info
    var url_parts = urlParser.parse(req.url, true);
    var fullPath = url_parts.query.url;

    var urlToGet = {
      path: fullPath
    };

    Url.get(urlToGet)
      .then(function(url) {
        res.send(200, url);
      });

    //res.send(200, "Should return list of all urls.");
  });

  //  app.get('/api/urls/:id', jsonParser, auth.isLoggedIn, function(req, res, next) {
  //app.get('/api/urls/:url', jsonParser, function(req, res, next) {
  /**
   * Get individual url as part of the query string.
   * NOTE: When using this method, we must first
   * ENCODE urls that get passed in as URLs using the
   * encodeURIComponent function that's built into JS.
   *
   * This escapes any URL characters that are liable to break
   * stuff. The drawback is that we need to take whatever parameter
   * is passed into the query string and decode it back to a valid URL
   * before we pass it into the database. That happens below.
   *
   * This is setup as an object since we specifically ask for a
   * search object in our URL get controller.
   */
  //   var urlToGet = {
  //     path: decodeURIComponent(req.params.url)
  //   };

  //   urlHelper.get(urlToGet)
  //     .then(function(url) {
  //       res.send(200, url);
  //     })
  // });


  //app.post('/api/urls', jsonParser, auth.isAdmin, function(req, res, next) {
  app.post('/api/urls', jsonParser, function(req, res, next) {
    /**
     * This is setup as an object since we specifically ask
     * for an object to save in our URL get controller.
     */
    var urlToSave = {
      path: req.body.url
    }

    // Encoded URL
    // The ONLY reason this is currently here is for debugging purposes so I can
    // get properly encoded URLs to search for later.
    var encodedURL = encodeURIComponent(urlToSave.path);

    // Save URL to database if it doesn't exist.
    // This method checks whether or not it's already in the database.
    urlHelper.save(urlToSave)
      .then(function(url) {
        console.log("URL ID? ", url.get('id'));
        res.send(201, "Encoded URL: " + encodedURL);
      })
      .catch(function(err) {
        res.send(403);
      });

  });

  app.put('/api/urls/:id', jsonParser, auth.isAdmin, function(req, res, next) {
    // Updates url!
  });

  //app.delete('/api/urls/:id', jsonParser, auth.isAdmin, function(req, res, next) {
  app.delete('/api/urls/:url', jsonParser, function(req, res, next) {
    // Delete a url!
    var urlToDelete = {
      path: decodeURIComponent(req.params.url)
    };

    urlHelper.remove(urlToDelete)
      .then(function(url) {
        res.send(200, "Deleted: " + urlToDelete.path);
      })
  });
}