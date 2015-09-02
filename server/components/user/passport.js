var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
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
      User.findOne({
          email: email
        })
        .then(function(user) {
          if (!user) {
            return done(null, false, {
              message: 'Invalid email address.'
            });
          }
          // found user -> check if password is correct
          if (!user.validPassword(password)) {
            return done(null, false, {
              message: 'Invalid password.'
            });
          }
          // success! return valid user
          console.log("LocalStrategy: found valid user");
          return done(null, user);
        })
        .catch(function(err) {
          return done(err);
        });
    }));

  // Google OAuth
  passport.use('google', new GoogleStrategy({
      clientID: config.googleAuth.clientId,
      clientSecret: config.googleAuth.clientSecret,
      callbackURL: config.googleAuth.callbackUrl
    },
    function(accessToken, refreshToken, profile, done) {
      console.log('Passport: using GoogleStrategy');

      var email = profile.emails[0].value;

      // We will potentially allow a user to link more than one social
      // account for authentication and authorization with the email
      // address being the common field
      User.findOne({
          email: email
        })
        .then(function(user) {
          if (user) {
            console.log("GoogleStrategy: found valid user with email " + email);

            // If the Google data hasn't been set up yet, we have a case in
            // which we need to link the info to an existing user.
            if (!user.googleId) {
              console.log("GoogleStrategy: updating user with id " + profile.id);
              user.googleId = profile.id;
              user.googleToken = accessToken;
              user.googleName = profile.displayName;
              return user.save()
                .then(function(){
                  return done(null, user);
                });
            } else {
              return done(null, user);
            }
          } else {
            // if the user wasn't already in the db, create a new entry
            console.log("GoogleStrategy: creating new user " + email);
            var newUser = User.build({
              name: profile.displayName,
              email: email,
              googleId: profile.id,
              googleToken: accessToken,
              googleName: profile.displayName
            });

            return newUser.save()
              .then(function(user) {
                return done(null, user);
              });
          }        
        })
        .catch(function(err) {
          console.log('danger will robinson', err);
          done(err);
        });
    }));

  // Facebook OAuth
  passport.use('facebook', new FacebookStrategy({
      clientID: config.facebookAuth.clientId,
      clientSecret: config.facebookAuth.clientSecret,
      callbackURL: config.facebookAuth.callbackUrl,
      profileFields: ['emails', 'id', 'displayName']
    },
    function(accessToken, refreshToken, profile, done) {
      console.log('Passport: using FacebookStrategy');

      var email = profile.emails[0].value;

      User.findOne({email: email})
        .then(function(user) {
          if (user) {
            console.log("FacebookStrategy: found valid user with email " + email);

            // If the fb data hasn't been set up yet, we have a case in
            // which we need to link fb info to an existing user.
            if (!user.fbId) {
              console.log("FacebookStrategy: updating user with id " + profile.id);
              user.fbId = profile.id;
              user.fbToken = accessToken;
              user.fbName = profile.displayName;
              return user.save()
                .then(function(){
                  return done(null, user);
                });
            } else {
              return done(null, user);
            }
          } else {

            // if the user wasn't already in the db, create a new entry
            console.log("FacebookStrategy: creating new user " + email);
            var newUser = User.build({
              name: profile.displayName,
              email: email,
              fbId: profile.id,
              fbToken: accessToken,
              fbName: profile.displayName
            });

            return newUser.save()
              .then(function(){
                return done(null, user);
              });
          }
        })
        .catch(function(err) {
          return done(err);
        });
    })
  );

};
