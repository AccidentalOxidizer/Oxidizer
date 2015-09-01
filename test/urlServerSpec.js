// IMPORT REQUIRED MODULES FROM SERVER
var utils = require('../server/utils');
var urlModel = require('../server/components').Url;
var Promise = require('bluebird');
var testHelpers = require('./testHelpers');
var parseUrl = require('../server/utils/parseURL.js');

// Promisify our URL library
var Url = Promise.promisifyAll(require('../server/components/url'));

// TEST MODULES
var test = require('tape');

test('----- URL Controller Methods -----\n\n', function(t) {

  // Fake data for tests
  var fakeURL1 = {
    path: 'https://www.codecademy.com/en/tracks/javascript'
  };

  t.plan(3);

  Url.save(fakeURL1)
    .then(function() {
      t.pass("Url written to database!");
      return Url.get(fakeURL1);
    })
    .then(function(url) {
      t.pass("Url found in database!");
      return Url.remove(fakeURL1.path);
    })
    .then(function(url) {
      t.pass("Url removed from database!");
      t.end();
    })
    .catch(function(err) {
      console.log("Error: ", err);
    });


});