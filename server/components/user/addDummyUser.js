var User = require('./index');

var alphabet = "abcdefeghjiklmnopqrstuvwxyz";

for (var i = 0; i < alphabet.length; i++) {
  var currentLetter = alphabet[i];
  User.post({
    name: currentLetter,
    email: currentLetter + '@' + currentLetter,
    password: currentLetter
  });
}