module.exports = function(sequelize, id) {
  var queryString = 'SELECT id AS userId, name AS username, avatar AS userAvatar, repliesToCheck, heartsToCheck,' +
      '(SELECT COUNT(1) AS other FROM Comments WHERE Comments.UserId =' + id + ') AS numComments ' +
    'FROM Users WHERE id=' + id + ';';
    console.log(queryString);
  return sequelize.query(queryString);
};