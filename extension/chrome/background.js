// DEFAULTS
var settings = {
  server: 'http://localhost:3000',
  keepprivate: false,
  autoshow: true,
  showtrigger: true
};
// sync chrome storage against default settings 
chrome.storage.sync.get({
  server: settings.server,
  keepprivate: settings.keepprivate,
  autoshow: settings.autoshow,
  showtrigger: settings.showtrigger
}, function(store) {
  settings.server = store.server;
  settings.keepprivate = store.keepprivate;
  settings.autoshow = store.keepprivate;
  settings.showtrigger = store.showtrigger;
});
// update settings as they are changed in the chrome storage
chrome.storage.onChanged.addListener(function(changes, namespace) {
  for (key in changes) {
    if (settings.hasOwnProperty(key)) {
      var storageChange = changes[key];
      settings[key] = storageChange.newValue;
    }
  }
});


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {


  /* Generic callback passing along an inital round trip message */
  if (request.from === 'iframe' && request.message === 'callback') {
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        from: 'background',
        message: 'callback'
      }, function(response) {
        sendResponse(response.data);
      });
    });
    return true;
  }

  // on initialization from the content script, sent back the settings
  if (request.from === 'content script' && request.message === 'get settings') {
    sendResponse({
      settings: settings
    });
  }


  if (request.from === 'iframe' && request.message === 'close iframe') {
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        from: 'background',
        message: 'close iframe'
      }, function(response) {
        sendResponse(response.data);
      });
    });
    return true;
  }
});

chrome.commands.onCommand.addListener(function(command) {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {
      command: "toggle"
    });
  });
});


// on installation of extension.
// chrome.runtime.onInstalled.addListener(function(details) {
//  
// });

// once in a while we should run a requestUpdateCheck
// chrome.runtime.onUpdateAvailable(function(details) {
//   // we should send a message to user if an update is available and ask them to update.
// })
