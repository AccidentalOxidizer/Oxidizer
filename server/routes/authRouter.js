var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

module.exports = function(app, passport) {
  app.post('/api/auth/local', jsonParser, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
  }));

  app.get('/api/auth/google', jsonParser, passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/login'
  }));

  app.get('/api/auth/facebook', jsonParser, passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/login'
  }));
}
