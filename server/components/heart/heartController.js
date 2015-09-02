var Heart = require('../').Heart;

// Get the number of favorites for a particular comment
// or from a particular user?
var get = function(searchObject) {
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
  console.log("FAVE OBJECT: ", searchObject);
  var newFave = Heart.build(searchObject);
  return newFave.findOrCreate({
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