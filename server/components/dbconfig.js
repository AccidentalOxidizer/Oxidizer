
var models = require('./index');
var Sequelize = require('sequelize');
var sequelize = models.sequelize;

(function(m) {

  // Comment has one User
  m.Comment.belongsTo(m.User, {
    foreignKey: {
      allowNull: false
    },
    onDelete: 'cascade'
  });
  m.User.hasMany(m.Comment);

  // Comment is required to have a URL
  m.Comment.belongsTo(m.Url, {
    foreignKey: {
      allowNull: false
    },
    onDelete: 'cascade'
  });
  m.Url.hasMany(m.Comment);

  // Comment can reply to one other comment
  m.Comment.belongsTo(m.Comment, {
    as: 'repliesTo', 
    foreignKey: 'repliesToId'
  });

  m.Comment.hasMany(m.Comment, {
    as: 'repliesTo',
    foreignKey: 'repliesToId'
  });

  // Heart is required to have one User
  m.Heart.belongsTo(m.User, {
    foreignKey: {
      allowNull: false
    },
    onDelete: 'cascade'
  });
  m.User.hasMany(m.Heart);


  // Heart is required to have one User
  m.Heart.belongsTo(m.Comment, {
    foreignKey: {
      allowNull: false
    },
    onDelete: 'cascade'
  });  
  m.Comment.hasMany(m.Heart);
  
  // Flag is required to have one User
  m.Flag.belongsTo(m.User, {
    foreignKey: {
      allowNull: false
    },
    onDelete: 'cascade'
  });
  m.User.hasMany(m.Flag);

  // Flag is required to have one Comment 
  m.Flag.belongsTo(m.Comment, {
    foreignKey: {
      allowNull: false
    },
    onDelete: 'cascade'
  });
  m.Comment.hasMany(m.Flag);

  // TODO: User : Group is a many to many relationship
  // m.Group.belongsToMany(m.User, {through: 'UserGroup'});
  // m.User.belongsToMany(m.Group, {through: 'UserGroup'});

  // for when we implement groups, comment will have one group
  // m.Comment.belongsTo(m.Group);
  // m.Group.hasMany(m.Comment);  
})(models);

module.exports.Sequelize = Sequelize;
module.exports.sequelize = sequelize;

