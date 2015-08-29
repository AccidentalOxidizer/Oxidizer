chrome.tabs.onUpdated.addListener(function(tabId, info) {
  if (info.status == "complete") {
    chrome.tabs.executeScript(tabId, {
      file: "comment.js"
    });
  }
});
