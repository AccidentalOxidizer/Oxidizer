var Promise = require('bluebird');
var parseUrl = require('../../utils/parseURL');

var buildQueryOptions = function(req, filterByUser) {  
  var options = {};

  options.userId = req.query.userId || req.user.id;
  if (req.query.host) options.host = req.query.host;
 

  if (req.query.url) options.url = parseUrl(req.query.url).url;
  if (req.query.urlSearch) options.urlSearch = req.query.urlSearch;
  if (req.query.textSearch) options.textSearch = req.query.textSearch;
  if (req.query.lastCommentId) options.lastCommentId = req.query.lastCommentId;
  if (req.query.repliesToId) options.repliesToId = req.query.repliesToId; 
  if (req.query.numberOfComments) options.numberOfComments = req.query.numberOfComments;
  
  // orderByX should have a value of 'ASC' or 'DESC'
  if (req.query.orderByHearts) options.orderBy = ['HeartCount', req.query.orderByHearts];
  if (req.query.orderByFlags) options.orderBy = ['FlagCount', req.query.orderByFlags];
  if (req.query.orderByReplies) options.orderBy = ['ReplyCount', req.query.orderByReplies];
  if (req.query.filterByUser || filterByUser) options.filterByUser = req.query.filterByUser;
  if (req.query.isPrivate) options.isPrivate = req.query.isPrivate;

  return options;
};

module.exports.getCommentsForUrl = function(req, res, next) {
  var Comment = req.app.get('models').Comment;
  var User = req.app.get('models').User;
  // build query Options
  var options = buildQueryOptions(req);
  // getComment and User info for the database

  Promise.all([Comment.getComments(options), User.getUserInfo(options.userId)]) // TODO add userQuery
    .spread(function(comments, user){
      var response = {
        comments: comments[0],
        userInfo: user[0],
        currentTime: new Date()
      };

      // res.data.userInfo = 
      res.send(200, response);
    });
};

module.exports.getCommentsForUser = function (req, res, next) {
  var Comment = req.app.get('models').Comment;
  var User = req.app.get('models').User;

  var options = buildQueryOptions(req, true);
};

module.exports.addComment = function(req, res, next) {  
  // post the comment, then get comment info and user info 
  var Comment = req.app.get('models').Comment;
  var User = req.app.get('models').User;

  return Comment.addComment({
    text: req.body.text,
    isPrivate: req.body.isPrivate,
    UserId: req.user.id,
    url: req.body.url,
    host: parseUrl(req.body.url).host,
    repliesToId: req.body.repliesToId
  })
    .then(function(data){

      var newComment = {
        commentId: data.get('id'),
        repliesToId: req.body.repliesToId
      };

      return Promise.all([Comment.getComments(newComment), User.getUserInfo(req.user.id)]);
    })
    .spread(function(comments, user) {

      var response = {
        comments: comments[0],
        userInfo: user[0],
        currentTime: new Date()
      };

      res.send(201, response);
    })
    .catch(function(err){
      console.log(err);
    });
};

module.exports.remove = function(req, res, next) {
  var Comment = req.app.get('models').Comment;
  return Comment.destroy({
      where: {
        id: req.params.id
      }
    })
     .then(function(url) {
        res.send(200, "Deleted comment!");
      })
      .catch(function(err) {
        console.log("Err: ", err);
        res.send(500);
      });
};













