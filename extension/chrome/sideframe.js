var server = 'http://api.oxidizer.io';
var url = '';

// tracks if we have a pending http request so that we don't receive back the same comments twice
var requestReturned = true;

document.addEventListener("DOMContentLoaded", function(e) {

  // when ever we have a trigger event from the parent window 
  // it will tell the iframe to reload and redo what is needed

  window.addEventListener("message", function(e) {
    if (e.data.type === 'open') {
      url = e.data.url;
      // show the panel with animation
      $('.cd-panel').addClass('is-visible');
      // do what needs to be done. load content, etc..
      loadContent(url);

    }
  }, false);

  window.addEventListener("message", function(e) {
    if (e.data.type === 'close') {
      $('.cd-panel').removeClass('is-visible');
    }
  }, false);


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
  // document.getElementsByClassName('heart').addEventListener('click', function() {});
  // document.getElementsByClassName('flag').addEventListener('click', function() {});



  // sends request for new comments when we get to the bottom of comments
  document.getElementById('comment-container').addEventListener('scroll', function() {
    var commentContainer = document.getElementsByClassName('comment-container');

    // tracks is we've gotten all of the comments
    var endOfComments = false;

    // calculates how much space is left to scroll through the comments
    var spaceLeft = commentContainer.scrollHeight - (commentContainer.clientHeight + commentContainer.scrollTop);

    //if we are towards the bottom of the div, and we haven't gotten all comments, and we don't have a pending request
    if (spaceLeft < 300 && !endOfComments && requestReturned) {

      // toggle requestReturned so that we don't send two requests concurrently
      requestReturned = false;

      var params = {
        url: encodeURIComponent(request.url),
        lastUpdateId: request.lastUpdateId,
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

        if (msg.comments.length === 0) {
          endOfComments = true;
        }
        // set lastLoadedCommentId
        if (msg.comments.length > 0) {
          lastLoadedCommentId = msg.comments[msg.comments.length - 1].id;
        }
        // compile and append new comments
        compileAppendComments(msg.comments);
      });

      request.fail(function(jqXHR, textStatus) {
        console.log("Request failed: " + textStatus);
      });

    }
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
    if (msg.comments.length > 0) {
      lastLoadedCommentId = msg.comments[msg.comments.length - 1].id;
    }
    // clean the DOM
    $(".cd-panel-content").html('');
    // compile and append new comments
    console.log(msg.comments);
    var html = compileComments(msg.comments);
    $(".cd-panel-content").append(html);
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
    console.log(msg.comments);
    // compile and append successfully saved and returned message to DOM
    var html = compileComments(msg.comments);
    $(".cd-panel-content").prepend(html);

  });

  request.fail(function(jqXHR, textStatus) {
    alert("Request failed: " + textStatus);
  });
}


function compileComments(comments) {
  var source = $("#comment-entry-template").html();
  var template = Handlebars.compile(source);
  return template(comments);
}
