var server = 'http://api.oxidizer.io';
var url = '';
document.addEventListener("DOMContentLoaded", function(e) {

  // when ever we have a trigger event from the parent window 
  // it will tell the iframe to reload and redo what is needed

  window.addEventListener("message", function(e) {
    console.log(e.data);
    if (e.data.type === 'fire') {
      url = e.data.url;
      // show the panel with animation
      $('.cd-panel').addClass('is-visible');
      // do what needs to be done. load content, etc..
      loadContent(url);

    }
  }, false)


  // send message to background script to tell content script to close this iframe
  document.getElementById('close').addEventListener('click', function() {
    $('.cd-panel').removeClass('is-visible');
    chrome.runtime.sendMessage({
      from: 'iframe',
      message: 'close iframe'
    }, function() {});
  });



  /***********/
  /* Generic callback passing along an inital round trip message */

  /*
  
  This is the tricky part: 
  
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

//


function loadContent(url) {
  console.log('getting content from API');

  var params = {
    url: encodeURIComponent(url),
    lastUpdateId: 'undefined',
    isPrivate: false
  };
  var paramString = [];
  for (var key in params) {
    if (params.hasOwnProperty(key)) {
      paramString.push(key + '=' + params[key]);
    }
  }

  paramString = paramString.join('&');
  var apiURL = server + "/api/comments/get?" + paramString;


  var request = $.ajax({
    url: apiURL,
    method: "GET",
    contentType: "application/json",
  });

  request.done(function(msg) {
    // we have to use templating here ...
    console.log(msg);
    $("#log").html(msg);
  });

  request.fail(function(jqXHR, textStatus) {
    alert("Request failed: " + textStatus);
  });

}
