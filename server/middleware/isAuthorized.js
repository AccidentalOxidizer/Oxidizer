var User = require('../components/user');

module.exports = function(req, res, next) {
  // check if user is himself?

  if (req.user === undefined) {
    res.send(403);
    return;
  }

  // Make sure user isn't banned (status === -1), otherwise, they can move on!
  User.get({id: req.user.id})
    .then(function(user){
      if (user.status >= 0) {
        // USER IS VALID!
        next();
        return true;
      } else {
        // User is not a valid.
        // Get out of here, you dirty scoundrel.
        res.send(403);
        return false;
      }
    })
    .catch(function(){
      res.send(404);
      return false;
    });
};
