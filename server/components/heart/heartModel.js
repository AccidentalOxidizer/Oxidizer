module.exports = function(sequelize, dataTypes) {
  return sequelize.define('Heart', {
    UserId: {
      type: dataTypes.INTEGER,
      allowNull: false
    },
    CommentId: {
      type: dataTypes.INTEGER,
      allowNull: false
    }
  });
};