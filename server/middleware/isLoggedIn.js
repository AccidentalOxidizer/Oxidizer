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
      res.redirect('/');
    }
  }
};
