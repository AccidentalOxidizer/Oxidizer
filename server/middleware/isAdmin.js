var User = require('../components/user');

module.exports = function(req, res, next) {

  if (req.user === undefined) {
    res.send(403);
    return;
  }

  User.get({id: req.user.id})
    .then(function(user){
      if (user.status === 10) {
        // USER IS ADMIN!
        next();
        return;
      } else {
        // User is not an admin.
        // Get out of here, you dirty scoundrel.
        res.send(403);
        return;
      }
    })
    .catch(function(){
      res.send(404);
      return;
    });

  //return false;
};
