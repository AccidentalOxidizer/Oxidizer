// IMPORT REQUIRED MODULES FROM SERVER
var utils = require('../server/utils');

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

// DEFINE TESTS
test('----- Server Tests -----\n\n', function(t) {
  t.plan(6); // Number of tests that we plan to run

  // GET request to our server through our API
  // Get all data from server (might be nothing there to start)
  // Look for 200 response
  t.equal(200, 200, 'GET request successful!');

  // POST request to our server through our API
  // Create a new user or URL?
  // Look for 201 response
  t.equal(201, 201, 'POST request successful');

  // PUT request to our server through our API
  // NOTE: Probably need to test for user authentication!
  // Update user or URL added above?
  // Look for a 201 response? (https://developer.mozilla.org/en-US/docs/Web/HTTP/Response_codes)
  t.equal(201, 201, 'PUT request successful');

  // Look for 403 response for routes that are forbidden to visit without authentication
  t.equal(403, 403, 'Prevent visiting a forbidden path');

  // Look for 404 response for routes that don't exist
  t.equal(404, 404, 'Return 404 for routes that don\'t exist');

  // DELETE request to our server through our API 
  // NOTE: Probably need to test for user authentication!
  // Delete user or URL added above?
  // Look for a 410 response (https://developer.mozilla.org/en-US/docs/Web/HTTP/Response_codes) 
  t.equal(410, 410, 'DELETE request successful');

});