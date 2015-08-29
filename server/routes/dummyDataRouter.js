var auth = require('../middleware').auth;
var bodyParser = require('body-parser');

var jsonParser = bodyParser.json();

module.exports = function(app) {
  app.get('/dummyData', auth.isAuthorized, function(req, res, next) {
    // populate db with dummy data
  });

  app.post('/test/comments', jsonParser, function(req, res, next) {
    res.sendStatus(201);
    console.log(req.body);
  });

  app.get('/test/comments', jsonParser, function(req, res, next) {
    res.status(200).send({
      test: 'test'
    });
  });
};
