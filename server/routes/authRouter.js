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

  // google oauth for chrome extension (we should have own IDs for this maybe)
  app.get('/api/auth/chrome/google', urlEncodedParser, jsonParser, passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/plus.login',
      'https://www.googleapis.com/auth/plus.profile.emails.read'
    ]
  }));

  // google oauth for chrome extension callback url (does not work without new google id for this..)
  app.get('/api/auth/chrome/google/callback', urlEncodedParser, jsonParser, passport.authenticate('google'), function() {
    console.log('here: /api/auth/chrome/google/callback');
    if (req.user) {
      res.status(201).send({
        data: 'seems ok',
        user: req.user
      });
    } else {
      res.status(401).send({
        data: 'not ok'
      });
    }
  });

  // route to logout user from chrome extension
  app.get('/api/auth/chrome/logout', function(req, res, next) {
    console.log(req.sesison, req.user);
    req.logOut();
    req.logout();
    req.session.destroy();
    console.log('Sesison & User after logout: ', req.sesison, req.user);

    // what's our cookie name?
    // res.clearCookie('cookiename')
    res.status(200).send({
      auth: 'terminated'
    });
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
