var User = require('../').User;
var Comment = require('../').Comment;
var Url = require('../').Url;

module.exports = function(sequelize, dataTypes) {
  var Heart = sequelize.define('Heart', {
    UserId: {
      type: dataTypes.INTEGER,
      allowNull: false
    },
    CommentId: {
      type: dataTypes.INTEGER,
      allowNull: false
    }
  }, {
    classMethods: {
      toggleHeart: function(){
        var faved = true;
        
      },

      // TODO:
      //  - limit the query results like other comment loads? would need
      //    to also sort the results here.
      //  x filter on isPrivate? If a user was able to fav a comment, it
      //    should either be a public comment or the user's comment
      getUserFaves: function(userId, lastCommentId) {

        var comment = {
          model: Comment,
          attributes: ['id', 'text', 'createdAt'],
          include: [{
            model: User,
            attributes: ['name']
          }, {
            model: Url,
            attributes: ['url']
          }],
        };

        if (lastCommentId !== undefined && lastCommentId !== 'undefined') {
          comment.where = {};
          comment.where.id = {};
          comment.where.id.$lt = lastCommentId;
        }

        var query = {
          where: {
            UserId: userId
          },
          include: [
            comment
          ]
        };

        // limit the number of comments we send to the user
        // XXX: should be a constant.
        query.limit = 25;

        // return in ascending order of heart id
        query.order = [
          ['id', 'DESC']
        ];

        return Heart.findAll(query)
          .then(function(result) {
            return result;
          })
          .catch(function(err) {
            console.log("Heart: getUserFaves error ", err);
          });
      }
    }
  });

  return Heart;
};
