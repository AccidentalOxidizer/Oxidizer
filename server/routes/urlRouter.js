module.exports = function(app) {
  app.get('/api/urls', function() {
    // Get list of urls
  });

  app.get('/api/urls/:id', function() {
    // Get individual url
  });

  app.post('/api/urls', function() {
    // Add new url!
  });

  app.put('/api/urls/:id', function() {
    // Updates url!
  });

  app.delete('/api/urls/:id', function() {
    // Delete a url!
  });
}
