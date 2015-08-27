var user = require('./userRouter');
var url = require('./urlRouter');
var comment = require('./commentRouter');

module.exports = function(app){
  user(app);
  url(app);
  comment(app);
}
