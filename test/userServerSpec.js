// IMPORT REQUIRED MODULES FROM SERVER
var utils = require('../server/utils');
var User = require('../server/components/user');
var userModel = require('../server/components').User;
var Promise = require('bluebird');
var testHelpers = require('./testHelpers');
var config = require('../server/config.js').get(process.env.NODE_ENV);
var request = Promise.promisifyAll(require('request'));

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

// test('----- User Controller Methods -----\n\n', function(t) {


  // dummy info for tests
  var dummyUser1 = {
    name: 'eliotdummy',
    email: 'eliot@eliot.com',
    status: 1
  };

  var dummyUser2 = {
    name: 'davedummy',
    email: 'dave@dave.com',
    status: 1
  };
  
  var dummyUser3 = {
    name: 'matthiasdummy',
    email: 'matthias@matthias.com',
    status: 1
  };

  var dummyUser4 = {
    name: 'emilydummy',
    email: 'emily@emily.com',
    status: 1
  };  

  var dummyUser5 = {
    name: 'anotherdummy',
    email: 'another@dummy.com',
    status: 1
  };

  var dummyUser1Update = {
    name: 'eliotdummy',
    email: 'newemail@eliot.com',
    status: 2
  };  

  var dummyUser2Update = {
    name: 'davedummy',
    email: 'newemail@dave.com',
    status: 2
  };

  var dummyUser3Update = {
    name: 'matthiasdummy',
    email: 'newemail@matthias.com',
    status: 2
  };
  
  var dummyUser4Update = {
    name: 'emilydummy',
    email: 'newemail@emily.com',
    status: 2
  };
  
  var dummyUsers = [dummyUser1, dummyUser2, dummyUser3, dummyUser4];
  
  t.plan(12); // Number of tests that we plan to run
  
  // So that we don't get lost in async confusion, each test scenario will be a function. Tests run inside the function. The test function deletes any data that has been added to the database, and returns a promise. After defining all of our test functions, we call them in order (see below) 

  var testGetUser = function(dummyUser){
    var testUser = userModel.build(dummyUser);
    return testUser.save()
      .then(function(){
        return User.get(dummyUser);
      })
      .then(function(user){
        t.equal(user.name, dummyUser.name, 'successfully gets from db');
        return userModel.destroy({where: {name: dummyUser.name}});
      });

  };

  var testRemoveUser = function(){
    return User.post(dummyUser5)
      .then(function(user){
        dummyUser5.id = user.id;
        return User.remove(user.id);
      })
      .then(function(){
        return userModel.findAndCountAll({where: {id: dummyUser5.id}});
      })
      .then(function(result){
        t.equal(result.count, 0, 'User.remove deletes from db!');
      })
      .catch(function(err){
        console.log(err);
        t.end();
      });
  };

  // run tests! use map so that we run the same 
  Promise.map(dummyUsers, function(user){
    return testHelpers.testPost(User.post, user, userModel, t);
  })
    .then(function(){
      return testHelpers.testPut(User.put, dummyUser1, dummyUser1Update, userModel, t);
    })
    .then(function(){
      return Promise.map(dummyUsers, function(user){
        testGetUser(user);
      });
    })
    .spread(function(){
      return testRemoveUser();
    })
    .catch(function(err){
      console.log(err);
      t.end();
    });
});

test('----- User Servers -----\n\n', function(t) {

  t.plan(4); // Number of tests that we plan to run

  var dummyUser1 = {
    name: 'eliotdummy',
    email: 'eliot@eliot.com',
    status: 1
  };  

  var dummyUser1Update = {
    email: 'new@email.com',
    status: 1
  };



  // Create new user through POST request
  // Look for 200 response
  
  var testGetUserRoute = function(){
    var testUser = userModel.build(dummyUser1);
    return testUser.save()
      .then(function(user){
        dummyUser1.id = user.id;
        return request.getAsync(config.serverPath + '/api/users/' + user.id);
      })
      .then(function(res) {
        // Viewers at home might find the code below to be UGLY.
        // You're right. :) -Dave
        var user = JSON.parse(res[0].body);
        t.equal(res[0].statusCode, 200, 'GET request successful!');
        t.equal(user.name, dummyUser1.name, 'GET request successful!');
        return;
      })
      .then(function(){
        return userModel.destroy({where: {id: dummyUser1.id}});
      })
      .catch(function(err) {
        console.log('ERROR: ', err.code);
        userModel.destroy({where: {id: dummyUser1.id}});
      });
  };

  var testPutUserRoute = function(){
    var testUser = userModel.build(dummyUser1);
    return testUser.save()
      .then(function(user){
        dummyUser1.id = user.id;
        return request.putAsync({
          url: config.serverPath + '/api/users/' + user.id, 
          json: dummyUser1Update
        });
      })
      .then(function(res) {
        t.equal(res[0].statusCode, 200, 'PUT request responds with 200!');
        return userModel.findOne({where: {id: dummyUser1.id}});
      })
      .then(function(user){
        t.equal(user.email, dummyUser1Update.email, 'GET request successful!');
        return;
      })
      .then(function(){
        return userModel.destroy({where: {id: dummyUser1.id}});
      })
      .catch(function(err) {
        console.log('ERROR: ', err.code);
        userModel.destroy({where: {id: dummyUser1.id}});
      });
  };

  testGetUserRoute()
    .then(function(){
      testPutUserRoute();
    });

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

});