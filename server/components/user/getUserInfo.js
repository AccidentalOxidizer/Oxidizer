module.exports = function(sequelize, id) {
  var queryString = 
    'SELECT id AS userId, name AS username, avatar AS userAvatar, repliesToCheck, heartsToCheck ' +
    'FROM Users WHERE id=' + id + ';';
  console.log(queryString);
  return sequelize.query(queryString);
};

