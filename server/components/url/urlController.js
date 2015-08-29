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

var fixUrl = function(obj) {
  console.log('Check Obj: ', obj)
  if (obj.path) {
    console.log("BEFORE FIX PATH: ", obj.path);
    obj.path = parseUrl(obj.path);
    console.log("After FIX PATH: ", obj.path);
  }

  return obj;
}

// GET a URL from the database
var get = function(searchObject) {
  searchObject = fixUrl(searchObject);
  return Url.findOne({
      where: searchObject
    })
    .then(function(result) {
      return result.get('path');
    })
    .catch(function(err) {
      console.log("GET url error: ", err);
    })
};

// Write a new URL to the database
var post = function(urlObject) {
  urlObject = fixUrl(urlObject);
  console.log('Hi Dave, POST URL: ', urlObject);
  return User.findOrCreate({
      where: urlObject
    })
    .spread(function(url, created) {
      if (!created) {
        throw new Error('Error posting to db');
      } else {
        return url;
      }
    });
};

// DELETE a URL from the database.
// TODO: We should also probably delete any 
// associated comments from the database as well,
// but this might not matter since we won't display
// them anyway.
var remove = function(urlId) {
  return Url.destroy({
      where: {
        id: urlId
      }
    })
    .then(function(affectedRows) {
      console.log(affectedRows);
      if (affectedRows === 0) {
        throw new Error('Url not found - delete failed');
      } else if (affectedRows > 1) {
        throw new Error('deleted multiple url');
      } else {
        return true;
      }
    })
    .catch(function(error) {
      throw new Error(error);
    });
};


exports.get = get;
exports.post = post;
exports.remove = remove;