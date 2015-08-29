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
  
  t.plan(dummyUsers.length); // Number of tests that we plan to run
  
  // So that we don't get lost in async confusion, each test scenario will be a function. Tests run inside the function. The test function deletes any data that has been added to the database, and returns a promise. After defining all of our test functions, we call them in order (see below) 

  // tests User.post in user controller
  var testPostUser = function(){
        console.log('hey');
    
    // helper function so we can use Promise.all to test multiple users  
    var postUser = function(dummyUser){
      return User.post(dummyUser)
        .then(function(user){
          // save the id on the dummy so that we can l
          dummyUser.id = user.id;
          // checks if the user was added using a sequelize method
          return userModel.findAndCountAll(dummyUser);
        })
        .then(function(result){
          // check if findAndCountAll returned the one record we added
          t.equal(result.count, 1, 'User.post posted ' + dummyUser +' to db!');
        });
      };
    
    return Promise.all(dummyUsers, function(user){
        return postUser(user);
      })
      .then(function(userArray){
        // clean up - remove the data we posted in our test  
        return Promise.all(userArray, function(user){userModel.destroy({where: {id: user.id}});
        });
      })
      .catch(function(err){
        console.log(err, ' deleting users');
        Promise.all(dummyUsers, function(user){
          userModel.destroy({where: {name: user.id}});
        })
        .then(function(){
          console.log('users deleted');
          return Promise();
        })
        .catch(function(err){
          console.log(err, ' unable to delete users...');
        });
      });
  };

  //test User.put
  var testPutUser = function(){
    return User.post(dummyUser1)
      .then(function(user){
        // save the id on the dummy for the update test
        dummyUser1.id = user.id;
        return User.put(dummyUser1Update);
      })
      .then(function(){  
        return userModel.findById(dummyUser1.id);
      })
      .then(function(user){
        t.equal(user.email, dummyUser1.email, 'User.put updates email');
        t.equal(user.status, dummyUser1.status, 'User.put updates status');
        return userModel.destroy({where: {id: user.id}});
      })
      .catch(function(err){
        console.log(err);
        return userModel.destroy({where: {id: dummyUser1.id}});
      });
  };

  var testRemoveUser = function(){
    return User.post(dummyUser1)
      .then(function(user){
        dummyUser1.id = user.id;
        return User.remove(user.id);
      })
      .then(function(){
        return userModel.findAndCountAll({where: {id: dummyUser1.id}});
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
    // .then(function(){
    //   return testPutUser();
    // })
    // .then(function(){
    //   return testRemoveUser();
    // })
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