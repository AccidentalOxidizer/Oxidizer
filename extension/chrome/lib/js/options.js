function saveOptions() {
  // get the values:
  var keepprivate = document.getElementById('keepprivate').checked;
  var autoshow = document.getElementById('autoshow').checked;
  var showtrigger = document.getElementById('showtrigger').checked;
  var triggerposition = document.getElementById("triggerposition");
  triggerposition = triggerposition.options[triggerposition.selectedIndex].value;

  // save values with chrome storage sync
  chrome.storage.sync.set({
    keepprivate: keepprivate,
    autoshow: autoshow,
    showtrigger: showtrigger,
    triggerposition: triggerposition
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
  // hm .. this is coming from background script? how do we access of hand that over?
  // are we sending a request to background? 
  chrome.storage.sync.get({
    keepprivate: false,
    autoshow: true,
    showtrigger: true,
    triggerposition: 0
  }, function(items) {
    document.getElementById('keepprivate').checked = items.keepprivate;
    document.getElementById('autoshow').checked = items.autoshow;
    document.getElementById('showtrigger').checked = items.showtrigger;
    var triggerposition = document.getElementById("triggerposition");
    triggerposition.selectedIndex = items.triggerposition;
  });
}

// Events 
document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
document.getElementById('reset').addEventListener('click', restoreOptions);