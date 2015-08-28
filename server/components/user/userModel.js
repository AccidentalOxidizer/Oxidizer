module.exports = function(sequelize, dataTypes) {
  return sequelize.define('User', {
    name: {
      type: dataTypes.STRING,
      unique: true,
      allowNull: false
    },
    email: {
      type: dataTypes.STRING, 
      unique: true,
      allowNull: false
    },
    status: dataTypes.INTEGER,
    // login info here
    // additional profile info here
  }, {
    indexes: [{
      // Create a unique index on email
        unique: true,
        fields: ['name']
      }],
  });
};


