function saveOptions() {
  // get the values:
  var private = document.getElementById('private').checked;
  var visible = document.getElementById('visible').checked;
  // save values with chrome storage sync
  chrome.storage.sync.set({
    private: private,
    visible: visible
  }, function() {
    // Update status to indicate successful saved options
    var status = document.getElementById('status');
    status.textContent = 'Saved.';
    setTimeout(function() {
      // reset the status message after 2 seconds
      status.textContent = '';
    }, 2000);
  });
}

// Restores values on options pages as stored in chrome.storage.
function restoreOptions() {
  // Use default values
  chrome.storage.sync.get({
    private: false,
    visible: true
  }, function(items) {
    document.getElementById('private').checked = items.private;
    document.getElementById('visible').checked = items.visible;
  });
}

// Events 
document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
document.getElementById('reset').addEventListener('click', restoreOptions);

// nope..
// document.querySelector('#login').addEventListener('click', function() {
//   chrome.runtime.sendMessage({
//     type: 'login'
//   }, function(response) {
//     console.log(response);
//   });
// });

// https://developer.chrome.com/extensions/optionsV2
