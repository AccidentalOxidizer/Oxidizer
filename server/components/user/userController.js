var User = require('../').User;
var Sequelize = require('sequelize');

var getAll = function(getSearchParams){
  var searchObject = {};
    
  if (getSearchParams.orderByRegistered) {
    searchObject.order = [['id', 'DESC']]; // Yes, we need to double brackets right here! :)
  }

  if (getSearchParams.lastUserId)   {
    searchObject.where = {id: {lte: getSearchParams.lastUserId}}; 
  }

  searchObject.limit = 25; // Limit number of search objects to 25 at a time.
  
  return User.findAll(searchObject);
};

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

  return User.update(updatesObject, {where: {id: userid}})
    .then(function(user){
      return true;
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

// add one to the new notifications fiels - second argument should be 'replies', 'hearts', or 'flags'
var incrementNotification = function(userId, stringAttribute){
  var field = stringAttribute + 'ToCheck';

  return User.findOne({where: {id: userId}})
    .then(function(user){
      user.increment(field);
      return true;
    })
    .catch(function(err){
      throw new Error(err);
    });
};

var decrementNotification = function(userId, stringAttribute){
  var field = stringAttribute + 'ToCheck';
  return User.findOne({where: {id: userId}})
    .then(function(user){
      if (user.get(field) > 0){
        user.decrement(field);
      }
      return true;
    })
    .catch(function(err){
      throw new Error(err);
    });
};

var markRead = function(req, res, next){

  return User.findOne({where: {id: req.user.id}})
    .then(function(user){
      user.updateAttributes({
        lastCheckedUpdates: Sequelize.fn('NOW'),
        repliesToCheck: 0,
        heartsToCheck: 0,
        flagsToCheck: 0,
      });

      user.save();

      res.send(200, {
        repliesToCheck: user.repliesToCheck,
        heartsToCheck: user.heartsToCheck
      });
    })
    .catch(function(){
      res.send(404);
    });
};

var getAvatar = function(id) {
  console.log('get user id for avatar: ', id);
  return User.getAvatar(id);
};

exports.get = get;
exports.getAll = getAll;
exports.getAvatar = getAvatar;
exports.post = post;
exports.put = put;
exports.remove = remove;
exports.incrementNotification = incrementNotification;
exports.decrementNotification = decrementNotification;
exports.markRead = markRead;