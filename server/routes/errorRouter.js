module.exports = function(app) {

  // app.use(function(err, req, res, next) {
  //   console.error(err.stack);
  //   next(err);
  // })

  // 404s
  app.use(function(req, res, next) {
    res.status(404);
    res.type('txt');
    res.send("Hmmm, couldn't find that page.");
  })

  // 500
  app.use(function(err, req, res, next) {
    console.error('error at %s\n', req.url, err.stack);
    res.status(500);
    res.type('txt');
    res.send("Oops, we made a bit of a boo boo.");
  })


}
