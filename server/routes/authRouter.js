var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var urlEncodedParser = bodyParser.urlencoded({
  extended: true
});

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
    successRedirect: '/',
    failureRedirect: '/login'
  }));

  // testing google oauth for chrome extension
  app.get('/api/auth/chrome/google', jsonParser, passport.authenticate('google'), function(req, res) {
    // req.user contains the authenticated user.
    // return json object rather than redirect anywhere
    // res.redirect('/users/' + req.user.username);
    // if req.user
    if (req.user) {
      res.status(201).send({
        data: 'ok',
        user: req.user
      });
    } else {
      res.status(401).send({
        data: 'not ok'
      });
    }
  });

  // testing google oauth for chrome extension
  app.get('/api/auth/chrome/google/callback', jsonParser, passport.authenticate('google'), function() {
    if (req.user) {
      res.status(201).send({
        data: 'ok',
        user: req.user
      });
    } else {
      res.status(401).send({
        data: 'not ok'
      });
    }
  })

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
