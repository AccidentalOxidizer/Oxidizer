var userAuth = require('./userAuth');
var testServer = 'http://localhost:3000';


// TESTS ROUTE: api/router
userAuth()
  .then(function(authedUser){
    var user = authed();

     return request.postAsync({
      url: testServer + '/api/comments/add',
      headers: {
        'Cookie': cookie,
        'etag': etag
      },
      json: {
        url: testUrl,
        text: "This is a test comment. There are many like it. But this one is mine.",
        isPrivate: false
      }
    });
  })
  .catch(function(err){
    console.log(err);
  });