module.exports = function(sequelize, dataTypes) {
  return sequelize.define('Url', {
    path: {
      type: dataTypes.STRING,
      unique: true,
      allowNull: false
    }
  });
};