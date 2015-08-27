module.exports = function(req, res, next) {
  if (req.session && req.session.user) {
    next();
  }
  return false;
}
