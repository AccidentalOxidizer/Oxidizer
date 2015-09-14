var getComments = require('./getComments');

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
      // This method grabs all comments sorted by flags.
      // This is a great example of how class methods work in Sequelize.
      // Just call Comment.sortFlags() and an object will be returned. 
      sortFlags: function() {
        var query = "SELECT Comments.id AS id, Comments.text, Comments.createdAt AS createdAt, Comments.isPrivate AS isPrivate, " +
                    "Users.id AS UserId, Users.name, " + 
                    "(SELECT COUNT(1) FROM Flags AS f " +
                    "where Comments.id = f.CommentId GROUP BY CommentId) AS Flags, " +
                    "Comments.urlid AS UrlId" + 
                    "(SELECT COUNT(1) FROM Hearts AS h " +
                    "where Comments.id = h.CommentId GROUP BY CommentId) AS Hearts, " +                    
                    "urls.id AS UrlId, (SELECT url FROM Urls " +
                    "where urls.id = Comments.urlid) AS Url " +
                    "FROM Comments" +
                    "INNER JOIN Users " +
                    "ON Comments.UserId = Users.id " +
                    "ORDER BY flags DESC LIMIT 20";
      
        sequelize.query(query)
          .then(function(results) {
            //console.log('test', results);
            return results;
          });
      },

      getComments: function(options){
        return getComments(sequelize, options);
      },

      addComment: function(object){
        var User = sequelize.models.User;
        var Url = sequelize.models.Url;
        var Comment = sequelize.models.Comment;

        console.log(object);
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
              UrlId: url[0].get('id'),
            };

            return Comment.create(options);
          })
          .catch(function(err){
            console.log(err);
          });
      }
    },
  });
};


