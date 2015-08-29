var User = require('../').User;

var get = function(searchObject){
  return User.findOne({where: searchObject});
};

// 
var post = function(userObject){
  return User.findOrCreate({where: userObject})
    .spread(function(user, created){
      if (!created) {
        throw new Error('User already exists');
      } else {
        return user;
      }
    });
};

// will throw error if no 
var put = function(userObject){
  return User.update(userObject, {where: {id: userObject.id}})
    .then(function(affectedRows, usersUpdated){
      if (affectedRows === 0) {
        throw new Error('Update failed');
      } else if (affectedRows > 1) {
        throw new Error('Updated multiple records!!!', usersUpdated);
      } else {
        return usersUpdated;
      }
    })
    .catch(function(error){
      throw new Error(error);
    });  
};

var remove = function(userId){
  return User.destroy({where: {id: userId}})
    .then(function(affectedRows){
      console.log(affectedRows);
      if (affectedRows === 0){
        throw new Error('User not found - delete failed');
      } else if (affectedRows > 1) {
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


