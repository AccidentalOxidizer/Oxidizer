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

(function(m) {
  m.Comment.belongsTo(m.User, {
    foreignKey: {
      field: 'userId',
      allowNull: false
    },
    onDelete: 'cascade'
  });
  m.User.hasMany(m.Comment);

  m.Group.belongsToMany(m.User, {through: 'UserGroup'});
  m.User.belongsToMany(m.Group, {through: 'UserGroup'});

  m.Heart.belongsTo(m.User, {
    foreignKey: {
      field: 'userId',
      allowNull: false
    },
    onDelete: 'cascade'
  });
  m.User.hasMany(m.Heart);

  m.Flag.belongsTo(m.User, {
    foreignKey: {
      field: 'userId',
      allowNull: false
    },
    onDelete: 'cascade'
  });
  m.User.hasMany(m.Flag);

  m.Flag.belongsTo(m.Comment, {
    foreignKey: {
      field: 'commentId',
      allowNull: false
    },
    onDelete: 'cascade'
  });
  m.Comment.hasMany(m.Flag);

  m.Heart.belongsTo(m.Comment, {
    foreignKey: {
      field: 'commentId',
      allowNull: false
    },
    onDelete: 'cascade'
  });  
  m.Comment.hasMany(m.Heart);


  m.Comment.belongsTo(m.Group);
  m.Group.hasMany(m.Comment);  

  m.Comment.belongsTo(m.Url, {
    foreignKey: {
      field: 'urlId',
      allowNull: false
    },
    onDelete: 'cascade'
  });
  m.Url.hasMany(m.Comment);

  // for (var k in m){
  //   m[k].sync();
  // }

  sequelize.sync();

})(module.exports);

// urls, users, groups, comments, flags, hearts, UserGroup
