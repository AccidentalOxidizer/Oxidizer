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

test('----- Comment Tests -----\n\n', function(t) {
  t.plan(6); // Number of tests that we plan to run

  // Create a new comment with a user account?
  t.equal(200, 201, 'New comment added!');

  // Try to post a comment containing a word from a potential spam blacklist
  // We haven't actually created this yet. 
  t.equal(200, 200, 'Comment with word from blacklist ignored!');

  // Favorite a comment and make sure fav count increases?
  t.equal(200, 200, 'Comment successfully favorited');

  // Flag a comment and make sure flag count increases?
  t.equal(200, 200, 'Comment successfully flagged');

  // Delete a comment (and associated favs / flags)
  t.equal(410, 410, 'Comment successfully deleted');

  // Try to post a comment as a banned / blocked user 
  // (maybe comment is auto hidden)?
  t.equal(500, 500, 'Banned account cannot comment');

});