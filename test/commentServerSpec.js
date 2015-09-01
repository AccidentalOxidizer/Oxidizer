// IMPORT REQUIRED MODULES FROM SERVER
var utils = require('../server/utils');
var Comment = require('../server/components/comment');
var commentModel = require('../server/components').Comment;
var userModel = require('../server/components').User;
var urlModel = require('../server/components').Url;
var Promise = require('bluebird');
var testHelpers = require('./testHelpers');
var request = Promise.promisifyAll(require('request'));
var config = require('../server/config.js').get(process.env.NODE_ENV);
var session = require('express-session');

// TEST MODULES
var test = require('tape');

/**
 *  USAGE:
 *
 * t.plan(num) is the number of assertions you plan to look for in any given test.
 * If you add new assertions to a test, you must update this number, otherwise TAPE
 * will fail.
 *
 * To check if you're getting the expected result from a particular function, you 
 * can use t.equal() with the following parameters: t.equal(actual, excepted, msg)
 *
 * To test a helper function, for example, something called "isTrue(val)", you can
 * pass it into the 'actual' parameter and compare it's output to the 'expected'
 * parameter like so:
 * 
 * t.equal(isTrue(true), true, 'Expect isTrue(true) to return true');
 *
 * To run this test file from the root folder:
 * node test/serverSpec.js
 */

// test('----- Comment Controller Tests -----\n\n', function(t) {
//   t.plan(4); // Number of tests that we plan to run

//   var dummyUser = {
//     name: 'eliotdummy',
//     email: 'eliot@eliot.com',
//     status: 1
//   };
  
//   var dummyUrl = {
//     path: 'www.rustedserverwfunnycomments.io'
//   };

//   var dummyComment = {
//     text: 'funny comment about the web',
//     isPrivate: false
//   };

//   // save a user and url concurrently so that we can create a comment
//   var testCommentPost = function(dummyComment, t){
//     var testUserId;
//     var testUrlId;
    
//     var testUser = userModel.build(dummyUser);
//     var testUrl = urlModel.build(dummyUrl);

//     return Promise.all([testUser.save(), testUrl.save()])
//       .then(function(data){
//         testUserId = testUser.get('id');
//         testUrlId = testUrl.get('id');
        
//         var dummyCommentCopy = {
//           text: dummyComment.text,
//           isPrivate: dummyComment.isPrivate,
//           UserId: testUser.get('id'),
//           UrlId: testUrl.get('id')
//         };

//         return testHelpers.testPost(Comment.post, dummyCommentCopy, commentModel, t);
//       })
//       // cleanup everything
//       .then(function(){
//         return Promise.all([
//           userModel.destroy({where: {id: testUserId}}),
//           urlModel.destroy({where: {id: testUrlId}})
//         ])
//         .catch(function(err){

//           throw err;
//         });
//       })
//       .catch(function(err){        
//         userModel.destroy({where: {id: testUserId}});
//         urlModel.destroy({where: {id: testUrlId}});
//         throw err;
//       });
//   };
  
//   var testPutComment = function(dummyComment, t){
//     var testUserId;
//     var testUrlId;
    
//     var testUser = userModel.build(dummyUser);
//     var testUrl = urlModel.build(dummyUrl);

//     return Promise.all([testUser.save(), testUrl.save()])
//       .then(function(data){
//         testUserId = testUser.get('id');
//         testUrlId = testUrl.get('id');
        
//         var dummyCommentCopy = {
//           text: dummyComment.text,
//           isPrivate: dummyComment.isPrivate,
//           UserId: testUserId,
//           UrlId: testUrlId
//         };

//         var dummyCommentUpdate = {
//           isPrivate: true
//         };

//         return testHelpers.testPut(Comment.put, dummyCommentCopy, dummyCommentUpdate, commentModel, t);
//       })
//       // cleanup everything
//       .then(function(){
//         return Promise.all([
//           userModel.destroy({where: {id: testUserId}}),
//           urlModel.destroy({where: {id: testUrlId}})
//         ])
//         .catch(function(err){

//           throw err;
//         });
//       })
//       .catch(function(err){        
//         userModel.destroy({where: {id: testUserId}});
//         urlModel.destroy({where: {id: testUrlId}});
//         throw err;
//       });
//   };

//   var testGetComment = function(t){
//     var testUserId;
//     var testUrlId;
    
//     var testUser = userModel.build(dummyUser);
//     var testUrl = urlModel.build(dummyUrl);

//     return Promise.all([testUser.save(), testUrl.save()])
//       .then(function(data){
//         testUserId = testUser.get('id');
//         testUrlId = testUrl.get('id');
        
//         var dummyCommentCopy = {
//           text: dummyComment.text,
//           isPrivate: dummyComment.isPrivate,
//           UserId: testUser.get('id'),
//           UrlId: testUrl.get('id')
//         };

//         var newComment = commentModel.build(dummyCommentCopy);
//         return newComment.save();
//       })
//       .then(function(commentInstance){
//         return Comment.get(commentInstance);
//       })
//       .then(function(comments){
//         t.equal(comments.length, 1, 'get returns an object');
//       })
//       .then(function(){
//         return Promise.all([
//           userModel.destroy({where: {id: testUserId}}),
//           urlModel.destroy({where: {id: testUrlId}})
//         ])
//         .catch(function(err){
//           throw err;
//         });
//       })
//       .catch(function(err){        
//         userModel.destroy({where: {id: testUserId}});
//         urlModel.destroy({where: {id: testUrlId}});
//         throw err;
//       });
//   };

//   var testRemoveComment = function(){
//     var testUserId;
//     var testUrlId;
//     var testCommentId;
//     var testUser = userModel.build(dummyUser);
//     var testUrl = urlModel.build(dummyUrl);

//     return Promise.all([testUser.save(), testUrl.save()])
//       .then(function(data){
//         testUserId = testUser.get('id');
//         testUrlId = testUrl.get('id');
        
//         var dummyCommentCopy = {
//           text: dummyComment.text,
//           isPrivate: dummyComment.isPrivate,
//           UserId: testUser.get('id'),
//           UrlId: testUrl.get('id')
//         };

//         var newComment = commentModel.build(dummyCommentCopy);
//         return newComment.save();
//       })
//       .then(function(comment){
//         testCommentId = comment.get('id');
//         return Comment.remove(testCommentId);
//       })
//       .then(function(){
//         return commentModel.findAll({where: {id: testCommentId}});
//       })
//       .then(function(comment){
//         return t.equal(comment.length, 0, 'deletes a comment');
//       })
//       .then(function(){
//         return Promise.all([
//           userModel.destroy({where: {id: testUserId}}),
//           urlModel.destroy({where: {id: testUrlId}})
//         ])
//         .catch(function(err){

//           throw err;
//         });
//       })
//       .catch(function(err){        
//         userModel.destroy({where: {id: testUserId}});
//         urlModel.destroy({where: {id: testUrlId}});
//         throw err;
//       });
//   };

//   testCommentPost(dummyComment, t)  
//     .then(function(){
//       return testPutComment(dummyComment, t);
//     })
//     .then(function(){
//       return testGetComment(t);
//     })
//     .then(function(){
//       return testRemoveComment(t);
//     })
//     .catch(function(err){
//       throw err;
//     });
// });

test('----- Comment Router Tests -----\n\n', function(t) {
  t.plan(6); // Number of tests that we plan to run

  var dummyUser = {
    name: 'eliotdummy',
    email: 'eliot@eliot.com',
    status: 1
  };
  
  var dummyUrl = {
    url: 'http://www.rustedserverwfunnycomments.io'
  };

  var dummyComment = {
    text: 'funny comment about the web',
    isPrivate: false
  };

  var testCommentPostRequest = function(){
    var testUserId;
    var testUrlId;
    var testCommentId;
    
    var testUser = userModel.build(dummyUser);
    var testUrl = urlModel.build(dummyUrl);
    var dummyCommentCopy;

    return Promise.all([testUser.save(), testUrl.save()])
      .spread(function(testUser, testUrl){
        testUserId = testUser.get('id');
        testUrlId = testUrl.get('id');
        
        dummyCommentCopy = {
          text: dummyComment.text,
          isPrivate: dummyComment.isPrivate,
          url: testUrl.get('url'),
          user: {
            id: testUser.get('id'),
            name: testUser.get('name')
          }
        };
        var req = request.postAsync({
          url: config.serverPath + '/api/comments/', 
          json: dummyCommentCopy,
          session: testUserId
        });

        req = true;

        return req;
      })
      .then(function(data){
        var attributes = ['text','user.id', 'user.name'];
        testCommentId = 'somehting';

        return commentModel.findAll({
          where: {id: data.id},
          include: [userModel],
          attributes: attributes
        });
      })
      .then(function(data){
        t.equal(data.text, dummyCommentCopy.text, 'comment text posts');
        t.equal(data.user.name, dummyCommentCopy.text, 'comment text posts');

        userModel.destroy({where: {id: testUserId}});
        urlModel.destroy({where: {id: testUrlId}});
        commentModel.destroy({where: {id: testCommentId}});
      })
      .catch(function(err){
        userModel.destroy({where: {id: testUserId}});
        urlModel.destroy({where: {id: testUrlId}});
        commentModel.destroy({where: {id: testCommentId}});
        throw err;
      });
  };

  // testCommentPostRequest()
  //   .then(function(data){
  //     console.log('postRequest success');
  //   })
  //   .catch(function(err){
  //     throw err;
  //   });

  // // Create a new comment with a user account?
  // t.equal(200, 200, 'New comment added!');

  // // Try to post a comment containing a word from a potential spam blacklist
  // // We haven't actually created this yet. 
  // t.equal(200, 200, 'Comment with word from blacklist ignored!');

  // // Favorite a comment and make sure fav count increases?
  // t.equal(200, 200, 'Comment successfully favorited');

  // // Flag a comment and make sure flag count increases?
  // t.equal(200, 200, 'Comment successfully flagged');

  // // Delete a comment (and associated favs / flags)
  // t.equal(410, 410, 'Comment successfully deleted');

  // // Try to post a comment as a banned / blocked user 
  // // (maybe comment is auto hidden)?
  // t.equal(500, 500, 'Banned account cannot comment');

});