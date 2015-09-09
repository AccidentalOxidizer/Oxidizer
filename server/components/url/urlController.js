var Url = require('../').Url;
var parseUrl = require('../../utils/parseURL.js');
var url = require('url');

/** 
 *  This controller is responsible for getting and 
 *  adding URLs from specific webpages to our database.
 *
 *  This controller is expecting to receive data in the
 *  following format:
 *  
 *  url = {
 *    url: "http://somethingsomething.com"
 *  }
 */

// copy an object so that we don't leave any side effects when we parse the url 
var copyObject = function(obj) {
  var parsedObject = {};

  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      parsedObject[prop] = obj[prop];
    }
  }

  var parsedURL = parseUrl(parsedObject.url);
  
  parsedObject.host = parsedURL.host;
  parsedObject.url = parsedURL.url;

  return parsedObject;
};


var getId = function(url){
  var parsedUrl = parseUrl(url).url;
  return Url.findOne({where: {url: parsedUrl}})
    .then(function(url){
      return url.get('id');
    })
};

// GET all comments for a URL from the database
// user is an optional arg - if present this query will include if a comment has been faved or heared by the user
var get = function(searchObject, userid) {
  var parsedObject = copyObject(searchObject);      

  var queryObject = { 
    where: parsedObject
  };
  
  return Url.findOne(queryObject)
    .then(function(result) {
      if (result !== null) {
        urlInfo = {};
        urlInfo.id = result.get('id');
        urlInfo.url = result.get('url');
        return urlInfo;
      } else {
        return null;
      }
    })
    .catch(function(err) {
      console.log("GET url error: ", err);
      // URL does not currently exist in the database.
      return null;
    });
};

// Write a new URL to the database
var save = function(urlObject) {

  var parsedObject = copyObject(urlObject);

  return Url.findOrCreate({
      where: parsedObject
    })
    .spread(function(url, created) {
      return url;
    })
    .catch(function(err) {
      console.log('Error saving url to db: ', err);
    });
};

// DELETE a URL from the database.
// TODO: We should also probably delete any 
// associated comments from the database as well,
// but this might not matter since we won't display
// them anyway.
var remove = function(url) {
  url = parseUrl(url).url;
  return Url.destroy({
      where: {
        url: url
      }
    })
    .then(function(affectedRows) {
      if (affectedRows === 0) {
        throw new Error('Url not found - delete failed');
      } else if (affectedRows > 1) {
        throw new Error('deleted multiple url');
      } else {
        return true;
      }
    })
    .catch(function(error) {
      console.log("URL deletion failed! ", error);
    });
};

exports.get = get;
exports.save = save;
exports.remove = remove;
exports.getId = getId;