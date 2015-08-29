var dummyData = [{
  id: 1,
  id_user: 1,
  id_url: 1,
  timestamp: '2015-08-27 13:59:59',
  text: "Hack Reactor is so awesome, woooo yeah dawg boy!",
  privacy: false,
  id_groups: 0
}, {
  id: 2,
  id_user: 1,
  id_url: 1,
  timestamp: '2015-08-27 14:59:59',
  text: "Hack Reactor is so awesome, woooo yeah dawg boy!",
  privacy: false,
  id_groups: 0
}];

// listen for incoming message by chrome tab
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    // if request type is init (object property sent by tab)
    if (request.type === "init") {

      // call server with get request for data.

      var xhr = new XMLHttpRequest();
      xhr.open("GET", "http://localhost:3000/test/comments", true);
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {

          // JSON.parse does not evaluate the attacker's scripts.
          var resp = JSON.parse(xhr.responseText);

          sendResponse({
            dev: "rust.js responding to message from chrome tab",
            data: dummyData,
            request: request,
            sender: sender
          });

        }

      }
      xhr.send();

      // var xhr = new XMLHttpRequest();
      // xhr.open('GET', 'http://localhost:3000/test/comments');
      // xhr.setRequestHeader('Content-Type', 'application/json');
      // xhr.onload = function() {
      //   if (xhr.status === 200) {
      //     var userInfo = JSON.parse(xhr.responseText);

      //   } else {

      //   }
      // };
      // xhr.send();

      // sendResponse({
      //   dev: "rust.js responding to message from chrome tab",
      //   data: dummyData,
      //   request: request,
      //   sender: sender
      // });


    }
  });

// load content script (comment.js) each time chrome tab is updated & completed for specfic tab
chrome.tabs.onUpdated.addListener(function(tabId, info) {
  if (info.status == "complete") {
    chrome.tabs.executeScript(tabId, {
      file: "comment.js"
    });
  }
});
