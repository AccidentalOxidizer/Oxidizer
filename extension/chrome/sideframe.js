var settings = {};
var url = '';

// Boolean: true to see private comment feed and to make private
// comments; false to see public. Initialized to 'keepprivate' options value.
var privateFeed;

// Boolean: true if sorting comments from most favorited to least;
// otherwise sorts from most recent to least. Defaults to sorting by date.
var sortByFaves = false;

// Boolean: true if sorting comments from most comments to least;
// Defaults to sorting by date.
var sortByReplies = false;

// requestReturned tracks if we have a pending http request so that we don't receive back the same comments twice
// tracking.mainLastComment:
//    - id tracks the id of the last comment we've retrieved for main thread;
//      only applicable if not sorting by faves or replies
//    - endOfComments tracks if we've returned all of the comments there are. 
//      When we get replies, we will set a key with the comments id and a value of the last loaded reply
// commentOffset: used for segmented loading in order of descending popularity, 
//    when we can't sort by comment id, when sorting by faves or replies
var tracking = {
  requestReturned: true,
  mainLastComment: {
    id: null,
    endOfComments: false
  },
  commentOffset: 0
};


document.addEventListener("DOMContentLoaded", function(e) {

  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    // DEBUG
    if (request.from === 'contentscript' && request.message === 'debug') {
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
          privateFeed = settings.keepprivate;

          var privacyText = privateFeed ? '<i class="fa fa-lock"></i> Private' : '<i class="fa fa-globe"></i> Public';
          $('#comment-privacy-select').parents('.dropup').find('.btn-privacy').html(privacyText + ' <span class="caret"></span>');
          $('#feed-privacy-select').parents('.dropdown').find('.dropdown-toggle').html(privacyText + ' Feed <span class="caret"></span>');
          $("#comment-submit-button").prop("disabled",true); // Disable the submit button since there is zero content.

          // Set default display for sort select.
          $('#sort-by-select').parents('.dropdown').find('.dropdown-toggle').html('<i class="fa fa-calendar-check-o"></i> Date <span class="caret"></span>');

          // show the panel with animation
          document.getElementById('panel').classList.add('is-visible');
          // put focus on input field
          $('#comment-input-field').focus();
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

  // close Oxidizer IFrame Window when hitting Esc key
  document.addEventListener('keydown', function(e) {
    if (e.keyCode === 27) {
      closeOxidizer();
    }
  });


  /**
   * The next four listeners coordinate the selections of public vs.
   * comment posting and display.
   */
  var setPublicComments = function() {
    privateFeed = false;
    $(document.body).find('.dropdown-privacy').html('<i class="fa fa-globe"></i> Public Feed <span class="caret"></span>');
    $(document.body).find('.btn-privacy').html('<i class="fa fa-globe"></i> Public <span class="caret"></span>');

    // reload the feed with the updated setting.
    loadContent(url);
  };

  var setPrivateComments = function() {
    privateFeed = true;
    $(document.body).find('.dropdown-privacy').html('<i class="fa fa-lock"></i> Private Feed <span class="caret"></span>');
    $(document.body).find('.btn-privacy').html('<i class="fa fa-lock"></i> Private <span class="caret"></span>');

    // reload the feed with the updated setting.
    loadContent(url);
  };

  document.getElementById('feed-public').addEventListener('click', function() {
    setPublicComments();
  });

  document.getElementById('feed-private').addEventListener('click', function() {
    setPrivateComments();
  });

  document.getElementById('comment-public').addEventListener('click', function() {
    setPublicComments();
  });

  document.getElementById('comment-private').addEventListener('click', function() {
    setPrivateComments();
  });


  /**
   * The next three listeners handle the selection of order to
   * sort the comments: date (newest to oldest), popularity (most
   * favorites to least), replies (most replies to least).
   */
  document.getElementById('sort-date').addEventListener('click', function() {
    sortByFaves = false;
    sortByReplies = false;
    $('#sort-by-select').parents('.dropdown').find('.dropdown-toggle').html('<i class="fa fa-calendar-check-o"></i> Date <span class="caret"></span>');

    // reload the feed with the updated setting.
    loadContent(url);
  });

  document.getElementById('sort-faves').addEventListener('click', function() {
    sortByFaves = true;
    sortByReplies = false;
    $('#sort-by-select').parents('.dropdown').find('.dropdown-toggle').html('<i class="fa fa-heart-o"></i> Popular <span class="caret"></span>');

    // reload the feed with the updated setting.
    loadContent(url);
  });

  document.getElementById('sort-replies').addEventListener('click', function() {
    sortByFaves = false;
    sortByReplies = true;
    $('#sort-by-select').parents('.dropdown').find('.dropdown-toggle').html('<i class="fa fa-commenting-o"></i> Replies <span class="caret"></span>');

    // reload the feed with the updated setting.
    loadContent(url);
  });


  // close Oxidizer IFrame Window when when clicking close button 
  document.getElementById('close').addEventListener('click', closeOxidizer);

  document.getElementById('dismiss-notifications').addEventListener('click', function() {
    var request = $.ajax({
      url: settings.server + '/api/user/notifications/markread',
      method: "GET",
      contentType: "application/json",
    });
    request.success(function(msg) {
      dismissNotifications();
    });
    request.fail(function(err) {
      console.log('Darn, could not mark notifications as read :/ ', err);
    });
  });


  // Reigster all elements with class 'link' to ahve click event and open new tab with target href
  registerLinks();

  // Post new comment
  document.getElementById('comment-input-field').addEventListener('keydown', function(e) {
    // Check if length is 0 and disable post button.
    var getTextLength = document.getElementById('comment-input-field').value.length;

    if (getTextLength === 0) {
      $("#comment-submit-button").prop("disabled",true);
    } else {
      $("#comment-submit-button").prop("disabled",false);
    }

    if (e.keyCode === 13 && getTextLength > 0) {
      postComment(document.getElementById('comment-input-field').value);
      document.getElementById('comment-input-field').value = '';
      $("#comment-submit-button").prop("disabled",true); // Disable the submit button since there is zero content.
    }
  });

  document.getElementById('comment-submit-button').addEventListener('click', function() {
    postComment(document.getElementById('comment-input-field').value);
    document.getElementById('comment-input-field').value = '';
  });

  // sends request for new comments when we get to the bottom of comments
  document.querySelector('.panel-content-wrapper').addEventListener('scroll', function(e) {
    var commentContainer = document.getElementsByClassName('panel-content-wrapper')[0];
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
      // console.log('iframe callback message:', response);
    });
});


/**
 * Handles loading an initial set of comments. Called if any
 * setting changes that would affect the set or order of 
 * questions to be displayed (e.g. public v.s. private comments,
 * sort by date v.s. popularity).
 */
function loadContent(url) {
  var params = {
    url: encodeURIComponent(url),
    isPrivate: privateFeed
  };

  // if sorting by favorites:
  if (sortByFaves) {
    tracking.commentOffset = 0;
    params.orderByHearts = 'DESC';
    params.commentOffset = tracking.commentOffset;
  }

  // if sorting by replies:
  if (sortByReplies) {
    tracking.commentOffset = 0;
    params.orderByReplies = 'DESC';
    params.commentOffset = tracking.commentOffset;
  }

  var paramString = [];
  for (var key in params) {
    if (params.hasOwnProperty(key)) {
      paramString.push(key + '=' + params[key]);
    }
  }

  paramString = paramString.join('&');
  var apiURL = settings.server + "/api/comments?" + paramString;

  toggleSpinner();

  var request = $.ajax({
    url: apiURL,
    method: "GET",
    contentType: "application/json",
  });

  request.success(function(msg) {

    // set notification alert if we have any new replies or favs on comments
    if (msg.userInfo.heartsToCheck > 0 ||
      msg.userInfo.repliesToCheck > 0) {
      setNotifications(msg.userInfo.heartsToCheck, msg.userInfo.repliesToCheck);
    } else {
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

    if (sortByFaves || sortByReplies) {
      tracking.commentOffset += msg.comments.length;
    }

    // clean the DOM
    $(".cd-panel-content").html('');
    // compile and append new comments

    var html = compileComments(msg);


    $(".cd-panel-content").append(html);
    registerCommentEventListeners();

  });

  request.fail(function(jqXHR, textStatus) {
    console.log("Request failed: ", jqXHR.status, textStatus);
  });

  request.complete(function(jqXHR, textStatus) {
    toggleSpinner();
    if (jqXHR.status === 401) {
      loginButtons(true);
    } else {
      loginButtons(false);
    }
  });

}


/**
 * Handles posting of both new comments and new replies 
 * to existing comments.
 * @param text: required, content of the comment to post.
 * @param repliesToId: optional, if present, indicates the
 *    id number of the comment this post is in response to.
 */
function postComment(text, repliesToId) {
  toggleSpinner();
  var data = JSON.stringify({
    url: url,
    text: text,
    repliesToId: repliesToId || undefined,
    isPrivate: privateFeed
  });

  var request = $.ajax({
    url: settings.server + '/api/comments/add',
    method: "POST",
    contentType: "application/json",
    data: data,
    dataType: 'json'
  });

  request.success(function(msg) {
    // compile and append successfully saved and returned message to DOM
    var html = compileComments(msg);

    if (!repliesToId) {
      $(".cd-panel-content").prepend(html);
    } else {
      // If replies are hidden && reply-container has no 
      // children, we can trigger a click to load any existing
      // comments + the new one we just made.
      //
      // Else if replies are hidden && reply-container *does* 
      // have children, we can still trigger a click, to make
      // the reply elements shown; but we also need to prepend
      // the comment we just made.
      //
      // Else, i.e., replies not hidden, just prepend the 
      // comment we just made.
      var comment = $('#' + repliesToId);
      var replies = comment.find('.reply-container');
      var firstReply = replies.find('.comment-reply:first-child');

      if (!replies.hasClass('hidden') || replies.children().length > 0) {
        if (firstReply.length > 0) {
          // prepend to existing replies
          firstReply.before(html);
        } else {
          replies.append(html);
        }
      }

      if (replies.hasClass('hidden')) {
        var showReplies = comment.find('.replies');
        showReplies.trigger('click');
      } 

      var ReplyCount = Number($('#' + repliesToId +' .ReplyCount').html())+1;
      $('#' + repliesToId +' .ReplyCount').html(ReplyCount);
    }
    registerCommentEventListeners();
  });

  request.fail(function(jqXHR, textStatus) {
    console.log("Request failed: " + textStatus);
  });

  request.complete(function(jqXHR, textStatus) {
    toggleSpinner();
    if (jqXHR.status === 401) {
      loginButtons(true);
    } else {
      loginButtons(false);
    }
  });
}

/**
 * Prepares the msg content to be fed into the Handlebars
 * template, and return the templating result.
 */
function compileComments(msg) {
  var source = $("#comment-entry-template").html();
  var template = Handlebars.compile(source);

  // Iterate over array of comments and search for anything that appears
  // to be an image link using a regex pattern. If we find a match, replace
  // the text with an image tag and a link.
  msg.comments.forEach(function(element) {
    // RegEx for matching image URLs
    var imagePattern = /\b(https?:\/\/\S+(?:png|jpe?g|gif)\S*)\b/igm;

    // Create an array of matching image URLs
    var isImageLink = element.text.match(imagePattern);

    // Let's eliminate any duplicate items in our array so things don't get too crazy.
    // Also, if we have the same URL In our array multiple times, things will break!
    if (isImageLink !== null && isImageLink.length > 0) {
      // Create an array of nonDuplicate image links.
      var nonDuplicateImages = [];
      isImageLink.forEach(function(element, index) {
        if (nonDuplicateImages.indexOf(element) === -1) {
          nonDuplicateImages.push(element);
        }
      });

      // Iterate through our array of unique URLs and replace matching image URLs
      // with HTML img tags.
      nonDuplicateImages.forEach(function(imageLink) {
        // Since we want to replace all instances of the URL,
        // we need to create a regEx object and tell it to look
        // for all instances that match within the string using the "/g" modifier.
        var replaceURL = new RegExp(imageLink, 'g');
        element.text = element.text.replace(replaceURL, '<p class="image-display"><img src="' + imageLink + '" style="max-width: 450px;"/></p>');
      });
    }
  });

  // Include access to the host value to build url to link to user profiles.
  msg.host = settings.server;

  return template(msg);
}


/**
 * Handles loads of comments, when fetching sets past an initializing set.
 * Also responsible for all loads of replies.
 * @param destination: required, jQuery object to append comments to.
 * @param url: required, the url that we are loading comments for.
 * @param repliesToId: optional, if present, indic
 * @param repliesToId: optional, if present, indicates the
 *    id number of the comment we are loading replies to.
 */
function loadMoreComments(destination, url, repliesToId) {
  // if not a reply, don't execute if we are at end of comments, or waiting for a request to return
  if (repliesToId === undefined && (tracking.mainLastComment.endOfComments || !tracking.requestReturned)) {
    return;
  }

  if (repliesToId && tracking[repliesToId]){
    if (tracking[repliesToId].endOfComments || !tracking.requestReturned) {
      return;
    }
  }
  
  toggleSpinner();
  
  var params = {
    url: encodeURIComponent(url),
    isPrivate: privateFeed
  };

  // if sorting by favorites:
  if (sortByFaves) {
    params.orderByHearts = 'DESC';
    params.commentOffset = tracking.commentOffset;
  }

  // if sorting by replies:
  if (sortByReplies) {
    params.orderByReplies = 'DESC';
    params.commentOffset = tracking.commentOffset;
  }

  if (repliesToId !== undefined) {
    // check if we've received comments, and add to params if we have a lastCommentId to send
    if (tracking[repliesToId] !== undefined) {
      params.lastCommentId = tracking[repliesToId].id;
    } else {
      tracking[repliesToId] = {
        endOfComments: false
      };
    }
    params.repliesToId = repliesToId;
  } else {
    // Don't set the lastCommentId if sorting by favorites or replies,
    // because it incorrectly limits the comments returned to be older than 
    // the id of the last comment returned.
    if (tracking.mainLastComment.id && !(sortByFaves || sortByReplies)) {
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
  var apiURL = settings.server + "/api/comments?" + paramString;

  tracking.requestReturned = false;

  var request = $.ajax({
    url: apiURL,
    method: "GET",
    contentType: "application/json",
  });

  request.success(function(msg) {
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

      if (sortByFaves || sortByReplies) {
        tracking.commentOffset += msg.comments.length;
      }
    } else {
      if (msg.comments.length > 0) {
        tracking[repliesToId].id = msg.comments[msg.comments.length - 1].id;
      }
      // Same logic regarding comment loads, but for the reply tracking.
      // Also, if we haven't loaded all the replies yet, show
      // the link to load additional replies.
      // Assumes that the reply container is currently visible.
      //  - true for case coming from 'show reply' click, b/c
      //    loadMoreComments only called if reply container !hidden
      //  - true for case coming from 'show more replies' if the
      //    above holds true, b/c this link only avail if container !hidden
      var comment = destination.parents('.comment');
      var loadMore = comment.find('.comment-reply-more');

      if (msg.comments.length < 25) {
        tracking[repliesToId].endOfComments = true;
        loadMore.addClass('hidden');
      } else {
        tracking[repliesToId].endOfComments = false;
        loadMore.removeClass('hidden');
      }
    }

    $('.reply-count').text(msg.userInfo.repliesToCheck);
    $('.like-count').text(msg.userInfo.heartsToCheck);

    // compile and append new comments
    var html = compileComments(msg);
    destination.append(html);
    registerCommentEventListeners();
  });

  request.fail(function(jqXHR, textStatus) {
    console.log("Request failed: " + textStatus);
  });

  request.complete(function(jqXHR, textStatus) {
    toggleSpinner();
    if (jqXHR.status === 401) {
      loginButtons(true);
    } else {
      loginButtons(false);
    }
  });

}


// EVENT LISTENERS
function registerCommentEventListeners(comment) {

  registerLinks();

  // or jquery : .off().on('click')
  var replies = document.getElementsByClassName('reply');
  for (var i = 0; i < replies.length; i++) {
    $(replies[i]).off('click').on('click', function() {
      var commentId = this.getAttribute('data-comment-id');
      $(this).toggleClass('active');
      $('#' + commentId + ' .reply-form').toggleClass('hidden');
      $('#' + commentId + ' .reply-input ').focus();
    });
  }

  var replyForms = document.getElementsByClassName('reply-form');
  for (var i = 0; i < replyForms.length; i++) {
    var $replyForm = $(replyForms[i]);

    $replyForm.find('.reply-button').off('click').on('click', function() {
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

  // Handle clicking to toggle display of a comment's replies.
  var showReplies = document.getElementsByClassName('replies');
  for (var i = 0; i < showReplies.length; i++) {
    $(showReplies[i]).off('click').on('click', function() {
      var comment = $(this).parents('.comment');
      var repliesToId = $($(this)[0]).attr('data-comment-id');
      var target = comment.find('.reply-container');
      var loadMore = comment.find('.comment-reply-more');

      if (target.hasClass('hidden')) {
        target.removeClass('hidden');
      } else {
        target.addClass('hidden');
        loadMore.addClass('hidden');
      }

      // if the target class is moved to be not hidden
      // on this toggle, try loading more comments
      if (!target.hasClass('hidden')) {
        loadMoreComments(target, url, repliesToId);
      }
    });
  }

  // Listen on clicks to request loading additional replies.
  var repliesMore = document.getElementsByClassName('replies-more');
  for (var i = 0; i < repliesMore.length; i++) {
    $(repliesMore[i]).off('click').on('click', function() {
      var comment = $(this).parents('.comment');
      var repliesToId = comment.attr('id');
      var target = comment.find('.reply-container');

      loadMoreComments(target, url, repliesToId);
    });
  }


  var removes = document.getElementsByClassName('delete');
  for (var i = 0; i < removes.length; i++) {
    $(removes[i]).off('click').on('click', function() {
      $('#confirm-modal').remove();
      var id = this.getAttribute('data-comment-id');
      var source = $("#confirm-flag-x-handlebars-template").html();
      var template = Handlebars.compile(source);
      var html = template({
        action: 'Are you sure you want to delete the comment?',
        modalId: 'confirm-modal',
        commentId: id
      });
      $('body').append(html);
      document.getElementById('confirm-flag').addEventListener('click', function() {
        deletePost(id);
      });
      $('#confirm-modal').modal();
    });
  };


  var flags = document.getElementsByClassName('flag');
  for (var i = 0; i < flags.length; i++) {
    $(flags[i]).off('click').on('click', function() {
      // remove modal from DOM that has been appended / used before.
      $('#confirm-modal').remove();
      var id = this.getAttribute('data-comment-id');
      var source = $("#confirm-flag-x-handlebars-template").html();
      var template = Handlebars.compile(source);
      var html = template({
        action: 'You are about to flag / unflag a comment. You sure?',
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
      var id = this.getAttribute('data-comment-id');
      favePost(id);
    });
  };
  //
}

// FUNCTIONS

function registerLinks() {
  var links = document.getElementsByClassName('link');
  for (var i = 0; i < links.length; i++) {
    if (links[i].nodeName === 'A') {
      $(links[i]).off('click').on('click', function() { 
        event.preventDefault();
        window.open(event.target.href);
      });
    }
  };
}

function setNotifications(favs, replies) {
  if (!favs && !replies) {
    dismissNotifications();
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
}

function flagPost(commentId) {
  // this function is called when user confirms flagging a comment
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
  request.success(function(msg) {
    $('#' + commentId + ' #flag i').toggleClass('fa-flag-o');
    $('#' + commentId + ' #flag i').toggleClass('fa-flag');
    // set a marker that prevents poping up confirmation for unflags
  });
  request.fail(function(err) {
    console.log("Awww, man. Couldn't flag! -- Dave", err);
  });
}

function favePost(commentId) {
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

  request.success(function(msg) {
    $('#' + commentId + ' #heart .HeartCount').html(msg.count);
    $('#' + commentId + ' #heart i').toggleClass('fa-heart-o');
    $('#' + commentId + ' #heart i').toggleClass('fa-heart');

  });
  request.fail(function(err) {
    console.log('Darn. something went wrong, could not fave comment', err);
  });
}

function deletePost(commentId) {
  var request = $.ajax({
    url: settings.server + '/api/comments/remove/' + commentId,
    method: "DELETE",
    contentType: "application/json"
  });

  request.done(function(msg) {
    document.getElementById(commentId).remove();
  });

  request.fail(function(err) {
    console.log('Darn. something went wrong, could not delete comment', err);
  });
}

function loginButtons(showLogin) {
  if (showLogin) {
    document.getElementById('notification-area').classList.remove('hidden');
  } else {
    document.getElementById('notification-area').classList.add('hidden');
  }
}

// toggle spinner 
function toggleSpinner() {
  $('.loading').toggleClass('spinner');
}

// close Oxidizer IFrame Window 
function closeOxidizer() {
  document.getElementById('panel').classList.remove('is-visible');
  //send message to background script to tell content script to close this iframe
  chrome.runtime.sendMessage({
    from: 'iframe',
    message: 'close iframe'
  }, function() {});
}

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


// if userInfo.userId === comments[i].UserId
Handlebars.registerHelper('ifSelf', function(v1, v2, options) {
  if (v1 === v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});



// EOF