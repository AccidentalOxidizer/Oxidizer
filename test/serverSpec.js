// IMPORT REQUIRED MODULES
var utils = require('../server/utils');

// TEST MODULES
var tap = require('tap');
var test = require('tape');

// TO RUN TEST:
// node serverSpec.js

// DEFINE TESTS
test('-- Server Tests --', function (t) {
    t.plan(4);  // Number of tests that we plan to run

    // GET request to our server through our API
      // Get all data from server (might be nothing there to start)
      // Look for 200 response
    t.pass('Test passed!'); // Says that test past. Useful for debugging.

    // POST request to our server through our API
      // Create a new user or URL?
      // Look for 201 response
    t.pass('Test passed!'); // Says that test past. Useful for debugging.
    
    // PUT request to our server through our API
      // Update user or URL added above?
      // Look for a 201 response? (https://developer.mozilla.org/en-US/docs/Web/HTTP/Response_codes)
    t.pass('Test passed!'); // Says that test past. Useful for debugging.
    
    // DELETE request to our server through our API 
      // Delete user or URL added above?
      // Look for a 410 response (https://developer.mozilla.org/en-US/docs/Web/HTTP/Response_codes) 
    t.pass('Test passed!'); // Says that test past. Useful for debugging.

});

test('-- Database Tests --', function (t) {
  t.plan(3);

  // Connect to database
  t.pass('Test passed!'); // Says that test past. Useful for debugging.
  
  // Write URL to database
  t.pass('Test passed!'); // Says that test past. Useful for debugging.
  
  // Get URL from database
  t.pass('Test passed!'); // Says that test past. Useful for debugging.

});

test('-- URL Parsing Tests --', function (t) {
  t.plan(4);

  utils.parseURL('')

  // Strips http:// and https:// from
  t.pass('Test passed!'); // Says that test past. Useful for debugging.
  
  // Strips 'www' subdomain
  t.pass('Test passed!'); // Says that test past. Useful for debugging.

  // Removes query strings from end of URL? (Thoughts?!)
  t.pass('Test passed!'); // Says that test past. Useful for debugging.
  
  // Ignores non-http paths (such as file://)
  t.pass('Test passed!'); // Says that test past. Useful for debugging.
  
});

test('-- User Creation --', function (t) {
  t.plan(4);

  // Create new user
  t.pass('Test passed!'); // Says that test past. Useful for debugging.
  
  // Check if user exists
  t.pass('Test passed!'); // Says that test past. Useful for debugging.
  
  // Update some user info (e.g., new email address)
  t.pass('Test passed!'); // Says that test past. Useful for debugging.
  
  // Delete user. We actually might not want to do this? 
    // Or if so, make sure we delete all associated user data.
  t.pass('Test passed!'); // Says that test past. Useful for debugging.

});

test('-- Comment Tests --', function (t) {
  t.plan(6);

  // Create a new comment with a user account?
  t.pass('Test passed!'); // Says that test past. Useful for debugging.

  // Try to post a comment containing a word from a potential spam blacklist
    // We haven't actually created this yet. 
  t.pass('Test passed!'); // Says that test past. Useful for debugging.

  // Favorite a comment and make sure fav count increases?
  t.pass('Test passed!'); // Says that test past. Useful for debugging.
  
  // Flag a comment and make sure flag count increases?
  t.pass('Test passed!'); // Says that test past. Useful for debugging.
  
  // Delete a comment (and associated favs / flags)
  t.pass('Test passed!'); // Says that test past. Useful for debugging.
  
  // Try to post a comment as a banned / blocked user (maybe comment is auto hidden)?
  t.pass('Test passed!'); // Says that test past. Useful for debugging.

});


// test('assert a string type', function (t) {
//   // Amount of assertions we plan to run.
//   // will throw if count doesn't match.
//   t.plan(2)

//   const bar = 'foo'
   t.equal(typeof bar, 'string', 'assert `bar` type')

//   const err = false
//   t.ifError(err, 'should not be an error')
// });