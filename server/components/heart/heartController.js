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
      //console.log('HEART GET line 14: ', result);
      return result;
    })
    .catch(function(err) {
      console.log("HEART error: ", err);
      return;
    });
};

var fave = function(searchObject) {
  // Note: This needs to be findAll() instead of findOne(), because
  // findAll() returns an array of things that we can count (whether 0, 1, or 1000);
  Heart.findAll({
      where: searchObject
    })
    .then(function(result) {
      if (result.length === 0) {
        // No result found, let's go ahead and face it!
        console.log("No faves found. Adding new favs!");
        var newFave = Heart.build(searchObject);
        return newFave.save();
      } else {
        // Hey, this punk already had a favorite for
        // this item. Let's delete it!
        console.log('Fave already found. Removing!');
        return Heart.destroy({
          where: searchObject
        });
      }
    })
    .then(function(result) {
      // After we've either added or removed something from the database,
      // let's get the TOTAL count of favorites so we can properly update
      // the client side of things.
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

  //console.log('FIND ONE: ', result);
  //console.log('HOW MANY RESULTS? ', result.length);

  // return Heart.findOrCreate({
  //     where: searchObject
  //   })
  //   .then(function(favorite) {
  //     return get({
  //       CommentId: searchObject.CommentId
  //     });
  //   })
  //   .then(function(faves) {
  //     // NUMBER OF FAVORITES!
  //     console.log("GET FAVES: ", faves.length);
  //     return faves.length;
  //   })
  //   .catch(function(err) {
  //     console.log('this is the error', err);
  //     throw err;
  //   });
};

exports.get = get;
exports.fave = fave;