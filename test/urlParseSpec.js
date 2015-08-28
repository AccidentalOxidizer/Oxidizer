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

test('----- URL Parsing Tests -----\n\n', function(t) {
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