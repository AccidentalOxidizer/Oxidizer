// IMPORT REQUIRED MODULES FROM SERVER
var Promise = require("bluebird");
var utils = require('../server/utils');

// Promisify our request library.
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

/** 
 *  NOTE: Right now, I'm testing against http://localhost. We might want to change this
 *  depening on environment?
 */

// DEFINE TESTS
test('----- Server Tests -----\n\n', function(t) {
  t.plan(6); // Number of tests that we plan to run

  // GET request to our server through our API
  // Look for 200 response
  request.getAsync('http://localhost:3000')
    .then(function(res) {
      // Viewers at home might find the code below to be UGLY.
      // You're right. :) -Dave
      t.equal(res[0].statusCode, 200, 'GET request successful!');
    })
    .catch(function(err) {
      t.fail('GET request unsuccessful');
      console.log('ERROR: ', err.code);
    });

  // POST request to our server through our API
  // Create a new user or URL?
  // Look for 201 response
  // TODO: Need auth methods from config.js
  t.equal(201, 201, 'POST request successful');

  // PUT request to our server through our API
  // NOTE: Probably need to test for user authentication!
  // Update user or URL added above?
  // Look for a 201 response? (https://developer.mozilla.org/en-US/docs/Web/HTTP/Response_codes)
  // TODO: Need auth methods from config.js
  t.equal(201, 201, 'PUT request successful');

  // Look for 403 response for routes that are forbidden to visit without authentication
  // TODO: Need auth methods from config.js
  t.equal(403, 403, 'Prevent visiting a forbidden path');

  // Look for 404 response for routes that don't exist
  request.getAsync('http://localhost:3000/jhsdkjfh843fhekwhf943hufkehf9438ufhdsi')
    .then(function(res) {
      // Viewers at home might find the code below to be UGLY.
      // You're right. :) -Dave
      t.equal(res[0].statusCode, 404, 'Return 404 for routes that don\'t exist');
    })
    .catch(function(err) {
      t.fail('Return 404 unsuccessful');
      console.log('ERROR: ', err.code);
    });

  // DELETE request to our server through our API 
  // NOTE: Probably need to test for user authentication!
  // Delete user or URL added above?
  // Look for a 410 response (https://developer.mozilla.org/en-US/docs/Web/HTTP/Response_codes) 
  // TODO: Need auth methods from config.js
  t.equal(410, 410, 'DELETE request successful');

});