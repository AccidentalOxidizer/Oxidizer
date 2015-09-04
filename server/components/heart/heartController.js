var Heart = require('../').Heart;

// Get the number of favorites for a particular comment
// or from a particular user?
var get = function(searchObject) {
  // TODO: Rewrite this function to check if a flag exists with
  // current logged in user ID and URL ID. If so, we have 2 options:
  // DELETE the flag! (Unset it) or ADD a flag (set it). This allows us
  // to toggle flags and make sure a user can't create multiple flags.
  return Heart.findAll({
      where: searchObject
    })
    .then(function(result) {
      //console.log(result);
      return result;
    })
    .catch(function(err) {
      console.log("HEART error: ", err);
      return;
    });
};

var fave = function(searchObject) {
  //console.log("FAVE OBJECT: ", searchObject);
  //var newFave = Heart.build(searchObject);
  return Heart.findOrCreate({
      where: searchObject
    })
    .then(function(favorite) {
      return get({
        CommentId: searchObject.CommentId
      });
    })
    .then(function(faves) {
      // NUMBER OF FAVORITES!
      console.log("GET FAVES: ", faves.length);
      return faves.length;
    })
    .catch(function(err) {
      console.log('this is the error', err);
      throw err;
    });
};

exports.get = get;
exports.fave = fave;