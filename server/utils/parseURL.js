var url = require('url');

// temporary dummy data for black listed urls
// this shouls be in the DB, but stored in a global object refreshed every once in a while

var blacklisted = {
  'bad.com/': true,
  'banned.com/': true
};

module.exports = function(unparsedURL) {
  var parsedURL = url.parse(unparsedURL);
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
    return parsedURL.host + parsedURL.pathname + parsedURL.hash + '/';
  }

  // return parsed url
  return parsedURL.host + parsedURL.pathname;
}