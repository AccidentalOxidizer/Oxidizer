var http = require('http');

// TEST MODULES
var tap = require('tap');
var test = require('tape');

// TO RUN TEST:
// node serverSpec.js

test('connect to server', function (t) {
    t.plan(2);

    t.equal(typeof Date.now, 'function');
    var start = Date.now();

    setTimeout(function () {
        t.equal(Date.now() - start, 100);
    }, 100);
});

test('assert a string type', function(t) {
  // Amount of assertions we plan to run.
  // will throw if count doesn't match.
  t.plan(2)

  const bar = 'foo'
  t.equal(typeof bar, 'string', 'assert `bar` type')

  const err = false
  t.ifError(err, 'should not be an error')
})