var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
var getUserInfo = require('./getUserInfo');

module.exports = function(sequelize, dataTypes) {
  return sequelize.define('User', {
    // Display Name: required, but doesn't need to be unique
    name: {
      type: dataTypes.STRING,
      allowNull: false
    },

    // URL for user avatar
    avatar: {
      type: dataTypes.STRING,
      defaultValue : "https://raw.githubusercontent.com/daveschumaker/twittler/master/images/avatar_125px.png"
    },  

    // Use the email address as the common factor to identify
    // a given account across different types of logins
    email: {
      type: dataTypes.STRING, 
      unique: true,
      allowNull: false
    },

    // local login
    password: dataTypes.STRING,

    // google login
    googleId: {
      type: dataTypes.STRING,
      unique: true
    },
    googleToken: {
      type: dataTypes.STRING,
      unique: true
    },
    googleName: dataTypes.STRING,

    // facebook login
    fbId: {
      type: dataTypes.STRING,
      unique: true
    },
    fbToken: {
      type: dataTypes.STRING,
      unique: true
    },
    fbName: dataTypes.STRING,

    status: dataTypes.INTEGER,

    // user notifications
    repliesToCheck: {
      type: dataTypes.INTEGER,
      defaultValue: 0
    },
    heartsToCheck: {
      type: dataTypes.INTEGER,
      defaultValue: 0
    },
    flagsToCheck: {
      type: dataTypes.INTEGER,
      defaultValue: 0
    },

    lastCheckedUpdates: dataTypes.DATE,

    // additional profile info here
  }, {
    indexes: [{
      // Create a unique index on email
        unique: true,
        fields: ['email']
      }],
    classMethods: {
      getAvatar: function(id) {
        sequelize.query('SELECT avatar FROM Users WHERE id=' + id)
          .then(function(result) {
            return result;
          })
          .catch(function(err) {
            console.log(err);
          });
        }, getUserInfo: getUserInfo,
    }

  }, {
    instanceMethods: {
      generateHash: function(password) {
        var cipher = Promise.promisify(bcrypt.hash);

        return cipher(password, null, null)
          .bind(this)
          .then(function(hash) {
            this.password = hash;
          });
      },
      validPassword: function(password) {
        var compare = Promise.promisify(bcrypt.compare);

        return compare(password, this.password);
      },
    },
  });
};
