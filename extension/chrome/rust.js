var config = '';
// listen for incoming message by chrome tab
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {

    // if request type is init (object property sent by tab)
    if (request.type === "init") {
      // call server with get request for data.
      var xhr = new XMLHttpRequest();
      // should include URL as parameter!
      xhr.open("POST", config.server + "/api/comments/get");
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
      xhr.send(JSON.stringify({
        url: request.url,
        lastUpdateTimestamp: 'undefined',
        isPrivate: false
      }));
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


/*
Oauth 
Client ID:  837204469183-nklfavnlll2v6jh0ku65tieuvc6qmhn1.apps.googleusercontent.com ; 
Secret:  mXAPIt-gVJqr4NeXIvVFTi_M
*/
