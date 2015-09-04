var auth = require('./authRouter');
var user = require('./userRouter');
var url = require('./urlRouter');
var comment = require('./commentRouter');
var group = require('./groupRouter');
var error = require('./errorRouter');
var bodyParser = require('body-parser');
var dummy = require('./dummyDataRouter');

var urlEncodedParser = bodyParser.urlencoded({
  extended: true
});

module.exports = function(app, passport) {
  // setup route for development only
  // to enable run: NODE_ENV='development' node server/app.js
  if (process.env.NODE_ENV === 'development') {
    app.get('/setup', urlEncodedParser, function(req, res, next) {
      // to populate with dummy data
      res.sendStatus(200);
    });
  }

  // routes
  auth(app, passport);
  user(app);
  url(app);
  comment(app);
  group(app);
  dummy(app);

  // error handling
  error(app);

  //home
  app.get('/', urlEncodedParser, function(req, res, next) {
    console.log(req.isAuthenticated());
    res.sendStatus(200);
  });
};