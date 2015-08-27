var config = require('../../config').get().dbconfig;
var Sequelize = require('sequelize');
var sequelize = new Sequelize( config.name, config.username, config.password);

var User = sequelize.define('User', {
  name: {
    type: Sequelize.STRING,
    unique: true
  },
  email: {
    type: Sequelize.STRING, 
    unique: true
  },
  status: Sequelize.NUMBER,
  // login info here
  // additional profile info here
}, {
  indexes: [
    // Create a unique index on email
    {
      unique: true,
      fields: ['name']
    }],
});

User.hasMany(Comment, {as: 'Comments'});

module.exports = User;


