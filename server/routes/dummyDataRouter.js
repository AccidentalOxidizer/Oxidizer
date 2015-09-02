var auth = require('../middleware').auth;
var bodyParser = require('body-parser');

var jsonParser = bodyParser.json();

var dummyData = {
  comments: [{
    id: 1,
    id_user: 1,
    id_url: 1,
    timestamp: '2015-08-27 13:59:59',
    text: "Hack Reactor is so awesome, woooo yeah dawg boy!",
    privacy: false,
    id_groups: 0
  }, {
    id: 2,
    id_user: 1,
    id_url: 1,
    timestamp: '2015-08-27 14:59:59',
    text: "Hack Reactor is so awesome, woooo yeah dawg boy!",
    privacy: false,
    id_groups: 0
  }]
};

module.exports = function(app) {
  app.get('/dummyData', auth.isAuthorized, function(req, res, next) {
    // populate db with dummy data
  });

  app.post('/test/comments', jsonParser, function(req, res, next) {
    console.log(req.body);
    dummyData.comments.push(req.body);
    console.log(dummyData);

    if (!req.user) {
      console.log('not logged in');
      res.status(401).send({
        data: 'error'
      });
    } else {
      res.status(201).send({
        data: 'ok'
      });
    }

  });

  app.get('/test/auth', auth.isLoggedIn, function(req, res, next) {
    console.log('auth testing route for chrome extension');
    res.status(200).send({
      auth: 'ok'
    });
  });

  app.get('/test/comments', jsonParser, function(req, res, next) {
    if (req.user) {
      dummyData.name = req.user.name;
    }
    res.status(200).send(dummyData);
  });
};
