module.exports = function(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    if (req.get('Content-Type') === 'application/json') {
      res.status(401).json({
        status: 401,
        message: 'error',
        type: 'not authenticated'
      });
    } else {
      res.redirect('/login');
    }
  }
}


// TOKENS 
// var jwt = require('jsonwebtoken');

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
