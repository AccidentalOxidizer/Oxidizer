var user = require('./userRouter');
var url = require('./urlRouter');
var comment = require('./commentRouter');
var error = require('./errorRouter');

module.exports = function(app) {
  //home
  app.get('/', function(req, res, next) {
    res.sendStatus(200);
  });

  // routes
  user(app);
  url(app);
  comment(app);

  // error handling
  error(app);
}
