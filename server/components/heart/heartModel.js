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

      // TODO:
      //  - limit the query results like other comment loads? would need
      //    to also sort the results here.
      //  x filter on isPrivate? If a user was able to fav a comment, it
      //    should either be a public comment or the user's comment
      getUserFaves: function(userId) {
        return Heart.findAll({
          where: {
            UserId: userId
          },
          include: [{
            model: Comment,
            attributes: ['id', 'text', 'createdAt'],
            include: [{
              model: User,
              attributes: ['name']
            }, {
              model: Url,
              attributes: ['url']
            }]
          }]
        })
          .then(function(result) {
            // console.log("Heart: getUserFaves result ", result);
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
