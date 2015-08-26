module.exports = function(app) {
  app.get('/api/users', function() {
    // Get list of users
  });

  app.get('/api/users/:id', function() {
    // Get individual user
  });

  app.post('/api/users', function() {
    // Add new user!
  });

  app.put('/api/users/:id', function() {
    // Updates user!
  });

  app.delete('/api/users/:id', function() {
    // Delete a user!
  });
};
