var url = require('url');

// temporary dummy data for black listed urls
// this shouls be in the DB, but stored in a global object refreshed every once in a while

var blacklisted = {
  'bad.com/': true,
  'banned.com/': true
};

module.exports = function(unparsedURL) {

  // Allow posting paths only and not URLs by prepending 'http://'
  if (unparsedURL.substr(0, 5) === 'http:' || unparsedURL.substr(0, 6) === 'https:') {
    //do nothing
  } else {
    unparsedURL = 'http://' + unparsedURL;
  }
  var parsedURL = url.parse(unparsedURL);

  // Let's check if there are any query strings. 
  // If so, we're going to parse them and temporarily store it as an object.
  // Then, we're going to attach the FIRST query param to the end of our URL before we return it.
  // Now, you should be able to comment on YouTube videos. :)

  // This needs to be outside the parsedURL query stuff below. 
  // Otherwise, we start attaching 'undefined' to our URLs.
  var getQuery = ''; 
  
  if (parsedURL.query !== null) {
    var parsedQuery = JSON.parse('{"' + decodeURI(parsedURL.query).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');

    //Build query string for FIRST parameter
    var firstQuery = false;

    for (var key in parsedQuery) {
      if (!firstQuery) {
        getQuery = '?' + key + '=' + encodeURI(parsedQuery[key]);
        firstQuery = true;
      }
    }
  }

  
  // Replace only 'www.' at beginning of string via regex: /(^w)\w+\./i
  // not working totally, because it also triggers for 'wwwSOMETHING.domain.com'
  // it would be valuable to learn how to solve this with regular expressions to replace also www1. www2.
  if (parsedURL.host.indexOf('www.') === 0) {
    parsedURL.host = parsedURL.host.replace('www.', '');
  }
  // if url is blacklisted return new Error
  // console.log(parsedURL.host);
  if (blacklisted.hasOwnProperty(parsedURL.host + '/')) {
    return new Error('URL blacklisted');
  }

  // if hash seems legit path, return parsed url with hash
  if (parsedURL.hash && '/!'.indexOf(parsedURL.hash[1]) !== -1) {
    // remove ? 
    return {
      url: parsedURL.host + parsedURL.pathname + parsedURL.hash + getQuery,
      host: parsedURL.host,
      pathname: parsedURL.pathname
    };
  }

  // return parsed url
  return {
    url: parsedURL.host + parsedURL.pathname + getQuery,
    host: parsedURL.host,
    pathname: parsedURL.pathname
  };
};
