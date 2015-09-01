module.exports = function(sequelize, dataTypes) {
  return sequelize.define('Url', {
    url: {
      type: dataTypes.STRING,
      unique: true,
      allowNull: false
    }
  });
};