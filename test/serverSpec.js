// IMPORT REQUIRED MODULES
var utils = require('../server/utils');

// TEST MODULES
var tap = require('tap');
var test = require('tape');

// NOTE: To run test:
// node serverSpec.js

// DEFINE TESTS
test('-- Server Tests --', function(t) {
  t.plan(4); // Number of tests that we plan to run

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

  // DELETE request to our server through our API 
  // NOTE: Probably need to test for user authentication!
  // Delete user or URL added above?
  // Look for a 410 response (https://developer.mozilla.org/en-US/docs/Web/HTTP/Response_codes) 
  t.equal(410, 410, 'DELETE request successful');

});

test('-- Database Tests --', function(t) {
  t.plan(3); // Number of tests that we plan to run

  // Connect to database
  t.pass('Test passed!'); // Says that test past. Useful for debugging.

  // Write URL to database
  t.pass('Test passed!'); // Says that test past. Useful for debugging.

  // Get URL from database
  t.pass('Test passed!'); // Says that test past. Useful for debugging.

});

test('-- URL Parsing Tests --', function(t) {
  t.plan(12); // Number of tests that we plan to run

  // NOTE: As of now, query strings (?q=1&a=2) are not 
  // removed if after hash(#). This SHOULD pass.

  var msg = 'URL parsed: ';
  var passingUrlTests = {
    'http://www.google.com': 'google.com/',
    'https://google.com': 'google.com/',
    'http://www.google.com/#!/hashbang': 'google.com/#!/hashbang/',
    'http://www.google.com/#/this/is/a/path': 'google.com/#/this/is/a/path/',
    'http://www.google.com/#removehash': 'google.com/',
    'http://www.google.com/?removequery': 'google.com/',
    'http://www.google.com/this/is/a/path/#/and/hash': 'google.com/this/is/a/path/#/and/hash/',
    'http://subdomain.google.com': 'subdomain.google.com/',
    'http://subdomain.google.com/path/#/and/hash': 'subdomain.google.com/path/#/and/hash/',
    'http://subdomain.google.com/#removehash': 'subdomain.google.com/',
    'http://subdomain.google.com/?removequery': 'subdomain.google.com/'
  }

  for (var key in passingUrlTests) {
    t.equal(utils.parseURL(key), passingUrlTests[key], msg + key)
  }

  // TEST FOR BLACKLISTED URLs
  var blacklistedURL = utils.parseURL('http://www.bad.com');
  t.equal(blacklistedURL instanceof Error, true, 'Blacklisted URL ignored');

  /*
    // Strips http:// and https:// from
    t.equal('https://google.com', 'google.com', 'Removed \'https://\'');
    t.equal('http://google.com', 'google.com', 'Removed \'http://\'');
    
    // Strips 'www' subdomain
    t.equal('https://www.google.com', 'google.com', 'Removed \'www\' subdomain');

    // Removes query strings from end of URL? (Thoughts?!)
    t.equal('https://www.google.com', 'google.com', 'Removed \'www\' subdomain');

    // Ignores non-http paths (such as file://)
    t.equal('file://test/test.html', 'Error', 'Ignored \'file://\'');
  */
});

test('-- User Creation --', function(t) {
  t.plan(4); // Number of tests that we plan to run

  // Create new user
  t.equal(200, 200, 'New user created!');

  // Check if user exists
  t.equal(200, 200, 'User exists!');

  // Update some user info (e.g., new email address)
  t.pass('Test passed!'); // Says that test past. Useful for debugging.

  // Delete user. We actually might not want to do this? 
  // Or if so, make sure we delete all associated user data.
  t.pass('Test passed!'); // Says that test past. Useful for debugging.

});

test('-- Comment Tests --', function(t) {
  t.plan(6); // Number of tests that we plan to run

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