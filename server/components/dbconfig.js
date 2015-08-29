
var models = require('./index');
var Sequelize = require('sequelize');
var sequelize = models.sequelize;

(function(m) {
  m.Comment.belongsTo(m.User, {
    foreignKey: {
      allowNull: false
    },
    onDelete: 'cascade'
  });
  m.User.hasMany(m.Comment);

  m.Group.belongsToMany(m.User, {through: 'UserGroup'});
  m.User.belongsToMany(m.Group, {through: 'UserGroup'});

  m.Heart.belongsTo(m.User, {
    foreignKey: {
      allowNull: false
    },
    onDelete: 'cascade'
  });
  m.User.hasMany(m.Heart);

  m.Flag.belongsTo(m.User, {
    foreignKey: {
      allowNull: false
    },
    onDelete: 'cascade'
  });
  m.User.hasMany(m.Flag);

  m.Flag.belongsTo(m.Comment, {
    foreignKey: {
      allowNull: false
    },
    onDelete: 'cascade'
  });
  m.Comment.hasMany(m.Flag);

  m.Heart.belongsTo(m.Comment, {
    foreignKey: {
      allowNull: false
    },
    onDelete: 'cascade'
  });  
  m.Comment.hasMany(m.Heart);


  m.Comment.belongsTo(m.Group);
  m.Group.hasMany(m.Comment);  

  m.Comment.belongsTo(m.Url, {
    foreignKey: {
      allowNull: false
    },
    onDelete: 'cascade'
  });
  m.Url.hasMany(m.Comment);

})(models);

module.exports.Sequelize = Sequelize;
module.exports.sequelize = sequelize;

