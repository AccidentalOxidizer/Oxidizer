var config = require('../../config').get().dbconfig;
var Sequelize = require('sequelize');
var sequelize = new Sequelize( config.name, config.username, config.password);

var Group = sequelize.define('Group', {
  name: {
    type: Sequelize.STRING,
    unique: true
  },
  privacy: Sequelize.BOOLEAN,
});
Group.hasMany(Comment, {as: 'Comments'});

module.exports = Group;
