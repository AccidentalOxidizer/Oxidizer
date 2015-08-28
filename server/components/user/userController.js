var User = require('../').User;

var get = function(userId){
  return User.findById(userId);
};

// 
var post = function(userObject){
  return User.findOrCreate({
    where: userObject
  }).then(function(user, created){
    if (!created) {
      throw new Error('User already exists');
    } else {
      return user;
    }
  });
};

var put = function(userObject){
  return User.update(userObject, {where: {id: userObject.id}})
    .then(function(affectedRows, usersUpdated){
      if (affectedRows === 0) {
        throw new Error('Update failed');
      } else if (affectedRows > 1) {
        throw new Error('Updated multiple records!!!', usersUpdated);
      } else {
        return usersUpdated[0];
      }
    })
    .catch(function(error){
      throw new Error(error);
    });  
};

var remove = function(userId){
  return User.destroy({where: {id: userId}})
    .then(function(affectedRows){
      if (affectedRows === 0){
        throw new Error('User not found - delete failed');
      } else if (affectedRows === 1) {
        throw new Error('deleted multiple users');
      } else {
        return true;
      }
    })
    .catch(function(error) {
      throw new Error(error);
    });
};


exports.get = get;
exports.post = post;
exports.put = put;
exports.remove = remove;
