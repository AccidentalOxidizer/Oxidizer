document.addEventListener("DOMContentLoaded", function(e) {

  $('.cd-panel').addClass('is-visible');


  document.getElementById('close').addEventListener('click', function() {
    // send message to background script to tell content script to close this iframe
    chrome.runtime.sendMessage({
      from: 'iframe',
      message: 'close iframe'
    }, function() {});
    console.log('click');
  });



  /***********/

  /*
  
  This is tricky: 
  
  Send a message from the iframe script (sideframe.js) to the background script (background.js)
  The background script on receiveing the message sends a message to the content script
  which in turn sends back a message to the iframe. 

  */
  chrome.runtime.sendMessage({
      from: 'iframe',
      message: 'callback'
    },
    function(response) {
      console.log('iframe callback message:', response);
    });
});
