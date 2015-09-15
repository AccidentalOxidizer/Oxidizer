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
    res.status(200).send({
      loggedin: 'ok'
    });
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