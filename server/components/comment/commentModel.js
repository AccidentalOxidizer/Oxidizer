var getComments = require('./getComments');
var getNewReplies = require('./getNewReplies');
var getNewHearts = require('./getNewHearts');

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
  },{
    classMethods: {
      // returns comments with all of the fields we love
      getComments: function(options){
        return getComments(sequelize, options);
      },

      // posts comment, returns posted comment
      addComment: function(object){
        var User = sequelize.models.User;
        var Url = sequelize.models.Url;
        var Comment = sequelize.models.Comment;
        var userController = require('../user');


        return Url.findOrCreate({where: { 
            url: object.url,
            host: object.host
          }
        })
          .then(function(url) {
            var options = {
              repliesToId: object.repliesToId,
              text: object.text,
              isPrivate: object.isPrivate,
              UserId: object.UserId,
              UrlId: url[0].get('id')
            };

            return Comment.create(options);
          })
          .catch(function(err){
            console.log(err);
          });
      },

      getNewReplies: function(userid){
        return getNewReplies(sequelize, userid);
      },

      getNewHearts: function(userid){
        return getNewHearts(sequelize, userid);
      },
    },
  });
};


