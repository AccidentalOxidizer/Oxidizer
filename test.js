// Require the Tape module imported from npm
var test = require('tape');

// Write your tests in the code block
test('All about Dave', function(t) {
  // The number of tests that you plan to run.
  // NOTE: If this number doesn't match up with the number
  // of tests that are run, your test will fail.
  t.plan(3);

  // Let's setup some variables to test
  var name = "Seymore";
  var city = "Oakland";
  var favBaseballTeam = "Athletics";

  // This test will check for my favorite baseball team.
  // The first parameter is the result, the second is
  // the value you're expecting, and the third is the message
  t.equal(favBaseballTeam, "Athletics", "Favorite baseball team should be Athletics");

  // This test will check for my name.
  // As you can probably assume, it will fail.
  t.equal(name, "Dave", "Name should be Dave");

  // This test will check if city has been set:
  if (city) {
    t.pass("City set");
  } else {
    t.fail("City not set");
  }
});