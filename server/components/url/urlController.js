var Url = require('../').Url;
var parseUrl = require('../../utils/parseURL.js');

/** 
 *  This controller is responsible for getting and 
 *  adding URLs from specific webpages to our database.
 *
 *  This controller is expecting to receive data in the
 *  following format:
 *  
 *  url = {
 *    path: "http://somethingsomething.com"
 *  }
 */

// copy an object so that we don't leave any side effects when we parse the url 
var copyObject = function(obj) {
  var parsedObject = {};

  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)){
      parsedObject[prop] = obj[prop];
    }
  }

  parsedObject.path = parseUrl(parsedObject.path);

  return parsedObject;
};

// GET a URL from the database
var get = function(searchObject) {
  var parsedObject = copyObject(searchObject);

  return Url.findOne({
      where: parsedObject
    })
    .then(function(result) {
      urlInfo = {};
      urlInfo.id = result.get('id');
      urlInfo.path = result.get('path');
      return urlInfo;
    })
    .catch(function(err) {
      console.log("GET url error: ", err);
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
  url = parseUrl(url);
  return Url.destroy({
      where: {path: url}
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