// This function takes a sequelize instance and an options object to build a query
// that returns all the info we need for a comment object
// 
// Options has the following properties - all are optional, i.e. if you don't pass options, you will just get all comments:
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
// offset - if set, indicates the offset by which to load the comments with respect to loading a limited set of comments
//  (limit and offset are applied after the other query filtering)
// filterByUser - if true, it will only return comments for the user set at userFilterId - default is requesting user
// getHeartedByUser - will only returned favorited ids
// userFilterId -  if true, will return comments that were written by the user passed with options.userId
// isPrivate - if true, will only return a user's private comments;
// host - hard search for host
// 
module.exports = function(sequelize, options) {
  options = options || {};

  // for variables, always push a question mark to the query string, and the variable to the replacements string
  // so we protect against sql injection
  var queryString = [];
  var replacements = [];

  // Adds base
  queryString.push('SELECT DISTINCT Comments.id, Comments.UserId, Comments.text, Comments.UrlId, Comments.repliesToId, Comments.isPrivate, Comments.createdAt, Urls.url, Urls.host, Users.name AS username, Users.avatar AS userAvatar,',
    // counts how many hearts each comment has
    '(SELECT COUNT(1) AS other FROM Hearts AS h ',
      'WHERE Comments.id = h.CommentId GROUP BY Comments.id) AS HeartCount, ',
    // counts how many replies each comment has
    '(SELECT COUNT(1) AS other FROM Comments AS c ',
      'WHERE Comments.id = c.RepliesToId GROUP BY Comments.id) AS ReplyCount, ',
    // counts how many flags each comment has
    '(SELECT COUNT(1) AS other FROM Flags AS f ',
      'WHERE Comments.id = f.CommentId GROUP BY Comments.id) AS FlagCount ');
    
  //if there's a userid, check if it was hearted, flagged, or replied to by that user
  if (options.userFilterId || options.userId) {
    // add comma so we don't break sequel
    queryString.push(',');

    // check if the user we are looking up for has hearted this commented
    queryString.push( 
      '(SELECT COUNT(1) AS other FROM Hearts AS h ',
        'WHERE Comments.id = h.CommentId ',
        'AND h.UserId = ', '?', ') AS HeartedByUser, ');
    replacements.push(options.userId);
    
    // check if the user we are looking up for has flagged this commented
    queryString = queryString.concat('(SELECT COUNT(1) AS other FROM Flags AS f ',
        'WHERE Comments.id = f.CommentId ',
        'AND f.UserId = ', '?', ') AS FlaggedByUser, ');
    replacements.push(options.userId);

    // check if the user we are looking up for has replied to this commented
    queryString.push('(SELECT COUNT(1) AS other FROM Comments AS c ',
        'WHERE Comments.id = c.RepliesToId ',
        'AND c.UserId = ', '?', ' ) AS RepliesToUser, ');
    replacements.push(options.userId);
    
    // check if this comment belongs to the user we are returning to  
    queryString.push('(CASE WHEN Comments.UserId = ', ' ? ', ' THEN "true" ELSE NULL END) AS isUser ');
    replacements.push(options.userId);
  }
  
  queryString.push( 
    'FROM Comments, Users ',
    'INNER JOIN Urls ');

  // object to hold all of the filters we will be using based on the options object
  var filters = [];

  // don't send comments that have been flagged more than 5 times
  filters.push('(SELECT COUNT(1) AS other FROM Flags AS f WHERE Comments.id = f.CommentId) < 5 ');

  if (options.url) {
    // if we are searching for a particular url
    filters.push('Urls.url = ? ');
    replacements.push(options.url);
  } else if (options.urlSearch) {
    filters.push('Urls.url LIKE "%?%" ');
    replacements.push(options.urlSearch);
  }

  if (options.textSearch) {
    filters.push('Comments.text LIKE "%?%"');
    replacements.push(options.textSearch);
  }
  
  if (options.filterByUser) {
    var userToFilter = options.userFilterId || options.userId;
    filters.push('Comments.UserId = ?');
    replacements.push(userToFilter); 
  }

  if (options.commentId) {
    filters.push('Comments.id = ?');
    replacements.push(options.commentId);
  }
  if (options.lastCommentId) {
    filters.push('Comments.id < ?');
    replacements.push(options.lastCommentId);
  }
  if (options.repliesToId) {
    filters.push('Comments.repliesToId = ?');
    replacements.push(options.repliesToId);
  }
  if (options.host) {
    filters.push('Urls.host = ?');
    replacements.push(options.host);
  }
  if (options.isPrivate !== undefined) {
    if (options.isPrivate === 'true') {
      filters.push('Comments.isPrivate = 1 ');
      filters.push('Comments.UserId = ' + options.userId);
    } else {
      filters.push('Comments.isPrivate = 0 ');
    }
  }

  if (options.getHeartedByUser){
    filters.push('(SELECT COUNT(1) AS other FROM Hearts AS h WHERE Comments.id = h.CommentId AND h.UserId = 1) = 1 ');
  }

  // keeps correct user associated with the comment
  queryString.push('WHERE Users.id = Comments.userId AND Comments.UrlId = Urls.id ');

  // filter for a users private comments

  // if there are any filters, add them to the query
  if (filters.length > 0){
    for (var i = 0; i < filters.length; i++) {
      queryString.push('AND ');
      queryString.push(filters[i]);
    }
  }
  
  // makes sure we have only 1 row per comment
  queryString.push('GROUP BY Comments.id ');

  // if there is a repliesToId, add it to the query string, w comma to add to above WHERE
  if (!options.repliesToId) {
    queryString.push('HAVING Comments.repliesToId IS NULL ');
  }

  // optional order by property - see above for accepted strings
  var orderByParam = 'Comments.id';
  var orderByDirection = 'DESC';
  
  if (options.orderBy){
    orderByParam = options.orderBy[0];
    orderByDirection = options.orderBy[1];
  }

  queryString.push('ORDER BY ' + orderByParam + ' ' + orderByDirection);

  // optional limit
  var limit = options.numberOfComments || 25;
  replacements.push(limit);
  queryString.push('LIMIT ? ');

  // optional offset for limit ...
  if (options.offset) {
    queryString.push('OFFSET ' + options.offset);
  }
  
  queryString.push(';');

  return sequelize.query(queryString.join(' '), {replacements: replacements});
};


