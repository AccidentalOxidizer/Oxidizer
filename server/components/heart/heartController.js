var Heart = require('../').Heart;

// Get the number of favorites for a particular comment
// or from a particular user?
var get = function(searchObject, userId) {
  // TODO: Rewrite this function to check if a flag exists with
  // current logged in user ID and URL ID. If so, we have 2 options:
  // DELETE the flag! (Unset it) or ADD a flag (set it). This allows us
  // to toggle flags and make sure a user can't create multiple flags.
  if (userId !== undefined){
    searchObject.UserId = userId;
  }

  return Heart.findAll({
      where: searchObject
    })
    .then(function(result) {
      console.log('grwreqfsfdsfdsa', result, searchObject);
      return result;
    })
    .catch(function(err) {
      console.log("HEART error: ", err);
      return;
    });
};

var fave = function(searchObject) {
  //First: Search
  // if a fave for this particular user and comment combination already exists.
  return Heart.findOne({
      where: searchObject
    })
    .then(function(result) {
      // Check if the result is null. 
      // If so, this means the user hasn't fave this item before.
      if (result === null) {
        console.log('No existing faves for this user and comment have been found. Creating new fave.');
        var newHeart = Heart.build(searchObject);
        return newHeart.save();
      } else {
        // User has already faved this item before. Let's remove the fave!
        console.log('Faved result already found. Removing existing result.');
        return Heart.destroy({
          where: searchObject
        });
      }
    })
    .then(function() {
      //console.log(searchObject.CommentId);
      return Heart.findAndCountAll({
        where: {
          CommentId: searchObject.CommentId
        }
      });
    })
    .then(function(result) {
      // Return total number of faves found for this comment.
      console.log('GET TOTAL FAVE COUNT!!!!: ', result.count);
      return result.count;
    })
    .catch(function(err) {
      console.log("Fave error: ", err);
      return;
    });

};

// get({ CommentId: { '$lte': 14, '$gte': 10}, UserId: 1})
//   .then(function(result){
//     console.log(result);

//   })
//   .catch(function(err){
//     throw err;
//   });

exports.get = get;
exports.fave = fave;