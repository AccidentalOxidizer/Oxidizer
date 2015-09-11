var Promise = require('bluebird');
var Comment = require('../').Comment;
var User = require('../').User;
var Heart = require('../').Heart;
var heartController = require('../heart');
var Flag = require('../').Flag;
var flagController = require('../flag');
var Url = require('../').Url;

var get = function(searchObject, requesterId, lastCommentId, urlSearch, orderBy, hostSearch) {

  var userHearts;
  var userFlags;
  var userObj;
  var replyCount = {};
  var attributes = ['text', 'User.name', 'RepliesTo'];

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
    }]
  };

  if (lastCommentId !== undefined && lastCommentId !== 'undefined') {
    queryObject.where.id = {};
    queryObject.where.id.$lt = lastCommentId;
  }

  queryObject.include[3].where = {};

  if (urlSearch !== undefined) {
    console.log("Comments get: filtering on url " + urlSearch);
    queryObject.include[3].where.url = {$like: '%' + urlSearch + '%'};
  }

  if (hostSearch !== undefined) {
    console.log("Comments get: filtering on host " + hostSearch);
    queryObject.include[3].where.host = hostSearch;
  }

  // limit the number of comments we send to the user
  queryObject.limit = 25;

  // return in ascending order of commentid
  if (orderBy) {
    queryObject.order = orderBy + ' DESC';
  } else {
    queryObject.order = [
      ['id', 'DESC']
    ];
  }
  
  // return in ascending order of commentid
  return Comment.findAndCountAll(queryObject)
    .then(function(results) {
      var comments = results.rows;
      // if there is a userId to filter by, see if they have hearted/flagged

      if (requesterId && comments.length > 0){
        searchObject = {
          CommentId: {
            $lte: comments[0].id,
            $gte: comments[comments.length - 1].id
          },

        };
        // get all hearts and flags for a user within the CommentId range
        return Promise.all([heartController.get(searchObject, requesterId), flagController.get(searchObject, requesterId), Comment.findAll({where: {repliesToId: searchObject.CommentId}}), User.findOne({where: {id: requesterId}})])
          .spread(function(hearts, flags, replies, user){
            userHearts = hearts.map(function(heart){
              return heart.CommentId;
            });          
            userFlags = flags.map(function(flag){
              return flag.CommentId;
            });
            userObj = user;
            replies.forEach(function(reply) {

              if (replyCount[reply.repliesToId]) {
                replyCount[reply.repliesToId]++;
              } else {
                replyCount[reply.repliesToId] = 1;
              }
            })
            return results; 
          });
      } else {
        return results; 
      }
    })
    .then(function(results){

      var comments = results.rows;

      results.userObj = userObj;
      
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

        if (replyCount[comment.dataValues.id]){
          comment.dataValues.replies = replyCount[comment.dataValues.id];
        } else {
          comment.dataValues.replies = 0;
        }
        // Iterate over our results array and update the number of hearts and favorites so
        // we don't return the ENTIRE array.
        comment.dataValues.Hearts = comment.dataValues.Hearts.length;
        comment.dataValues.Flags = comment.dataValues.Flags.length;
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

var getUserId = function(commentId){
  return Comment.findOne({where: {id: commentId}})
    .then(function(comment){
      return comment.get('UserId');
    })
    .catch(function(err){
      console.log(err);
    });
};

exports.get = get;
exports.post = post;
exports.put = put;
exports.remove = remove;
exports.getUserId = getUserId;