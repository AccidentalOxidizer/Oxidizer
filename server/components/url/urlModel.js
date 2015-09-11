var Comment = require('../').Comment;

module.exports = function(sequelize, dataTypes) {
  return sequelize.define('Url', {
    url: {
      type: dataTypes.STRING,
      unique: true,
      allowNull: false
    },
    host: {
      type: dataTypes.STRING,
      allowNull: false
    }
  }, {
    classMethods: {
      getUrls: function(host){
        var result = this.findAll({
          where: {
            host: host
          },
          attributes: ['id', 'url', [sequelize.fn('count', '*'), 'count']],
          include: [{
            model: sequelize.import(__dirname + '/' + '../comment/commentModel'),
            attributes: [[sequelize.fn('count', sequelize.col('UrlId')), 'count']]
          }],
          group: ['id']
        });
        return result;
      }
    }
  });
};

          // attributes: [[sequelize.fn('count', sequelize.col('Comment.id')), 'NumberOfComments']],
