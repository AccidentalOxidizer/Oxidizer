module.exports = function(sequelize, dataTypes) {
  return sequelize.define('Group', {
    name: {
      type: dataTypes.STRING,
      unique: true,
      allowNull: false
    },
    isPrivate: {
      type: dataTypes.BOOLEAN,
      allowNull: false
    },
  });
};
