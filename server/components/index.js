var Sequelize = require('sequelize');
var config = require('../config').get().dbconfig;

var sequelize = new Sequelize( config.name, config.username, config.password);

var models = {
  'User': 'user/userModel',
  'Url': 'url/urlModel',
  'Comment': 'comment/commentModel',
  'Group': 'group/groupModel',
  'Heart': 'heart/heartModel',
  'Flag': 'flag/flagModel'
};

for (var k in models) {
  module.exports[k] = sequelize.import(__dirname + '/' + models[k]);
}

module.exports.sequelize = sequelize
