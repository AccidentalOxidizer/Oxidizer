var settings = {};
var url = '';

// Boolean: true if commenting privately; false if public.
// Initialized to 'keepprivate' value set in options; updated according to
// privacy select option.
var commentPrivately;

// Boolean: true to see private comment feed; false to see public.
// Also initialized to 'keepprivate' options value.
var privateFeed;

// requestReturned tracks if we have a pending http request so that we don't receive back the same comments twice
// tracking.mainLastComment - id tracks last comments we've retrieved for main thread, endOfComments tracks if we've returned all of the comments there are. When we get replies, we will set a key with the comments id and a value of the last loaded reply
var tracking = {
  requestReturned: true,
  mainLastComment: {
    id: null,
    endOfComments: false
  }
};


document.addEventListener("DOMContentLoaded", function(e) {

  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    // DEBUG
    if (request.from === 'contentscript' && request.message === 'debug') {
      console.log('message events intercepted in iframe:', request);
      sendResponse({
        from: 'iframe',
        message: 'debug'
      });
    }
  });

  // when ever we have a trigger event from the parent window 
  // it will tell the iframe to reload and redo what is needed
  // on 'open' we get 2 pieces of information from the parent content script:
  // 1. the URL of the parent window
  // 2. the extension settings, which includes the server information 
  window.addEventListener("message", function(e) {
    if (e.data.type === 'open') {
      url = e.data.url;
      settings = e.data.settings;

      // if iframe received contentscript open postMessage, route a message back via background script
      // to tell contenscript it's ok to show iframe & once contenscript finished, start animation and load content
      chrome.runtime.sendMessage({
          from: 'iframe',
          message: 'ok',
          details: 'successfully received open postMessage from contentscript'
        },
        function(response) {
          // Set default value for comment privacy, public vs private feed,
          // and dropdown selections.
          commentPrivately = settings.keepprivate;
          privateFeed = settings.keepprivate;

          var privacyText = commentPrivately ? 'Private' : 'Public';
          $('#comment-privacy-select').parents('.dropup').find('.btn-privacy').html(privacyText + ' <span class="caret"></span>');
          $('#feed-privacy-select').parents('.dropdown').find('.dropdown-toggle').html(privacyText + ' Feed <span class="caret"></span>');

          // show the panel with animation
          document.getElementById('panel').classList.add('is-visible');
          // do what needs to be done. load content, etc..
          loadContent(url);
        });
    }
  }, false);

  window.addEventListener("message", function(e) {
    if (e.data.type === 'close') {
      document.getElementById('panel').classList.remove('is-visible');
    }
  }, false);


  // send message to background script to tell content script to close this iframe
  document.getElementById('close').addEventListener('click', function() {
    document.getElementById('panel').classList.remove('is-visible');
    chrome.runtime.sendMessage({
      from: 'iframe',
      message: 'close iframe'
    }, function() {});
  });

  document.getElementById('dismiss-notifications').addEventListener('click', function() {
    dismissNotifications();
    // SEND MESSAGE TO SERVER TO SET TO ZERO

  })

  // Update the feed privacy setting if the user changes it in the dropdown menu.
  $('#feed-privacy-select li a').click(function() {
    var selectedText = $(this).text();

    if (selectedText === 'Private Feed') {
      privateFeed = true;
    } else {
      privateFeed = false;
    }
    console.log('feed privacy set to ' + selectedText + ' privateFeed ' + privateFeed);
    $(this).parents(".dropdown").find('.dropdown-toggle').html(selectedText + ' <span class="caret"></span>');

    // reload the feed with the updated setting.
    loadContent(url);
  });

  // Post new comment
  document.getElementById('comment-input-field').addEventListener('keydown', function(e) {
    if (e.keyCode === 13) {
      postComment(document.getElementById('comment-input-field').value);
      document.getElementById('comment-input-field').value = '';
    }
  });

  // Update the privacy setting if the user changes it in the dropup menu.
  $('#comment-privacy-select li a').click(function() {
    var selectedText = $(this).text();

    if (selectedText === 'Private') {
      commentPrivately = true;
    } else {
      commentPrivately = false;
    }
    console.log('comment privacy set to ' + selectedText + ' commentPrivately ' + commentPrivately);
    $(this).parents(".dropup").find('.btn-privacy').html(selectedText + ' <span class="caret"></span>');
  });

  document.getElementById('comment-submit-button').addEventListener('click', function() {
    postComment(document.getElementById('comment-input-field').value);
    document.getElementById('comment-input-field').value = '';
  });

  // sends request for new comments when we get to the bottom of comments
  document.querySelector('.cd-panel-content').addEventListener('scroll', function(e) {

    var commentContainer = document.getElementsByClassName('cd-panel-content')[0];

    // calculates how much space is left to scroll through the comments
    var spaceLeft = commentContainer.scrollHeight - (commentContainer.clientHeight + commentContainer.scrollTop);

    //if we are towards the bottom of the div, and we haven't gotten all comments, and we don't have a pending request
    if (spaceLeft < 300) {
      // toggle requestReturned so that we don't send two requests concurrently
      loadMoreComments($(".cd-panel-content"), url);
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
    isPrivate: privateFeed
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
    console.log('GET ALL:', msg);

    if (msg.userInfo.heartsToCheck > 0 ||
      msg.userInfo.repliesToCheck > 0) {
      console.log('fave of replies!');
      setNotifications(msg.userInfo.heartsToCheck, msg.userInfo.repliesToCheck);
    } else {
      console.log('no notifications..');
      setNotifications(null, null);
    }

    tracking.requestReturned = true;
    if (msg.comments.length > 0) {
      tracking.mainLastComment.id = msg.comments[msg.comments.length - 1].id;
    }

    // We load 25 comments per request, so if we loaded less than
    // this amount (including 0), we've finished loading all the comments.
    if (msg.comments.length < 25) {
      tracking.mainLastComment.endOfComments = true;
    } else {
      tracking.mainLastComment.endOfComments = false;
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
    isPrivate: commentPrivately
  });

  var request = $.ajax({
    url: settings.server + '/api/comments/add',
    method: "POST",
    contentType: "application/json",
    data: data,
    dataType: 'json'
  });

  request.done(function(msg) {
    // compile and append successfully saved and returned message to DOM
    var html = compileComments(msg.comments);

    if (!repliesToId) {
      $(".cd-panel-content").prepend(html);
    } else {
      $(repliesToId).append(html);
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

// destination is a jquery object that you want to append to
function loadMoreComments(destination, url, repliesToId) {
  // if not a reply, don't execute if we are at end of comments, or waiting for a request to return
  if (repliesToId === undefined && (tracking.mainLastComment.endOfComments || !tracking.requestReturned)) {
    console.log(tracking.mainLastComment.endOfComments, tracking.requestReturned);
    return;
  }

  if (repliesToId && tracking[repliesToId])
    if (tracking[repliesToId].endOfComments || !tracking.requestReturned) {
      return;
    }

  var params = {
    url: encodeURIComponent(url),
    isPrivate: privateFeed
  };

  if (repliesToId !== undefined) {
    // check if we've received comments, and add to params if we have a lastCommentId to send
    if (tracking[repliesToId] !== undefined) {
      params.lastCommentId = tracking[repliesToId].id;
    } else {
      tracking[repliesToId] = {
        endOfComments: false
      }
    }
    params.repliesToId = repliesToId;
  } else {
    if (tracking.mainLastComment.id) {
      params.lastCommentId = tracking.mainLastComment.id;
    }
  }

  var paramString = [];
  for (var key in params) {
    if (params.hasOwnProperty(key)) {
      paramString.push(key + '=' + params[key]);
    }
  }

  paramString = paramString.join('&');
  var apiURL = settings.server + "/api/comments/get?" + paramString;

  tracking.requestReturned = false;
  var request = $.ajax({
    url: apiURL,
    method: "GET",
    contentType: "application/json",
  });

  request.done(function(msg) {
    tracking.requestReturned = true;

    // set lastLoadedCommentId
    if (repliesToId === undefined) {
      if (msg.comments.length > 0) {
        tracking.mainLastComment.id = msg.comments[msg.comments.length - 1].id;
      }

      // We load 25 comments per request, so if we loaded less than
      // this amount (including 0), we've finished loading all the comments.
      if (msg.comments.length < 25) {
        tracking.mainLastComment.endOfComments = true;
      } else {
        tracking.mainLastComment.endOfComments = false;
      }
    } else {
      if (msg.comments.length > 0) {
        tracking[repliesToId].id = msg.comments[msg.comments.length - 1].id;
      }

      // Same logic regarding comment loads, but for the reply tracking.
      if (msg.comments.length < 25) {
        tracking[repliesToId].endOfComments = true;
      } else {
        tracking[repliesToId].endOfComments = false;
      }
    }

    $('.reply-count').text(msg.userInfo.repliesToCheck);
    $('.like-count').text(msg.userInfo.heartsToCheck);

    // compile and append new comments
    var html = compileComments(msg.comments);
    destination.append(html);
    registerCommentEventListeners();
  });

  request.fail(function(jqXHR, textStatus) {
    console.log("Request failed: " + textStatus);
  });
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
    var $replyForm = $(replyForms[i]);

    $replyForm.find('.reply-button').off('click').on('click', function() {
      console.log('reply clicked...');

      // get input text
      var text = $(this).parents('.reply-form').find('.reply-input').val();
      // clear text field
      $(this).parents('.reply-form').find('.reply-input').val('');
      // get id of what we're replying to
      var repliesToId = $(this).parents('.reply-form').attr('data-comment-id');

      // send to the server
      postComment(text, repliesToId);
    });

    $(replyForms[i]).find('.reply-input').off('keydown').on('keydown', function(e) {

      if (e.keyCode === 13) {
        console.log('enter pressed .. ');
        // get input text
        var text = $(this).val();
        //reset the input field
        $(this).val('');
        // get the commentId that we're replying to
        var repliesToId = $(this).parents('.reply-form').attr('data-comment-id');
        // post it!
        postComment(text, repliesToId);
      }
    });
  }

  // get elements 
  var showReplies = document.getElementsByClassName('replies');

  for (var i = 0; i < showReplies.length; i++) {
    $(showReplies[i]).off('click').on('click', function() {

      var target = $(this).parents('.comment');
      var repliesToId = $($(this)[0]).attr('data-comment-id');

      var thisComment = $(this).parents('.comment');
      var replies = thisComment.find('.comment');

      // toggle whether
      if (replies.length > 0) {
        if (!$(replies[0]).hasClass('hidden')) {
          $(replies).addClass('hidden')
        } else {
          $(replies).removeClass('hidden')
          loadMoreComments(target, url, repliesToId);
        }
      } else {
        loadMoreComments(target, url, repliesToId);
      }
    });
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

function setNotifications(favs, replies) {
  //testing:
  favs = 1, replies = 1;
  if (!favs && !replies) {
    dismissNotifications();
    // document.getElementById('notifications').classList.add('disabled');
    // document.querySelector('#notifications > i').classList.remove('fa-bell notifications');
    // document.querySelector('#notifications > i').classList.add('fa-bell-o');
    // document.querySelector('a.favs').classList.add('hidden');
    // document.querySelector('a.replies').classList.add('hidden');

  } else {
    document.getElementById('notifications').classList.remove('disabled');
    document.querySelector('#notifications > i').classList.add('fa-bell')
    document.querySelector('#notifications > i').classList.add('notifications');
    document.querySelector('#notifications > i').classList.remove('fa-bell-o');

    if (favs > 0) {
      document.querySelector('a.favs').classList.remove('hidden');
    }
    if (replies > 0) {
      document.querySelector('a.replies').classList.remove('hidden');
    }

  }
}

function dismissNotifications() {
  document.getElementById('notifications').classList.add('disabled');
  document.querySelector('a.favs').classList.add('hidden');
  document.querySelector('a.replies').classList.add('hidden');
  document.querySelector('#notifications > i').classList.remove('fa-bell')
  document.querySelector('#notifications > i').classList.remove('notifications');
  document.querySelector('#notifications > i').classList.add('fa-bell-o');
  // SEND MESSAGE TO SERVER TO SET TO ZERO

}

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