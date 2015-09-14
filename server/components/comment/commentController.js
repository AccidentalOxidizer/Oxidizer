var Promise = require('bluebird');
var parseUrl = require('../../utils/parseUrl');

var buildQueryOptions = function(req, filterByUser) {  
  var options = {};

  if (req.user) options.userId = req.user.id;
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
  Promise.all([Comment.getComments(options), User.getUserInfo(req.user.id)]) // TODO add userQuery
    .spread(function(comments, user){

      var response = {
        comments: comments[0],
        userInfo: user,
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













