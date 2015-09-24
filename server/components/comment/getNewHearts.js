var moment = require('moment');

module.exports = function(sequelize, userid){
  var User = sequelize.models.User;

  return User.findOne({
    where: {
      id: userid
    }
  })
  .then(function(user){
    var lastChecked = moment(user.lastCheckedUpdates).format("YYYY-MM-DD HH:mm:ss"); 

    var queryString = 'SELECT DISTINCT Comments.id, Comments.UserId, Comments.text, Comments.UrlId, ' + 
      'Comments.repliesToId, Comments.isPrivate, Comments.createdAt, Hearts.createdAt as heartsCreated, Urls.url, Urls.host, Users.name AS username, Users.avatar AS userAvatar,' +
      '(SELECT COUNT(1) AS other FROM Hearts AS h WHERE Comments.id = h.CommentId GROUP BY Comments.id) AS HeartCount,' +
      '(SELECT COUNT(1) AS other FROM Comments AS c WHERE Comments.id = c.RepliesToId GROUP BY Comments.id) AS ReplyCount, ' +
      '(SELECT COUNT(1) AS other FROM Flags AS f WHERE Comments.id = f.CommentId GROUP BY Comments.id) AS FlagCount, ' +
      '(SELECT COUNT(1) AS other FROM Hearts AS h WHERE Comments.id = h.CommentId AND h.UserId = ' +  userid + ') AS HeartedByUser, ' +
      '(SELECT COUNT(1) AS other FROM Flags AS f WHERE Comments.id = f.CommentId AND f.UserId = ' +  userid + ') AS FlaggedByUser, ' +
      '(SELECT COUNT(1) AS other FROM Comments AS c WHERE Comments.id = c.RepliesToId AND c.UserId = ' +  userid + ') AS RepliesToUser, ' +
      '(CASE WHEN Comments.UserId = 1 THEN "true" ELSE NULL END) AS isUser ' +
      'FROM Comments, Urls, Users ' +
      'INNER JOIN Hearts ' +
      'WHERE Comments.UserId = ' +  userid + ' ' +
      'AND Hearts.CommentId = Comments.id ' +
      'AND Hearts.createdAt > "' + lastChecked + '" ' +
      'GROUP BY Comments.id ' +
      'ORDER BY Comments.id ;';
    
    return sequelize.query(queryString); 
  });
};