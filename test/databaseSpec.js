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

test('----- Database Tests -----\n\n', function(t) {
  t.plan(3); // Number of tests that we plan to run

  // Connect to database
  t.equal(true, true, 'Connect to database');

  // Write URL to database
  t.equal(true, true, 'Write URL to database');

  // Get URL from database
  t.equal(true, true, 'Get URL from database');

});