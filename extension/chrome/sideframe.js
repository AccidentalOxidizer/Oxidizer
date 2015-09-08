var settings = {};

var server = 'http://localhost:3000'; // this is bad.
var url = '';

// tracks if we have a pending http request so that we don't receive back the same comments twice
var requestReturned = true;

document.addEventListener("DOMContentLoaded", function(e) {

  // when ever we have a trigger event from the parent window 
  // it will tell the iframe to reload and redo what is needed
  // on 'open' we get 2 pieces of information from the parent content script:
  // 1. the URL of the parent window
  // 2. the extension settings, which includes the server information 
  window.addEventListener("message", function(e) {
    if (e.data.type === 'open') {
      url = e.data.url;
      settings = e.data.settings;
      console.log(settings.server);
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
      postComment(document.getElementById('comment-input-field').value);
      document.getElementById('comment-input-field').value = '';
    }
  });

  document.getElementById('comment-submit-button').addEventListener('click', function() {
    postComment(document.getElementById('comment-input-field').value);
    document.getElementById('comment-input-field').value = '';
  });



  // sends request for new comments when we get to the bottom of comments
  document.querySelector('.cd-panel-content').addEventListener('scroll', function(e) {
    loadMoreComments(document.referrer);
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
  var apiURL = settings.server + "/api/comments/get?" + paramString;


  var request = $.ajax({
    url: apiURL,
    method: "GET",
    contentType: "application/json",
  });

  request.success(function(msg) {
    console.log(msg);

    if (msg.comments.length > 0) {
      lastLoadedCommentId = msg.comments[msg.comments.length - 1].id;
    }
    // clean the DOM
    $(".cd-panel-content").html('');
    // compile and append new comments

    var html = compileComments(msg.comments);

    $(".cd-panel-content").append(html);
    registerCommentEventListeners();
  });

  request.fail(function(jqXHR, textStatus) {
    console.log("Request failed: " + textStatus);
  });

}

// function to post new comments
function postComment(text, repliesToId) {

  var data = JSON.stringify({
    url: url,
    text: text,
    repliesToId: repliesToId || undefined,
    isPrivate: false
  });

  var request = $.ajax({
    url: settings.server + '/api/comments/add',
    method: "POST",
    contentType: "application/json",
    data: data,
    dataType: 'json'
  });

  request.done(function(msg) {
    console.log(msg.comments);
    // compile and append successfully saved and returned message to DOM
    var html = compileComments(msg.comments);
    console.log(msg.comments);
    console.log(msg.comments[0]);

    if (!repliesToId) {
      $(".cd-panel-content").prepend(html);
    } else {
      console.log(html);
    }
    registerCommentEventListeners();

  });

  request.fail(function(jqXHR, textStatus) {
    console.log("Request failed: " + textStatus);
  });
}


function compileComments(comments) {
  var source = $("#comment-entry-template").html();
  var template = Handlebars.compile(source);
  return template(comments);
}


function loadMoreComments(url) {
  var commentContainer = document.getElementsByClassName('cd-panel-content')[0];

  // tracks if we've gotten all of the comments
  var endOfComments = false;

  // calculates how much space is left to scroll through the comments
  var spaceLeft = commentContainer.scrollHeight - (commentContainer.clientHeight + commentContainer.scrollTop);

  //if we are towards the bottom of the div, and we haven't gotten all comments, and we don't have a pending request
  if (spaceLeft < 300 && !endOfComments && requestReturned) {

    // toggle requestReturned so that we don't send two requests concurrently
    requestReturned = false;

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
    var apiURL = settings.server + "/api/comments/get?" + paramString;


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
      var html = compileComments(msg.comments);
      $(".cd-panel-content").append(html);
      registerCommentEventListeners();
    });

    request.fail(function(jqXHR, textStatus) {
      console.log("Request failed: " + textStatus);
    });

  }
}


// EVENT LISTENERS
function registerCommentEventListeners(comment) {
  // or jquery : .off().on('click')
  var replies = document.getElementsByClassName('reply');
  for (var i = 0; i < replies.length; i++) {
    $(replies[i]).off('click').on('click', function() {
      var commentId = this.getAttribute('data-comment-id');
      console.log('Reply to: ', commentId);
      $(this).toggleClass('active');
      $(this).parents('#' + commentId).children('.reply-form').toggleClass('hidden');
    })
  }

  var replyForms = document.getElementsByClassName('reply-form');
  for (var i = 0; i < replyForms.length; i++) {
    $(replyForms[i]).find('.reply-button').off('click').on('click', function() {

      // replyForms[i].querySelector('.reply-button').addEventListener('click', function() {
      console.log('reply clicked...');
      // repliesToId
      // postComment(text, repliesToId);
      // repliesToId
      // isPrivate

    });
    $(replyForms[i]).find('.reply-input').off('keydown').on('keydown', function(e) {
      // replyForms[i].querySelector('.reply-input').addEventListener('keydown', function(e) {
      if (e.keyCode === 13) {
        console.log('enter pressed .. ');

      }
    });

    // reply-button
    // reply-input
  }

  var flags = document.getElementsByClassName('flag');
  for (var i = 0; i < flags.length; i++) {
    $(flags[i]).off('click').on('click', function() {
      // remove modal from DOM that has been appended / used before.
      $('#confirm-modal').remove();
      var id = this.getAttribute('data-comment-id');
      var source = $("#confirm-flag-x-handlebars-template").html();
      var template = Handlebars.compile(source);
      var html = template({
        modalId: 'confirm-modal',
        commentId: id
      });
      $('body').append(html);
      // we need an event listener in case user confirms the flag
      document.getElementById('confirm-flag').addEventListener('click', function() {
        flagPost(id);
      });
      $('#confirm-modal').modal();
    });
  };

  var hearts = document.getElementsByClassName('heart');
  for (var i = 0; i < hearts.length; i++) {
    $(hearts[i]).off('click').on('click', function() {
      console.log('heart clicked');
      var id = this.getAttribute('data-comment-id');
      // var faved = this.getAttribute('data-faved-state');
      favePost(id);
    });
  };
  //
}

// FUNCTIONS

function flagPost(commentId) {
  // this function is called when user confirms flagging a comment
  console.log('Comment to flag:', commentId);
  var data = JSON.stringify({
    CommentId: commentId
  });
  var request = $.ajax({
    url: settings.server + '/api/comments/flag',
    method: "POST",
    contentType: "application/json",
    data: data,
    dataType: 'json'
  });
  request.done(function(msg) {
    console.log('successfully flagged (or unflagged) comment', msg);
    // we should rerender can change the color of the flag, 
    // plus set a marker that prevents poping up confirmation for unflags
  });
  request.fail(function(err) {
    console.log("Awww, man. Couldn't flag! -- Dave", err);
  });
}

function favePost(commentId) {
  console.log('Comment to fave:', commentId);
  var data = JSON.stringify({
    CommentId: commentId
  });
  var request = $.ajax({
    url: settings.server + '/api/comments/fave',
    method: "POST",
    contentType: "application/json",
    data: data,
    dataType: 'json'
  });
  request.done(function(msg) {
    console.log('successfully faved (or unfaved) comment,', msg);

    // msg will contain info if faved or unfaved. 
    // we should toggle color and form of icon here.
    // <i class="fa fa-heart"></i>
    // <i class="fa fa-heart-o"></i>

  });
  request.fail(function(err) {
    console.log('Darn. something went wrong, could not fave comment', err);
  });
}


// repliesToId
// isPrivate

//  format an ISO date using Moment.js
//  http://momentjs.com/
//  moment syntax example: moment(Date("2011-07-18T15:50:52")).format("MMMM YYYY")
//  usage: {{dateFormat creation_date format="MMMM YYYY"}}
Handlebars.registerHelper('dateFormat', function(context, block) {
  if (window.moment) {
    var date = new Date(context);
    return moment(context).fromNow();

    // TO PARSE WITH A DATE USE MOMENT FORMATTING:
    // var f = block.hash.format || "MMM Do, YYYY";
    // return moment(Date(context)).format(f);
  } else {
    return context; //  moment plugin not available. return data as is.
  }
});
