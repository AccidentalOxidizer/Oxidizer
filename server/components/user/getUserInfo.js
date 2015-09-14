var sequelize = require('../').sequelize;

module.exports = function(id) {
  var queryString = 
    'SELECT id AS userId, name AS username, avatar AS userAvatar, repliesToCheck, heartsToCheck ' +
    'FROM Users WHERE id=' + id + ';';

  return queryString;
};
