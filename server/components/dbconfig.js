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
// , {foreignKey: {allowNull: false}
(function(m) {
  m.Comment.belongsTo(m.User, {foreignKey: {
    field: 'userId',
    allowNull: false
  });
  m.User.hasMany(m.Comment);

  // m.Group.hasMany(m.User);
  // m.User.hasMany(m.Group);

  // m.Heart.belongsTo(m.User);
  // m.User.hasMany(m.Heart);

  // m.Flag.belongsTo(m.User);
  // m.User.hasMany(m.Flag);

  // m.Flag.belongsTo(m.Comment);
  // m.Comment.hasMany(m.Flag);

  // m.Heart.belongsTo(m.Comment);  
  // m.Comment.hasMany(m.Heart);

  // m.Comment.belongsTo(m.Url);
  // m.Url.hasMany(m.Comment);

  // m.Comment.belongsTo(m.Group);
  // m.Group.hasMany(m.Comment);  

  for (var k in m){

    m[k].sync();
  }

})(module.exports);


