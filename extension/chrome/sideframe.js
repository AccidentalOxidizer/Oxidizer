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


  // Post new comment
  document.getElementById('comment-input-field').addEventListener('keydown', function(e) {
    if (e.keyCode === 13) {
      // trigger post
      postComment(document.getElementById('comment-input-field').value);
      document.getElementById('comment-input-field').value = '';
    }
  });
  document.getElementById('comment-submit-button').addEventListener('click', function() {
    postComment(document.getElementById('comment-input-field').value);
    document.getElementById('comment-input-field').value = '';
  });

  // this can't work, the event listeners need to be atached individually after loading
  document.getElementsByClassName('heart').addEventListener('click', function() {});
  document.getElementsByClassName('flag').addEventListener('click', function() {});


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
    // clean the DOM
    $(".cd-panel-content").html('');
    // compile and append new comments
    compileAppendComments(msg.comments);
  });

  request.fail(function(jqXHR, textStatus) {
    console.log("Request failed: " + textStatus);
  });

}

// function to post new comments
function postComment(text) {

  var data = JSON.stringify({
    url: url,
    text: text,
    isPrivate: false
  });

  var request = $.ajax({
    url: server + '/api/comments/add',
    method: "POST",
    contentType: "application/json",
    data: data,
    dataType: 'json'
  });

  request.done(function(msg) {
    // compile and append successfully saved and returned message to DOM
    compileAppendComments(msg.comments);
  });

  request.fail(function(jqXHR, textStatus) {
    alert("Request failed: " + textStatus);
  });
}


function compileAppendComments(comments) {
  var source = $("#comment-entry-template").html();
  var template = Handlebars.compile(source);
  var html = template(comments);
  $(".cd-panel-content").append(html);
}
