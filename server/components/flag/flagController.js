var Flag = require('../').Flag;

// Get the number of flags for a particular comment
// or from a particular user?
var get = function(searchObject) {
  return Flag.findAll({
      where: searchObject
    })
    .then(function(result) {
      console.log(result);
      return result;
    })
    .catch(function(err) {
      console.log("Flag error: ", err);
      return;
    });
};

var flag = function(searchObject) {

  //First: Search
  // if a flag for this particular user and comment combination already exists.
  console.log('SEARCHING: ', searchObject);
  return Flag.findOne({
      where: searchObject
    })
    .then(function(result) {
      // Check if the result is null. 
      // If so, this means the user hasn't flagged this item before.
      if (result === null) {
        console.log('No existing flags for this user and comment have been found. Creating new flag.');
        var newFlag = Flag.build(searchObject);
        return newFlag.save();
      } else {
        // User has already flagged this item before. Let's remove the flag!
        console.log('Flagged result already found. Removing existing result.');
        return Flag.destroy({
          where: searchObject
        });
      }
    })
    .then(function() {
      //console.log(searchObject.CommentId);
      var getCount = get({
        CommentId: searchObject.CommentId
      });

      if (getCount[0].dataValues === undefined) {
        getCount = 0;
      } else {
        getCount = getCount[0].dataValues.length;
      }

      console.log('COUNT!!!!: ', getCount);
    })
    .catch(function(err) {
      console.log("Flag error: ", err);
      return;
    });



  // console.log("FLAG OBJECT: ", searchObject);
  // var newFlag = Flag.build(searchObject);
  // return Flag.findOrCreate({
  //     where: searchObject
  //   })
  //   .then(function(flag) {
  //     return get({
  //       CommentId: searchObject.CommentId
  //     });
  //   })
  //   .then(function(flags) {
  //     // NUMBER OF FAVORITES!
  //     console.log("GET FLAGS: ", flags.length);
  //     return flags.length;
  //   })
  //   .catch(function(err) {
  //     console.log('this is the error', err);
  //     throw err;
  //   });
};

exports.get = get;
exports.flag = flag;