// Options has the following optional properties:
// commentId - will return an arrray with one comment
// userId - will add columns to let you know if this user has flagged or hearted the comment, and whether this comment was written by user
// url - filters by a url ** only supports either url or urlSearch - urlSearch will not work is url is present 
// urlSearch - filters by matching url 
// textSearch - fuzzy search for text
// lastCommentId - returns comments with id less than this
// repliesToId - if present, will only return replies to that id, else will only return non-replies (defualts to NULL)
// numberOfComments - limits the number of comments - defaults to 25
// orderBy - accepts an array [ sort by, 'ASC' or 'DESC' ] 
//  sort by accepts these strings: 
//    'Comments.id' (this is the default),
//    'HeartCount',
//    'FlagCount',
//    'ReplyCount',
//    ''   
// filterByUser - if true, it will only return comments for the user set at userFilterId - default is requesting user
// userFilterId -  
// isPrivate - if true, will only return a user's private comments;
// host - hard search for host
// 
module.exports = function(sequelize, options) {
  options = options || {};

  // add more columns here!!
  var queryString = 'SELECT DISTINCT Comments.id, Comments.UserId, Comments.text, Comments.UrlId, Comments.repliesToId, Comments.isPrivate, Comments.createdAt, Urls.url, Urls.host, Users.name AS username, Users.avatar AS userAvatar,' +
    '(SELECT COUNT(1) AS other FROM Hearts AS h ' +
      'WHERE Comments.id = h.CommentId GROUP BY Comments.id) AS HeartCount, ' +
    '(SELECT COUNT(1) AS other FROM Comments AS c ' +
      'WHERE Comments.id = c.RepliesToId GROUP BY Comments.id) AS ReplyCount, ' +
    '(SELECT COUNT(1) AS other FROM Flags AS f ' +
      'WHERE Comments.id = f.CommentId GROUP BY Comments.id) AS FlagCount ';
    
  //if there's a userid, check if it was hearted, flagged, or replied to by that user
  if (options.userFilterId || options.userId) {
    // add comma so we don't break sequel
    queryString += ',';

    queryString += 
      '(SELECT COUNT(1) AS other FROM Hearts AS h ' +
        'WHERE Comments.id = h.CommentId ' +
        'AND h.UserId = ' + options.userId + ') AS HeartedByUser, ' +
      '(SELECT COUNT(1) AS other FROM Flags AS f ' +
        'WHERE Comments.id = f.CommentId ' +
        'AND f.UserId = ' + options.userId + ') AS FlaggedByUser, ' +
      '(SELECT COUNT(1) AS other FROM Comments AS c ' +
        'WHERE Comments.id = c.RepliesToId ' +
        'AND c.UserId = ' + options.userId + ') AS RepliesToUser, ' +
      '(CASE WHEN Comments.UserId = ' + options.userId + ' THEN "true" ELSE NULL END) AS isUser ';
  }
  
  queryString += 
    'FROM Comments, Users ' +
    'INNER JOIN Urls ';

  var filters = [];


  if (options.url) {
    filters.push('Urls.url = "' + options.url + '" ');
  } else if (options.urlSearch) {
    filters.push('Urls.url LIKE "%' + options.urlSearch +'%" ');
  }

  if (options.textSearch) filters.push('Comments.text LIKE "%' + options.textSearch + '%"');
  
  if (options.filterByUser) {
    var userToFilter = options.userFilterId || options.userId;
    filters.push('Comments.UserId = ' + userToFilter + ' ');
  }

  if (options.commentId) filters.push('Comments.id = ' + options.commentId + ' ');
  if (options.lastCommentId) filters.push('Comments.id < ' + options.lastCommentId + ' ');
  if (options.repliesToId) filters.push('Comments.repliesToId = ' + options.repliesToId + ' ');
  if (options.host) filters.push('Urls.host = "' + options.host + '" ');
  if (options.isPrivate !== undefined) {
    if (options.isPrivate === 'true') filters.push('Comments.isPrivate = 1 ');
    else filters.push('Comments.isPrivate = 0 ');
  }

  // // if there are any filters, add them to the query
  if (filters.length > 0){
    // keeps correct user associated with the comment
    queryString += 'WHERE Users.id = Comments.userId AND Comments.UrlId = Urls.id ';

    for (var i = 0; i < filters.length; i++) {
      queryString += 'AND ';
      queryString += filters[i];
    }
  }
  
  // makes sure we have only 1 row per comment
  queryString  += 'GROUP BY Comments.id ';

  // if there is a repliesToId, add it to the query string, w comma to add to above WHERE
  if (!options.repliesToId) {
    queryString += 'HAVING Comments.repliesToId IS NULL ';
  }

  // optional order by property - see above for accepted strings
  var orderByParam = 'Comments.id';
  var orderByDirection = 'DESC';
  
  if (options.orderBy){
    orderByParam = options.orderBy[0] || 'Comments.id';
    orderByDirection = options.orderBy[1] || 'DESC';
  }

  queryString += 'ORDER BY ' + orderByParam + ' ' + orderByDirection + ' ';

  // optional limit
  var limit = options.numberOfComments || 25;
  queryString += 'LIMIT ' + limit + ' ';
  
  queryString += ';';

  return sequelize.query(queryString);
};











