module.exports = function(app){
  app.get('/api/comments', function() {
    // Get list of comments
  });

  app.get('/api/comments/:id', function() {
    // Get individual comment
  });

  app.post('/api/comments', function() {
    // Add a new comment!
  });

  app.put('/api/comments/:id', function() {
    // Updates a comment!
  });

  app.delete('/api/comments/:id', function() {
    // Delete a comment!
  });
}