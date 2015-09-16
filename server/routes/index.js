var auth = require('./authRouter');
var user = require('./userRouter');
var url = require('./urlRouter');
var comment = require('./commentRouter');
var group = require('./groupRouter');
var error = require('./errorRouter');
var bodyParser = require('body-parser');
var dummy = require('./dummyDataRouter');
var stress = require('./stressTestRouter');

var urlEncodedParser = bodyParser.urlencoded({
  extended: true
});
var jsonParser = bodyParser.json();


module.exports = function(express, app, passport) {

  app.use(express.static(__dirname + '/../../client/'));

  app.get('/welcome', urlEncodedParser, jsonParser, function(req,res, next){
    //console.log(req);
    
    // Determine where the user is logging in from.
    // referer undefined = Chrome extension.
    console.log('TEST REFERRER: ', req.headers['referer']);

    if (req.headers['referer'] === undefined) {
      // This should pass in a script that will automatically close the popup window
      // created by the Chrome extension.
      res.status(200).send('<script>window.close();</script>');
    } else {
      // Attempting to do a relative JavaScript redirect here.
      res.status(200).send('<script>window.location = "/#/profile/";</script>'); 
    }
  });

  // routes
  auth(app, passport);
  user(app);
  url(app);
  comment(app);
  group(app);
  dummy(app);
  stress(app);
  // error handling
  error(app);

  //home
  app.get('/', urlEncodedParser, function(req, res, next) {
    console.log(req.isAuthenticated());
    res.sendStatus(200);
  });
};