// *********** COMMENTS *************

// POST request to api/comments*path
// extension sends in parameter the url (and later group/ maybe isPrivate)
var requestAllCommentsForPath = {
  url: 'string unparsed url',
  lastUpdateTimestamp: 'lastUpdate',
  isPrivate: 'boolean'
};
// will add date 

// server responds 
var commentsForAPath = {
  comments: [{
    url: 'parsedUrl',
    user: {
      name: 'string'
    },
    text: 'string',
    timestamp: 'date',
    isPrivate: 'boolean'
  }],
  currentTime: 'timestamp',
  userInfo: {
    username: 'string'
  }
};

// POST request to api/comments
// extension sends:
var extCommentPostRequestBody = {
  url: 'unparsed_url',
  text: 'comment string',
  isPrivate: 'boolean'
};
// username and id will be available token at req.user.name

// server responds with the newly created comment
var postCommentsResponse = {
  comments: [{
    url: 'parsedUrl',
    user: {
      name: 'string'
    },
    text: 'string',
    timestamp: 'date',
    isPrivate: 'boolean'
  }],
  currentTime: 'timestamp',
  userInfo: {
    username: 'string'
  }
};

/** 
 * USERS:
 * This is a JSON object that we'd expect to get back
 * if we queried our API for a particular user.
 *
 * User status:
 * Looking below, it might be better to just choose
 * these values from an array: 
 * ['unverified', 'active', 'moderator', 'admin', 'banned']
 *
 * For now:
 * 0 = Unverified
 * 1 = Verified / Active (Normal User and priveleges)
 * 2 = Verified / Moderator (Elevated user priveleges)?
 * 3 = Verified / Admin?
 * 99 = BANNED
 */
user = {
  id: 1,
  name: 'Dave',
  email: 'dave@email.net',
  status: 1,
  logininfo: "...", // Work in Progress
  profileinfo: "..." // Work in Progress
}

/** 
 * COMMENTS:
 * This is a JSON object that we'd expect to get back
 * if we queried our API for a particular comment
 */
comment = {
  id: 1,
  id_user: 1,
  id_url: 1,
  timestamp: '2015-08-27 17:59:59',
  text: "Hack Reactor is so awesome, woooo yeah dawg boy!",
  privacy: false,
  id_groups: 0
}

/** 
 * GROUPS:
 */

group = {
  id: 1,
  name: 'Hack Reactor Friends!',
  privacy: true
}

/**
 * GROUPS_USERS:
 *
 * This shows which user is part of which group.
 */

groups_users = {
  id: 1,
  id_groups: 1,
  id_users: 1,
}