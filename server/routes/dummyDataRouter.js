var auth = require('../middleware').auth;

module.exports = function(app) {
  app.get('/dummyData', auth.isAuthorized, function(req, res, next) {
    // populate db with dummy data
  });
};
