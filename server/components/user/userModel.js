var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

module.exports = function(sequelize, dataTypes) {
  return sequelize.define('User', {
    // Display Name: required, but doesn't need to be unique
    name: {
      type: dataTypes.STRING,
      allowNull: false
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

    // additional profile info here
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
    indexes: [{
      // Create a unique index on email
        unique: true,
        fields: ['name']
      }],
  });
};


