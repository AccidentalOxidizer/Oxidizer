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

// This function parses the URL and strips
// it of http:// and www. stuff before saving
// to the database.
var fixUrl = function(obj) {
  var tempObj = {}
    //console.log('Check Obj: ', obj)
  if (obj.path) {
    tempObj.path = obj.path
    tempObj.path = parseUrl(tempObj.path);
  }

  return tempObj;
}

// GET a URL from the database
var get = function(searchObject) {
  //console.log("Search Object: ", searchObject)
  searchObject = fixUrl(searchObject);
  return Url.findOne({
      where: searchObject
    })
    .then(function(result) {
      urlInfo = {}
      urlInfo.id = result.get('id');
      urlInfo.path = result.get('path');
      return urlInfo;
    })
    .catch(function(err) {
      console.log("GET url error: ", err);
    })
};

// Write a new URL to the database
var save = function(urlObject) {
  urlObject = fixUrl(urlObject);
  return Url.findOrCreate({
      where: urlObject
    })
    .spread(function(url, created) {
      return url;
    })
    .catch(function(err) {
      console.log('Error saving url to db: ', err);
    })
};

// DELETE a URL from the database.
// TODO: We should also probably delete any 
// associated comments from the database as well,
// but this might not matter since we won't display
// them anyway.
var remove = function(urlObject) {
  urlObject = fixUrl(urlObject);
  return Url.destroy({
      where: urlObject
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
exports.save = save;
exports.remove = remove;