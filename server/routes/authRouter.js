var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var urlEncodedParser = bodyParser.urlencoded({ extended: true });

module.exports = function(app, passport) {
  app.post('/api/auth/local', jsonParser, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
  }));

  // Google Auth Routes
  // Requires Google+ API to get profile information.
  app.get('/api/auth/google/', jsonParser, passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/plus.login',
    'https://www.googleapis.com/auth/plus.profile.emails.read']
  }));

  app.get('/api/auth/google/callback', urlEncodedParser, passport.authenticate('google', {
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
  app.get('/api/auth/facebook/callback', urlEncodedParser, passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/login'
  }));
}
