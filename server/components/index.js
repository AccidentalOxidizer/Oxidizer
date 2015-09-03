var Sequelize = require('sequelize');

// this is horrible and needs to change.
if (process.env.NODE_ENV === 'production') {
  var config = require('../config').get().mysql;
  var sequelize = new Sequelize(config.url + 'rust');
} else {
  var config = require('../config').get().dbconfig;
  var sequelize = new Sequelize(config.name, config.username, config.password, {
    // disable logging; default: console.log
    logging: false
  });
}


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
      allowNull: false
    },
    onDelete: 'cascade'
  });
  m.User.hasMany(m.Comment);

  m.Group.belongsToMany(m.User, {
    through: 'UserGroup'
  });
  m.User.belongsToMany(m.Group, {
    through: 'UserGroup'
  });

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

})(module.exports);

module.exports.Sequelize = Sequelize;
module.exports.sequelize = sequelize;
