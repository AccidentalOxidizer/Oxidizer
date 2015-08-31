var config = '';

// listen for incoming message by chrome tab
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    // if request type is init (object property sent by tab)
    if (request.type === "init") {
      // call server with get request for data.
      var xhr = new XMLHttpRequest();
      xhr.open("GET", "http://localhost:3000/test/comments", true);
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
          // JSON.parse does not evaluate the attacker's scripts.
          var resp = JSON.parse(xhr.responseText);
          sendResponse({
            dev: "rust.js responding to message from chrome tab",
            data: resp,
            config: config,
            request: request,
            sender: sender
          });
        }
      }
      xhr.send();
      // if you don't return true here shit hits the fan
      return true;
    }

    // if conent script is sending data to post a new comment
    if (request.type === 'post') {
      var xhr = new XMLHttpRequest();
      xhr.open('POST', 'http://localhost:3000/test/comments');
      xhr.setRequestHeader('Content-Type', 'application/json');

      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 201) {
          var resp = JSON.parse(xhr.responseText);
          sendResponse({
            data: resp
          });
        }
      };

      xhr.send(JSON.stringify({
        name: 'Matthias',
        text: request.comment
      }));
      return true;
    }

    // testing login functionality
    if (request.type === 'login') {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", "http://localhost:4568/auth/github", true);
      xhr.setRequestHeader('Content-Type', 'application/json');

      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          sendResponse({
            data: resp,
            test: 'login-test'
          })
        }
      }
      xhr.send();
      // if you don't return true here shit hits the fan
      return true;
    }

    // testing login functionality
    if (request.type === 'test') {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", "http://localhost:4568/test", true);
      xhr.setRequestHeader('Content-Type', 'application/json');

      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          var resp = JSON.parse(xhr.responseText);

          sendResponse({
            data: resp,
            test: 'login-test'
          })
        }
      }
      xhr.send();
      // if you don't return true here shit hits the fan
      return true;
    }

    if (request.type === 'dummytest') {
      sendResponse({
        data: 'dummytestresponse'
      })
    }

  });

// read configuration file.
var config = function() {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    config = JSON.parse(xhr.responseText);
  };
  xhr.open("GET", chrome.extension.getURL('config.json'), true);
  xhr.send();
}

config();

// load content script (comment.js) each time chrome tab is updated & completed for specfic tab
chrome.tabs.onUpdated.addListener(function(tabId, info) {
  if (info.status === "complete") {
    chrome.tabs.executeScript(tabId, {
      file: "comment.js"
    });
  }

});


// setInterval(function() {
//   var xhr = new XMLHttpRequest();
//   xhr.open("GET", "http://localhost:4568/test", true);
//   xhr.onreadystatechange = function() {
//     if (xhr.readyState === 4 && xhr.status === 200) {
//       // JSON.parse does not evaluate the attacker's scripts.
//       var resp = JSON.parse(xhr.responseText);
//       sendResponse({
//         data: resp,
//       });
//     }
//   }
//   xhr.send();
//   // if you don't return true here shit hits the fan
//   return true;
// }, 2000)

/*
Oauth 
Client ID:  837204469183-nklfavnlll2v6jh0ku65tieuvc6qmhn1.apps.googleusercontent.com ; 
Secret:  mXAPIt-gVJqr4NeXIvVFTi_M
*/
