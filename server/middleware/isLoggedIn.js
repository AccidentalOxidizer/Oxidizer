// TOKENS 
var jwt = require('jsonwebtoken');
var config = require('../config.js').get(process.env.NODE_ENV);

module.exports = function(req, res, next) {

  // if using passport + sessions:
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/');
  }

  // Implementation when using tokens:
  // var token = req.body.token || req.query.token || req.headers['x-access-token'] || undefined;
  // // todo here: verify token!
  // jwt.verify(token, config.secret, function(err, decoded) {
  //   if (err) {
  //     // maybe we need res.json / res.send here ..
  //     return false;
  //   }
  //   req.decoded = decoded;
  //   next();
  // });

}
