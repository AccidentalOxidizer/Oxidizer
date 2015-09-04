function saveOptions() {
  // get the values:
  var keepprivate = document.getElementById('keepprivate').checked;
  var autoshow = document.getElementById('autoshow').checked;
  // save values with chrome storage sync
  chrome.storage.sync.set({
    keepprivate: keepprivate,
    autoshow: autoshow
  }, function() {
    // Update status to indicate successful saved options
    var status = document.getElementById('status');
    status.classList.remove('hidden');
    status.classList.add('visible');
    status.textContent = 'Settings saved';
    setTimeout(function() {
      // reset the status message after 2 seconds
      status.textContent = '';
      status.classList.remove('visible');
      status.classList.add('hidden');
    }, 2000);
  });
}

// Restores values on options pages as stored in chrome.storage.
function restoreOptions() {
  // Use default values
  chrome.storage.sync.get({
    keepprivate: false,
    autoshow: true
  }, function(items) {
    document.getElementById('keepprivate').checked = items.keepprivate;
    document.getElementById('autoshow').checked = items.autoshow;
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
