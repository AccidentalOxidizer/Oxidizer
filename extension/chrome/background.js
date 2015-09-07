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
