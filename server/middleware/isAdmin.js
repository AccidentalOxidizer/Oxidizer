var User = require('../components/user');

module.exports = function(req, res, next) {

  if (req.user === undefined) {
    // res.status(403).send('<script>window.location = window.location.origin</script>');
    res.send(403);
    //res.send('<script>window.location = window.location.origin</script>');
    return;
  }

  User.get({id: req.user.id})
    .then(function(user){
      if (user.status === 10) {
        // USER IS ADMIN!
        next();
        return true;
      } else {
        // User is not an admin.
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
