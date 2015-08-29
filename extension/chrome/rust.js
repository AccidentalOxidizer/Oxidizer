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
            add: 'something',
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
  });

// load content script (comment.js) each time chrome tab is updated & completed for specfic tab
chrome.tabs.onUpdated.addListener(function(tabId, info) {
  if (info.status === "complete") {
    chrome.tabs.executeScript(tabId, {
      file: "comment.js"
    });
  }

});
