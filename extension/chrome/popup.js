document.querySelector('#options').addEventListener('click', function() {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL('options.html'));
  }
});

// dev only, this should happen in the extension itself = rust.js
document.querySelector('#inject').addEventListener('click', function() {
  chrome.tabs.executeScript(null, {
    file: "comment.js"
  });
});
