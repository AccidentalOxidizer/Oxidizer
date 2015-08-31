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

document.querySelector('#test').addEventListener('click', function() {
  chrome.runtime.sendMessage({
    type: 'test'
  }, function(response) {
    console.log(response);
  });
});

document.querySelector('#login').addEventListener('click', function() {
  chrome.runtime.sendMessage({
    type: 'login'
  }, function(response) {
    console.log(response);
  });
});

// $(document).ready(function() {
//   $('body').on('click', 'a', function() {
//     chrome.tabs.create({
//       url: $(this).attr('href')
//     });
//     return false;
//   });
// });
