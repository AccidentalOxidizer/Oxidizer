/* TEST USER AUTHENTICATION */
//var utils = require('../server/utils');
//var Comment = require('../server/components/comment');
//var commentModel = require('../server/components').Comment;
//var userModel = require('../server/components').User;
//var urlModel = require('../server/components').Url;
var Promise = require('bluebird');
var request = Promise.promisifyAll(require('request'));
//var config = require('../server/config.js').get(process.env.NODE_ENV);
//var session = require('express-session');

//var cookieJar = request.jar();
//console.log('COOOOOOKIE!', cookieJar);
var testServer = 'http://localhost:3000';
var cookie;

// Create a new user with proper credentials using LOCAL authentication
request.postAsync({
    url: testServer + '/api/auth/local',
    method: 'POST',
    json: {
      email: 'testUser@test.com',
      password: 'paaasssssword'
    }
  })
  .then(function(user) {
    cookie = user[0].headers['set-cookie'][0]
    console.log('COOKIE: ', user[0].headers['set-cookie'][0]);
    console.log('HEADERS: ', user[0].headers);
    console.log('RAW HEADERS: ', user[0].rawHeaders);
    console.log('Attempting to add a new comment');

    // Let's create a new comment somewhere!
    var testUrl = "http://zombo.com/";
    request.postAsync({
        url: testServer + '/api/comments/add',
        method: 'POST',
        headers: {
          'Cookie': cookie
        },
        json: {
          url: testUrl,
          text: "This is a test comment. There are many like it. But this one is mine.",
          isPrivate: false
        }
      }, function(err, res) {
        //console.log(err);
        //console.log(res);
      })
      .then(function(url, res) {
        //console.log(url);
      })
      .catch(function(err) {
        console.log(err);
      });
  });

// request.post(testServer + '/api/auth/local', {
//   form: {
//     email: 'testUser@test.com',
//     password: 'something'
//   }
// }, function(err, res, body) {
//   console.log(err);
//   console.log(res);
//   console.log(body);
// });

// })
// .then(function(user) {
//   console.log(user);
// })
// .catch(function(err) {
//   console.log('Err:', err);
// });

//console.log(config);