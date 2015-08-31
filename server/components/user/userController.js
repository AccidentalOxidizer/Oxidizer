var User = require('../').User;

var get = function(searchObject){
  return User.findOne({where: searchObject});
};

// 
var post = function(userObject){
  return User.findOrCreate({where: userObject})
    .spread(function(user, created){
      if (!created) {
        throw new Error('Error posting to db');
      } else {
        return user;
      }
    });
};

// will throw error if no id provided
var put = function(userid, updatesObject){
  console.log(updatesObject);
  return User.update(updatesObject, {where: {id: userid}})
    .then(function(user){
      console.log('................');
      return true;
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


