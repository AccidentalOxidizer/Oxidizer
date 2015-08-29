var Comment = require('../').Comment;

var get = function(searchObject){
  return Comment.findAll({where: searchObject});
};

// takes an object with the following format
var post = function(commentObject){
  var newComment = Comment.build(commentObject);
  return newComment.save() 
    .then(function(comment){
      return comment;
    })
    .catch(function(err){
      throw err;
    });
};

// will throw error if no id provided
var put = function(commentid, updatesObject){
  return Comment.update(updatesObject, {where: {id: commentid}})
    .then(function(){
      return true;
    })
    .catch(function(error){
      throw new Error(error);
    });  
};

var remove = function(commentId){
  return Comment.destroy({where: {id: commentId}})
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


