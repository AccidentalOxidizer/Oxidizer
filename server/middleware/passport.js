var LocalStrategy = require('passport-local').Strategy;
// var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
// var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../components')['User'];

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
      usernameField: 'name',
      passwordField: 'password',
      passReqToCallback: true,
      // session: false
    }, 
    function(req, name, password, done) {
      console.log('Passport: using LocalStrategy');
      User.findOne({name: name})
        .then(function(user) {
          if (!user) {
            return done(null, false, { message: 'Invalid username.' });
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

};
