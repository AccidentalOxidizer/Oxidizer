var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
// var FacebookStrategy = require('passport-facebook').Strategy;
var config = require('../../config.js').get(process.env.NODE_ENV);
var User = require('../index')['User'];

module.exports = function(passport, config) {
  // Using sessions for now -> req serialization support
  // Probably will switch to tokens later.
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id).then(function(user) {
      return done(null, user);
    }).catch(function(err) {
      return done(err);
    });
  });


  // Local Strategy
  passport.use('local', new LocalStrategy({
      usernameField: 'email', 
      passwordField: 'password',
      passReqToCallback: true,
      // session: false
    }, 
    function(req, email, password, done) {
      console.log('Passport: using LocalStrategy');

      User.findOne({email: email})
        .then(function(user) {
          if (!user) {
            return done(null, false, { message: 'Invalid email address.' });
          }
          // found user -> check if password is correct
          if (!user.validPassword(password)) {
            return done(null, false, { message: 'Invalid password.' });
          }
          // success! return valid user
          console.log("LocalStrategy: found valid user");
          console.log(user);
          return done(null, user);
        })
        .catch(function(err) {
          return done(err);
        });
    })
  );

  // Google OAuth
  passport.use('google', new GoogleStrategy({
      clientID: config.googleAuth.clientId,
      clientSecret: config.googleAuth.clientSecret,
      callbackURL: config.googleAuth.callbackUrl
    },
    function(accessToken, refreshToken, profile, done) {
      console.log('Passport: using GoogleStrategy');
      console.log(profile);

      var email = profile.emails[0].value;

      // We will potentially allow a user to link more than one social
      // account for authentication and authorization with the email
      // address being the common field
      User.findOne({email: email})
        .then(function(user) {
          if (user) {
            console.log("GoogleStrategy: found valid user with id: " + profile.id);
            console.log(user);
            return done(null, user);
          }

          // if the user wasn't already in the db, create a new entry
          console.log("GoogleStrategy: creating new user " + email);
          var newUser = User.build({
            name: profile.displayName,
            email: email,
            googleId: profile.id,
            googleToken: accessToken,
            googleName: profile.displayName
          });

          return newUser.save();
        })
        .then(function(user) {
          return done(null, user);
        })
        .catch(function(err) {
          return done(err);
        });
    })
  );

};
