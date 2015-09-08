var Promise = require('bluebird');
var Comment = require('../').Comment;
var User = require('../').User;
var Heart = require('../').Heart;
var heartController = require('../heart');
var Flag = require('../').Flag;
var flagController = require('../flag');
var Url = require('../').Url;

// var get = function(searchObject, lastCommentId, userId) {
//   var comments; // variable so our return comments are available throughout the .then string 
//   // track if we need to check if the comments are liked by a user
//   var filterByUser = userId || false; 

//   var userHearts;
//   var userFlags;

// @param userId: userId for filtering to obtain hearts and flags
// 
// @param getTotalCount: undefined if the total count of these
// comment types is not needed.
//
// @param urlToFind: Comes from req.query.url -- set to 'undefined' if 
// not actively searching on this field.
var get = function(searchObject, lastCommentId, userId, getTotalCount, urlToFind) {
  var comments; // variable so our return comments are available throughout the .then string 
  var userHearts;
  var userFlags;
  var attributes = ['text', 'User.name', 'RepliesTo'];
  var urlQuery = {url: {$like: '%%'}};

  // Set up a url filter if needed.
  if (urlToFind !== 'undefined') {
    console.log("Comments get: filtering on url " + urlToFind);
    urlQuery = {url: {$like: '%' + urlToFind + '%'}};
  }

  var queryObject = {
    where: searchObject,
    include: [{
      model: User,
      attributes: ['name']
    }, {
      model: Heart,
      attributes: ['id']
    }, {
      model: Flag,
      attributes: ['id']
    }, {
      model: Url,
      attributes: ['url'],
      where: urlQuery
    }]
  };

  if (!(lastCommentId === 'undefined' || lastCommentId === undefined)) {
    queryObject.where.id = {};
    queryObject.where.id.$lt = lastCommentId;
  }

  if (queryObject.where.isPrivate == 0 || queryObject.where.isPrivate === 'false') {
    queryObject.where.isPrivate = false;
  } else {
    queryObject.where.isPrivate = true;
  } 

  // limit the number of comments we send to the user
  queryObject.limit = 25;

  // return in ascending order of commentid
  queryObject.order = [
    ['id', 'DESC']
  ];

  console.log('query', queryObject);

  return Comment.findAndCountAll(queryObject)
    .then(function(results) {
      console.log(results);
      comments = results.rows;

      // if there is a userId to filter by, see if they have hearted/flagged
      if (userId){
        var searchObject = {
          CommentId: {
            $lte: comments[0].id,
            $gte: comments[comments.length - 1].id
          },
        };

        return Promise.all([heartController.get(searchObject, userId), flagController.get(searchObject, userId)])
          .spread(function(hearts, flags){

            userHearts = hearts.map(function(heart){
              return heart.CommentId;
            });          

            userFlags = flags.map(function(flag){
              return flag.CommentId;
            });

            return results; 
          });
      } else {
        return getTotalCount ? results : comments; 
      }
    })
    .then(function(results){
      comments = results.rows;

      comments.forEach(function(comment, index, array) {
        if (userHearts !== undefined ) {
          comment.dataValues.heartedByUser = false;
          if(userHearts.indexOf(comment.id) > -1) {
            comment.dataValues.heartedByUser = true;
            
          }
        }

        if (userFlags !== undefined ) {
          comment.dataValues.flaggedByUser = false;
          if(userFlags.indexOf(comment.id) > -1) {
            comment.dataValues.flaggedByUser = true;
          }
        }

        // Iterate over our results array and update the number of hearts and favorites so
        // we don't return the ENTIRE array.
        comment.dataValues.Hearts = comment.dataValues.Hearts.length;
        comment.dataValues.Flags = comment.dataValues.Flags.length;
      });

      return getTotalCount ? results : comments; 
    })
    .catch(function(err) {
      console.log("Err getting comments: ", err);
    });
};

// takes an object with the following format
var post = function(commentObject) {
  var newComment = Comment.build(commentObject);
  if (newComment.repliesToId === undefined) {
    newComment.repliesToId = null;
  }
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

var countHeartsAndFlags = function(comments, userId){
  return Promise.all([Heart.get(searchObject), Flag.get(searchObject)])
    .spread(function(heartsArray, flagsArray){
      userHearts = hearts.map(function(heart){
        return heart.CommentId;
      });
      userFlags = hearts.map(function(flag){
        return flag.CommentId;
      });
      comments.forEach(function(comment, index, array) {
        comment.heart = false;
        flag.heart = false;
        if (hearts.indexOf(comment.id) > -1){
          comment.userHearted = true;
        }
        if (flag.indexOf(comment.id) > -1){
          comment.userFlagged = true;
        }
      });
    });
};

exports.get = get;
exports.post = post;
exports.put = put;
exports.remove = remove;