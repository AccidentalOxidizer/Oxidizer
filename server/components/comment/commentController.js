var Promise = require('bluebird');
var parseUrl = require('../../utils/parseURL');
var userController = require('../user');
var buildQueryOptions = function(req, filterByUser) {  
  var options = {};

  // req.query.userId will only be set if we are filtering comments
  // to be from a single user, and that user is not the logged in user
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
  if (req.query.commentOffset) options.offset = req.query.commentOffset;
  if (req.query.filterByUser || filterByUser) options.filterByUser = req.query.filterByUser;
  if (req.query.isPrivate) options.isPrivate = req.query.isPrivate;
  if (req.query.getHeartedByUser) options.getHeartedByUser = true;

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
        userInfo: user[0][0],
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

  Promise.all([Comment.getComments(options), User.getUserInfo(options.userId)]) // TODO add userQuery
    .spread(function(comments, user){
      var response = {
        comments: comments[0],
        userInfo: user[0][0],
        currentTime: new Date()
      };
      console.log(response);

      // res.data.userInfo = 
      res.send(200, response);
    })
    .catch(function(err){
      console.log(err);
      res.send(404);
    });
};

module.exports.getHeartedCommentsForUser = function(req, res, next){
  var Comment = req.app.get('models').Comment;
  var User = req.app.get('models').User;
    
  var options = buildQueryOptions(req, true);

  Promise.all([Comment.getComments(options), User.getUserInfo(options.userId)]) // TODO add userQuery
    .spread(function(comments, user){
      var response = {
        comments: comments[0],
        userInfo: user[0][0],
        currentTime: new Date()
      };

      // res.data.userInfo = 
      res.send(200, response);
    })
    .catch(function(err){
      console.log(err);
      res.send(404);
    });
};

module.exports.getRepliesForComment = function(req, res, next){
  var Comment = req.app.get('models').Comment;
  var User = req.app.get('models').User;
  req.user = {
    id: req.session.passport.user
  };

  // build query Options
  var options = buildQueryOptions(req);

  Promise.all([Comment.getComments(options), User.getUserInfo(options.userId)]) // TODO add userQuery
    .spread(function(comments, user){
      var response = {
        comments: comments[0],
        userInfo: user[0][0],
        currentTime: new Date()
      };

      res.send(200, response);
    });

};

module.exports.addComment = function(req, res, next) {  
  // post the comment, then get comment info and user info 
  var Comment = req.app.get('models').Comment;
  var User = req.app.get('models').User;

  return Comment.addComment({
    text: req.body.text,
    isPrivate: req.body.isPrivate,
    UserId: req.user.id,
    url: parseUrl(req.body.url).url,
    host: parseUrl(req.body.url).host,
    repliesToId: req.body.repliesToId
  })
    .then(function(data){
      newCommentId = data.get('id');
      var newComment = {
        commentId: data.get('id'),
        repliesToId: req.body.repliesToId
      };

      return Promise.all([Comment.getComments(newComment), User.getUserInfo(req.user.id), Comment.getComments({commentId: req.body.repliesToId})]);
    })
    .spread(function(comments, user, repliesToComment) {

      var response = {
        comments: comments[0],
        userInfo: user[0][0],
        currentTime: new Date()
      };

      res.send(201, response);

      if (req.body.repliesToId && repliesToComment[0][0].UserId !== req.user.id) {
        userController.incrementNotification(repliesToComment[0][0].UserId, 'replies');
      }
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















