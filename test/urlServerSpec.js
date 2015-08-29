// IMPORT REQUIRED MODULES FROM SERVER
var utils = require('../server/utils');
var Url = require('../server/components/url');
var urlModel = require('../server/components').Url;
var Promise = require('bluebird');
var testHelpers = require('./testHelpers');

// TEST MODULES
var test = require('tape');

test('----- URL Controller Methods -----\n\n', function(t) {

  // Fake data for tests
  var fakeURL1 = {
    url: 'http://google.com'
  };

  var fakeURL2 = {
    url: 'http://www.hackreactor.com'
  };

  var fakeURL3 = {
    url: 'https://www.codecademy.com/en/tracks/javascript'
  };

  t.plan(3);

  /** 
   * HELPER FUNCTION
   * Use this for the tests down below.
   */
  var testGetUser = function(fakeUrl) {
    var testUrl = urlModel.build(fakeUrl);
    return testUrl.save()
      .then(function() {
        return Url.get(fakeUrl);
      })
      .then(function(url) {
        t.equal(url.path, fakeUrl.url, 'successfully gets from db');
        return urlModel.destroy({
          where: {
            path: fakeUrl.url
          }
        });
      });
  };

  // run tests! use map so that we run the same 
  Promise.map(fakeURL1, function(url) {
      return testHelpers.testPost(Url.post, url, urlModel, t);
    })
    .then(function() {
      return Promise.map(fakeURL1, function(url) {
        testGetUrl(url);
      });
    })
    .spread(function() {
      //return testRemoveUser();
    })
    .catch(function(err) {
      console.log(err);
      t.end();
    });

})