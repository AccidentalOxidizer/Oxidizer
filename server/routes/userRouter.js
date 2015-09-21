var bodyParser = require('body-parser');
var auth = require('../middleware').auth;
var User = require('../components/user');
var jsonParser = bodyParser.json();

module.exports = function(app) {
  app.get('/api/users/', jsonParser, function(req, res, next) {
    
    var searchObject = {};

    if (req.query) {
      searchObject = req.query;
    }

    User.getAll(searchObject)
      .then(function(users){
        res.json(users);
      })
      .catch(function(){
        res.send(404);
      });
  });

  // TODO: add isAuthorized
  app.get('/api/users/:userid', jsonParser, function(req, res, next) {
    if (req.params.userid === 'markread'){
      User.markRead(req, res, next);
    } else {
      var userId = req.params.userid;
      User.get({id: userId})
        .then(function(user){
          res.json(user);
        })
        .catch(function(){
          res.send(404);
        });
      }
  });

  // TODO: add isAuthorized
  // Adding isAdmin right now since the only person who can modify users are administrators.
  app.put('/api/users/:userid', jsonParser, auth.isAdmin, function(req, res, next) {
    // Updates user!
    var userId = req.params.userid;
    var updates = req.body;
    console.log(updates);
    User.put(userId, updates)
      .then(function(){
        res.send(200);
      })
      .catch(function(){
        res.send(403);
      });
  });

  app.delete('/api/users/:id', jsonParser, auth.isAuthorized, function(req, res, next) {
      var userId = req.params.userid;
  });

  app.get('/api/user/loggedin', jsonParser, auth.isLoggedIn, function(req, res, next) {
    res.status(200).send({user:true});
  });

  app.get('/api/user/isadmin', jsonParser, auth.isAdmin, function(req, res, next) {
    res.status(200).send({admin:true});
  });

  app.get('/api/user/notifications/markread', jsonParser, auth.isLoggedIn, User.markRead);

};
