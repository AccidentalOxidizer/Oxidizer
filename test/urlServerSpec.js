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
    path: 'http://ggle.com'
  };

  var fakeURL2 = {
    path: 'http://www.hackreactor.com'
  };

  var fakeURL3 = {
    path: 'https://www.codecademy.com/en/tracks/javascript'
  };

  var fakeUrls = [fakeURL1, fakeURL2, fakeURL3];

  t.plan(0);
  /** 
   * HELPER FUNCTION
   * Use this for the tests down below.
   */
  /*
  var testGetUrl = function(fakeUrl) {
    console.log("We test?");
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
      })
      .catch(function(err) {
        console.log("ERROR (48)! ", err);
      })
  };
  */

  var resultUrl;
  var testGetUrl = function(url) {
    var saveTestUrl = urlModel.build(url);
    return saveTestUrl.save()
      .then(function() {
        console.log("DATA SAVED!!!");
        Url.get(url)
          .then(function(result) {
            console.log("RESULT 63: ", result);
          })
          //return resultUrl;
      })
      .catch(function(err) {
        console.log("Awwww, error.", err);
      })
  }

  Promise.promisify(testGetUrl);
  testGetUrl(fakeURL1)
    .then(function() {
      console.log("Saved: ", resultUrl);
    })

  t.end();
  // run tests! use map so that we run the same 
  // Promise.map(fakeUrls, function(url) {
  //     console.log("We get here?");
  //     return testHelpers.testPost(Url.post, url, urlModel, t);
  //   })
  //   .then(function() {
  //     return Promise.map(fakeUrls, function(url) {
  //       testGetUrl(url);
  //     });
  //   })
  //   .catch(function(err) {
  //     console.log(err);
  //     t.end();
  //   });

});