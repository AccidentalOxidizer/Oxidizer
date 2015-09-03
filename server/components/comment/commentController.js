var Comment = require('../').Comment;
var User = require('../').User;
var Heart = require('../').Heart;
var Flag = require('../').Flag;

var get = function(searchObject) {
  var attributes = ['text', 'User.name'];

  return Comment.findAll({
      where: searchObject,
      // attributes: attributes,
      include: [{
        model: User,
        attributes: ['name']
      }, {
        model: Heart,
        attributes: ['id']
      }, {
        model: Flag,
        attributes: ['id']
      }]
    })
    .then(function(results) {
      //console.log("GET COMMENT RESULTS: ", results);
      // Iterate over our results array and update the number of hearts and favorites so
      // we don't return the ENTIRE array.
      results.forEach(function(element, index, array) {
        results[index].dataValues.Hearts = results[index].dataValues.Hearts.length;
        results[index].dataValues.Flags = results[index].dataValues.Flags.length;
      });

      return results;
    })
    .catch(function(err) {
      console.log("Err getting comments: ", err);
    });
};

// takes an object with the following format
var post = function(commentObject) {
  var newComment = Comment.build(commentObject);
  return newComment.save()
    .then(function(comment) {
      return comment;
    })
    .catch(function(err) {
      console.log('this is the error', err);
      throw err;
    });
};

// will throw error if no id provided
var put = function(commentid, updatesObject) {
  return Comment.update(updatesObject, {
      where: {
        id: commentid
      }
    })
    .then(function() {
      return true;
    })
    .catch(function(error) {
      throw error;
    });
};

var remove = function(commentId) {
  return Comment.destroy({
      where: {
        id: commentId
      }
    })
    .then(function(affectedRows) {
      console.log(affectedRows);
      if (affectedRows === 0) {
        throw new Error('User not found - delete failed');
      } else if (affectedRows > 1) {
        throw new Error('deleted multiple users');
      } else {
        return true;
      }
    })
    .catch(function(error) {
      throw error;
    });
};


exports.get = get;
exports.post = post;
exports.put = put;
exports.remove = remove;