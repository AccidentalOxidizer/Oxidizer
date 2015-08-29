// var hogan = require('lib/hogan-3.0.2.min.js');

// var getHtml = function(data) {
//   var template = hogan.compile("@{{name}}");
//   var team = ['dhg', 'fat', 'jimio', 'nickgreen', 'sayrer'];
//   team.map(function(twitterer) {
//     return template.render({
//       name: twitterer
//     });
//   });
//   console.log('Follow: ' + team.join(' ') + '!');
// }


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
}, {
  id: 3,
  id_user: 1,
  id_url: 1,
  timestamp: '2015-08-27 15:59:59',
  text: "Hack Reactor is so awesome, woooo yeah dawg boy!",
  privacy: false,
  id_groups: 0
}, {
  id: 4,
  id_user: 1,
  id_url: 1,
  timestamp: '2015-08-27 16:59:59',
  text: "Hack Reactor is so awesome, woooo yeah dawg boy!",
  privacy: false,
  id_groups: 0
}]


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
      "from a content script:" + sender.tab.url :
      "from the extension");
    // if (request.greeting == "hello")
    sendResponse({
      dev: "rust.js responding to message from chrome tab",
      data: dummyData,
      request: request,
      sender: sender
    });
  });


chrome.tabs.onUpdated.addListener(function(tabId, info) {
  if (info.status == "complete") {
    chrome.tabs.executeScript(null, {
      file: "comment.js"
    });
  }
});

chrome.tabs.onUpdated.addListener('complete', function(tabId, changeInfo, tab) {
  // if (changeInfo.status == 'complete' && tab.active) {
  console.log('beep');
  chrome.tabs.executeScript(null, {
    file: "comment.js"
  });
  // }
})

chrome.webNavigation.onCompleted.addListener(function() {
  console.log('beep');
  chrome.tabs.executeScript(null, {
    file: "comment.js"
  });
});

// check of login
// if user is not logged in, show option on popup.html
// if user is logged in (verified token) show logout option only


// real code for injection:
// only inject code into webpage if user is authenticated and pass along the right content.



// chrome.browserAction.onClicked.addListener(function(tab) {
//   chrome.tabs.executeScript({
//     // code: 'document.body.style.backgroundColor="blue"'
//   });
// });
