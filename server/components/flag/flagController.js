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
  console.log("FLAG OBJECT: ", searchObject);
  var newFlag = Flag.build(searchObject);
  return newFlag.save()
    .then(function(flag) {
      return flag;
    })
    .catch(function(err) {
      console.log('this is the error', err);
      throw err;
    });
};

exports.get = get;
exports.flag = flag;