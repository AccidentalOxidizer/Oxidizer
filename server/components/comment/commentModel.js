module.exports = function(sequelize, dataTypes){
  return sequelize.define('Comment', {
    text: {
      type: dataTypes.STRING,
      allowNull: false
    },
    isPrivate: {
      type: dataTypes.BOOLEAN,
      allowNull: false
    }
  });
};


