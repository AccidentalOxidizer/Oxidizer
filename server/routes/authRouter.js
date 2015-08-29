var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

module.exports = function(app, passport) {
  app.post('/api/auth/local', jsonParser, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
  }));

  // Google Auth Routes
  app.get('/api/auth/google/', jsonParser, passport.authenticate('google', {
    scope: ['profile', 'email'] // profile: basic info including name
  }));

  app.get('/api/auth/google/callback', jsonParser, passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/login'
  }));

  // Facebook Auth Routes
  app.get('/api/auth/facebook', jsonParser, passport.authenticate('facebook', {
    scope: 'email'
  }));

  // Q: Will the below be an issue?
  // https://github.com/jaredhanson/passport-facebook
  // "Facebook's OAuth 2.0 implementation has a bug in which the fragment
  // #_=_ is appended to the callback URL."
  app.get('/api/auth/facebook/callback', jsonParser, passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/login'
  }));
}
