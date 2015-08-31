var bodyParser = require('body-parser');
var auth = require('../middleware').auth;
var url = require('../components/url');

var jsonParser = bodyParser.json();

module.exports = function(app) {
  app.get('/api/urls', jsonParser, auth.isAuthorized, function(req, res, next) {
    // Get list of urls
  });

  app.get('/api/urls/:id', jsonParser, auth.isLoggedIn, function(req, res, next) {
    // Get individual url
  });

  //app.post('/api/urls', jsonParser, auth.isAdmin, function(req, res, next) {
  app.post('/api/urls', jsonParser, function(req, res, next) {
    // Add new url!
    var urlToSave = req.body.url;
    console.log(urlToSave);


    res.send('Hahaha');
  });

  app.put('/api/urls/:id', jsonParser, auth.isAdmin, function(req, res, next) {
    // Updates url!
  });

  app.delete('/api/urls/:id', jsonParser, auth.isAdmin, function(req, res, next) {
    // Delete a url!
  });
}