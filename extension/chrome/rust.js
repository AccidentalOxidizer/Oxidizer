var config = '';
// listen for incoming message by chrome tab
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {

    // if request type is init (object property sent by tab)
    if (request.type === "init") {
      // call server with get request for data.
      var xhr = new XMLHttpRequest();
      // should include URL as parameter!

      // TODO: We need to clean these parameters after we build everything!
      var params = {
        url: encodeURIComponent(request.url),
        lastUpdateId: 'undefined',
        isPrivate: false
      };
      var paramString = [];
      for (var key in params) {
        if (params.hasOwnProperty(key)) {
          paramString.push(key + '=' + params[key]);
        }
      }

      paramString = paramString.join('&');
      var apiURL = config.server + "/api/comments/get?" + paramString;
      xhr.open("GET", apiURL);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          // JSON.parse does not evaluate the attacker's scripts.
          var resp = JSON.parse(xhr.responseText);
          sendResponse({
            data: resp
          });
        }
      };
      xhr.send();
      // if you don't return true here shit hits the fan
      return true;
    }

    // loads more comments
    if (request.type === "getmorecomments") {
      // call server with get request for data.
      var xhr = new XMLHttpRequest();
      // should include URL as parameter!

      // TODO: We need to clean these parameters after we build everything!
      var params = {
        url: encodeURIComponent(request.url),
        lastUpdateId: request.lastUpdateId,
        isPrivate: false
      };
      var paramString = [];
      for (var key in params) {
        if (params.hasOwnProperty(key)) {
          paramString.push(key + '=' + params[key]);
        }
      }
      
      paramString = paramString.join('&');
      var apiURL = config.server + "/api/comments/get?" + paramString;
      xhr.open("GET", apiURL);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          // JSON.parse does not evaluate the attacker's scripts.
          var resp = JSON.parse(xhr.responseText);
          sendResponse({
            data: resp
          });
        }
      };
      xhr.send();
      // if you don't return true here shit hits the fan
      return true;
    }
    // post a new comment
    if (request.type === 'post') {
      var xhr = new XMLHttpRequest();
      xhr.open('POST', config.server + '/api/comments/add');
      xhr.setRequestHeader('Content-Type', 'application/json');

      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) { // && xhr.status === 201
          var resp = JSON.parse(xhr.responseText);
          sendResponse({
            data: resp
          });
        }
      };

      xhr.send(JSON.stringify({
        url: request.url,
        text: request.text,
        isPrivate: false
      }));
      return true;
    }

    // handle logout
    if (request.type === 'logout') {
      sendResponse({
        data: 'test'
      });

      var xhr = new XMLHttpRequest();
      xhr.open("GET", config.server + "/api/auth/chrome/logout", true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          var resp = JSON.parse(xhr.responseText);
          sendResponse({
            data: resp
          });
        }
      };
      xhr.send();
      return true;
    }

    // testing if authenticated with server
    if (request.type === 'test') {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", config.server + "/test/auth", true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) { // && xhr.status === 200
          var resp = JSON.parse(xhr.responseText);
          sendResponse({
            data: resp
          });
        }
      };
      xhr.send();
      return true;
    }

    // for debugging
    if (request.type === 'popup') {
      sendResponse({
        data: 'popup'
      });
      return true;
    }
  });


/* MAGIC HAPPENS HERE */

// read configuration file & set config variable
var getConfig = function() {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    config = JSON.parse(xhr.responseText);
  };
  xhr.open("GET", chrome.extension.getURL('config.json'), true);
  xhr.send();
};

getConfig();

// load content script (comment.js) each time chrome tab is updated & completed for specfic tab
chrome.tabs.onUpdated.addListener(function(tabId, info) {
  if (info.status === "complete") {
    chrome.tabs.executeScript(tabId, {
      file: "comment.js"
    });
  }
});
chrome.commands.onCommand.addListener(function(command) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {command: "toggle"});
  });
});












