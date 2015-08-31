var bodyParser = require('body-parser');
var auth = require('../middleware').auth;
var User = require('../components/user');
var jsonParser = bodyParser.json();

module.exports = function(app) {
  app.get('/api/users/', jsonParser, function(req, res, next) {
    console.log(User);
    User.getAll({})
      .then(function(users){
        console.log(users);
        res.json(users);
      })
      .catch(function(){
        res.send(404);
      });
  });

  // TODO: add isAuthorized
  app.get('/api/users/:userid', jsonParser, function(req, res, next) {
    var userId = req.params.userid;
    User.get({id: userId})
      .then(function(user){
        res.json(user);
      })
      .catch(function(){
        res.send(404);
      });
  });

  // TODO: add isAuthorized
  app.put('/api/users/:userid', jsonParser, function(req, res, next) {
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
};
