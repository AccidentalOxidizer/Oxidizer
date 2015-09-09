/**
 * USER AUTHENTICATION TESTS
 *
 * Currently, this test requires you to run it on your
 * localhost, since there is parameter in the user/passport.js
 * file that enables local authentication routes provided 
 * your server's environment is set to "development".
 */

// LOAD REQUIRED MODULES
var Promise = require('bluebird');
var request = Promise.promisifyAll(require('request'));

// GLOBAL SETTINGS FOR THIS PARTICULAR TEST
var testServer = 'http://localhost:3000';
var cookie; // Store cookie token from the server after test file logs in.

// Create a new user with proper credentials using LOCAL authentication
request.postAsync({
    url: testServer + '/api/auth/local',
    json: {
      name: 'Testy McTesterson',
      email: 'testUser@test.com',
      password: 'paaasssssword'
    }
  })
  .then(function(user) {
    // We've successfully created a new user or logged in as an existing user!

    // Set cookie for our newly created user
    // from response headers. We'll send this to the
    // server each time we make a new request.
    // This is what keeps our "robot" user authenticated.
    cookie = user[0].headers['set-cookie'][0];

    // LOGGING / DEBUGGING INFO
    //console.log('COOKIE: ', user[0].headers['set-cookie'][0]);
    //console.log('HEADERS: ', user[0].headers);
    //console.log('RAW HEADERS: ', user[0].rawHeaders);
    //console.log('Attempting to add a new comment');

    // Test URL: This could be any valid URL.
    var testUrl = "http://zombo.com/";

    // CREATE A NEW COMMENT!
    return request.postAsync({
      url: testServer + '/api/comments/add',
      headers: {
        'Cookie': cookie
      },
      json: {
        url: testUrl,
        text: "This is a test comment. There are many like it. But this one is mine.",
        isPrivate: false
      }
    });
  })
  .then(function(comment) {
    var commentResponse = comment[1];
    //console.log('New Comment Added!\n Comment response:\n', commentResponse);

  })
  .catch(function(err) {
    console.log(err);
  });