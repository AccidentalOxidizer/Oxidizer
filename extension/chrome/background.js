chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
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
