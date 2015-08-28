// IMPORT REQUIRED MODULES FROM SERVER
var utils = require('../server/utils');
var User = require('../server/components/user');
var userModel = require('../server/components').User;

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

test('----- User Controller Methods -----\n\n', function(t) {

  t.plan(4); // Number of tests that we plan to run

  // User.post(userobject) posts to the database
  var dummyUser = {
    name: 'eliot',
    email: 'eliot@eliot.com',
    status: 1
  };

  var dummyUserUpdate = {
    name: 'eliot',
    email: 'newemail@eliot.com',
    status: 2
  };

  // test User.post
  var testPostUser = function(){
    return User.post(dummyUser)
      .then(function(user){
        // save the id on the dummy for the update test
        dummyUser.id = user.id;
        return userModel.findAndCountAll(dummyUser);
      })
      .then(function(result){
        // test #1 posts to database
        t.equal(result.count, 1, 'User.post posts to db!');
        return userModel.destroy({where: {id: dummyUser.id}});
      })
      .catch(function(err){
        t.fail(err);
        t.end();
        return userModel.destroy({where: {id: dummyUser.id}});
      });
  };


  //test User.put
  var testPutUser = function(){
    return User.post(dummyUser)
      .then(function(user){
        // save the id on the dummy for the update test
        dummyUser.id = user.id;
        return User.put(dummyUserUpdate);
      })
      .then(function(){  
        return userModel.findById(dummyUser.id);
      })
      .then(function(user){
        t.equal(user.email, dummyUser.email, 'User.put updates email');
        t.equal(user.status, dummyUser.status, 'User.put updates status');
        return userModel.destroy({where: {id: user.id}});
      })
      .catch(function(err){
        console.log(err);
        return userModel.destroy({where: {id: dummyUser.id}});
      });
  };

  var testRemoveUser = function(){
    return User.post(dummyUser)
      .then(function(user){
        dummyUser.id = user.id;
        return User.remove(user.id);
      })
      .then(function(){
        return userModel.findAndCountAll({where: {id: dummyUser.id}});
      })
      .then(function(result){
        t.equal(result.count, 0, 'User.remove deletes from db!');
      })
      .catch(function(err){
        console.log(err);
        t.end();
      });
  };

  // run tests
  testPostUser()
    .then(function(){
      return testPutUser();
    })
    .then(function(){
      return testRemoveUser();
    })
    .then(function(){
      t.end();
    })
    .catch(function(err){
      console.log(err);
      t.end();
    });
});

// test('----- User Servers -----\n\n', function(t) {

//   t.plan(4); // Number of tests that we plan to run

//   // Create new user through POST request
//   // Look for 200 response

//   t.equal(200, 200, 'New user created!');

//   // Check if user exists through GET request
//   // Look for 200 response
//   t.equal(200, 200, 'User exists!');

//   // Update some user info (e.g., new email address) through PUT request
//   // Look for 201 response
//   t.equal(201, 201, 'User account updated');

//   // Delete user. We actually might not want to do this? 
//   // Or if so, make sure we delete all associated user data.
//   // Look for 410 response
//   t.equal(410, 410, 'User account deleted');

// });