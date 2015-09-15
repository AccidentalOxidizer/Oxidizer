var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var urlEncodedParser = bodyParser.urlencoded({
  extended: true
});
var auth = require('../middleware').auth;


module.exports = function(app, passport) {
  app.post('/api/auth/local', jsonParser, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
  }));

  // Google Auth Routes
  // Requires Google+ API to get profile information.
  app.get('/api/auth/google/', jsonParser, passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/plus.login',
      'https://www.googleapis.com/auth/plus.profile.emails.read'
    ]
  }));

  app.get('/api/auth/google/callback', urlEncodedParser, passport.authenticate('google', {
    successRedirect: '/welcome',
    failureRedirect: '/login'
  }));

  // google oauth for chrome extension (we should have own IDs for this maybe)
  app.get('/api/auth/chrome/google', jsonParser, passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/plus.login',
      'https://www.googleapis.com/auth/plus.profile.emails.read'
    ]
  }));

  // Facebook Auth Routes
  app.get('/api/auth/facebook', urlEncodedParser, jsonParser, passport.authenticate('facebook', {
    scope: 'email'
  }));

  // Q: Will the below be an issue?
  // https://github.com/jaredhanson/passport-facebook
  // "Facebook's OAuth 2.0 implementation has a bug in which the fragment
  // #_=_ is appended to the callback URL."
  app.get('/api/auth/facebook/callback', urlEncodedParser, jsonParser, passport.authenticate('facebook', {
    successRedirect: '/welcome',
    failureRedirect: '/login'
  }));

  // Facebook Auth Route for chrome extension
  app.get('/api/auth/chrome/facebook', jsonParser, passport.authenticate('facebook', {
    scope: 'email'
  }));


  // Logout Routes
  app.get('/api/auth/logout', auth.isLoggedIn, function(req, res, next) {
    req.logout();
    req.session.destroy();
    console.log('Session & User after logout: ', req.session, req.user);

    res.redirect('/');
  });

  app.get('/api/auth/chrome/logout', function(req, res, next) {
    //console.log(req.session, req.user);
    req.logOut();
    req.logout();
    req.session.destroy();
    console.log('Session & User after logout: ', req.session, req.user);

    // what's our cookie name?
    // res.clearCookie('cookiename')
    res.status(200).send({
      auth: 'terminated'
    });
  });

};
