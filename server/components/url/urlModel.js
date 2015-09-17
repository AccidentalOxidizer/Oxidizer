module.exports = function(sequelize, dataTypes) {
  var Comment = sequelize.import(__dirname + '/' + '../comment/commentModel');
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
            model: Comment,
            attributes: [[sequelize.fn('count', sequelize.col('UrlId')), 'count']]
          }],
          group: ['id']
        });
        return result;
      }
    },
    getAllUrls: function(){
      return this.findAll().map(function(url){
        return url.get('host');
      });
    }
  });
};

          // attributes: [[sequelize.fn('count', sequelize.col('Comment.id')), 'NumberOfComments']],
