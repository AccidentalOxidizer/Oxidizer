var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

module.exports = function(app, passport) {
  app.post('/api/auth/local', jsonParser, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
  }));

  app.get('/api/auth/google', passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/login'
  }));

  app.get('/api/auth/facebook', passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/login'
  }));
}
