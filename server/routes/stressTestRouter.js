var bodyParser = require('body-parser');
var urlEncodedParser = bodyParser.urlencoded({
  extended: true
});
var jsonParser = bodyParser.json();
var urlParser = require('url');
var Promise = require('bluebird');
var Url = Promise.promisifyAll(require('../components/url'));
// var xssFilters = require('xss-filters');
var Heart = Promise.promisifyAll(require('../components/heart'));
var Flag = Promise.promisifyAll(require('../components/flag'));
var Comment = Promise.promisifyAll(require('../components/comment'));
var User = Promise.promisifyAll(require('../components/user'));

module.exports = function(app) {
  app.get('/stresstest/comments', urlEncodedParser, jsonParser, function(req, res, next) {

    var headers = req.headers['user-agent'];
    // var ip = req.ip;
    // console.log(headers, ip);

    if (headers === 'loader.io;a91237e7750e1628aaac7ab68bc20b52') {
      // console.log('yep.. ok');
      // ?url=http%3A%2F%2Fblank.org%2F&isPrivate=false
      var searchObject = {};
      searchObject.isPrivate = false;
      searchObject.repliesToId = null;

      return new Promise(function(resolve, reject) {
          // if there is a url search parameter, get the urls id, then search comments
          // console.log(req.query.url);
          if (req.query.url !== undefined) {
            Url.getId(req.query.url)
              .then(function(urlId) {
                searchObject.UrlId = urlId;
                resolve(searchObject);
              });
          } else {
            resolve(searchObject);
          }
        })
        .then(function(searchObj) {
          return Comment.get(searchObj, req.query.lastCommentId, req.query.urlSearch, req.query.host);
        })
        .then(function(result) {
          res.send({
            comments: result.rows,
            numComments: result.count,
            currentTime: new Date() // TODO: Fill this out!
          });
        })
        .catch(function(err) {
          // console.log("User not logged in", err);
          res.send(200);
          throw err;
        });
    } else {
      res.status(200).send({
        data: 'error'
      });
    }

  });

}