var auth = require('../middleware').auth;
var bodyParser = require('body-parser');
var urlEncodedParser = bodyParser.urlencoded({
  extended: true
});
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
  app.get('/dummyData', urlEncodedParser, jsonParser, auth.isAuthorized, function(req, res, next) {
    res.status(200).send({
      data: 'loggedin'
    });
    // populate db with dummy data
  });

  app.get('/session', urlEncodedParser, jsonParser, function(req, res, next) {
    console.log('content type:', req.get('Content-Type'));
    console.log('accepts: ', req.accepts(['html', 'json']));
    console.log('JSON?', req.is('json'));
    console.log('HTML?', req.is('html'));
    // if (req.accepted.some(function(type) {
    //     return type.value === 'application/json';
    //   })) {
    //   console.log('json');
    // } else {
    //   //respond in html
    //   console.log('html');

    // }

    res.status(200).send({
      data: 'loggedin',
      auth: auth.isAuthorized
    });
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
