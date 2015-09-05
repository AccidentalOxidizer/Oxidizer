/**
 * For maximum compatibility and avoiding conflicts:
 * No 3rd party libs, not even jQuery for DOM manipulation, templating, etc
 **/

// TODO: 
/*
PRIVATE / PUBLIC:
User should be able to quickly and easily switch between private site annotaitons and public page comments.
This should trigger 
1. Refresh content from server
2. Rerendering of content on ALL tabs.

DEFAULTS:
If user changes defaults in options, this should be reflected accordingly on tab load.
This means:
1. Add eventListener for chrome storage change 
2. Render accordingly on NEW tab, but not on update of existing tab
3. -> this is to ensure user can still switch between private & public even on tab refresh

DATA:
1. We need to hook up GET & POST calls from extension with the correct routes of backend
2. We need to ensure that GET & POST data handled by server corresponds with public / private setting of request
3. Chrome Extension should save incoming data in chrome storage or in local cookie (including time stamp of data received)
4. We should aim at implementing a Redis layer for comparing timestamps and only sending new data if new content can be sent
5. Above needs to wotk for public and private content.
*/

// content script running for each chrome tab window injected by the extension rust.js


var url = document.location.href;
var dataAttribute = 'data-rust-identity';
var dataAttributeValue = 'identity';
var rustTag = 'data-rust-css="rustful"';

// remove DOM element from previous calls
var cleanDOM = function() {
  var old = document.querySelector('[data-rust-identity="identity"]') || undefined;
  if (old !== undefined) {
    document.body.removeChild(old);
  }
};

var parseDate = function(dateString) {
  var dateObj = new Date(dateString);
  var locale = "en-us";
  var month = dateObj.getMonth();
  var day = dateObj.getDate();
  var year = dateObj.getYear() % 100;
  var hour = dateObj.getHours();
  var amOrPm;
  if (hour > 11) {
    amOrPm = 'PM';
  } else {
    amOrPm = 'AM';
  }
  hour = hour % 12;
  if (hour === 0) {
    hour = 12;
  }
  var minute = dateObj.getMinutes();
  return {
    time: [hour, ':', minute, ' ', amOrPm].join(''),
    date: [month, '/', day, '/', year].join('')
  };
};

// builds data-rust-type="value"
var buildSelector = function(value, type) {
  type = type || 'identity';
  return ['data-rust-', type, '="', value, '"'].join('');
};

// we can't use handlebars / hogan for mustache due to chrome security limitations 
var templating = function(comments) {
  var comment;
  var timestamp;
  var result = '<div ' + rustTag + dataAttribute + '="commentcontainer">';
  for (var i = comments.length - 1; i >= 0; i--) {
    comment = comments[i];
    timestamp = parseDate(comment.createdAt);
    result += [
      '<div ', rustTag, buildSelector('comment'), '>',
      '<div ', rustTag, buildSelector('toprow'), '>',
      '<div ', rustTag, buildSelector('username'), '>', comment.User.name, '</div>',
      '<div ', rustTag, buildSelector('datetime'), '>',
      '<div ', rustTag, buildSelector('time'), '>', parseDate(comment.createdAt).time, '</div>',
      '<div ', rustTag, buildSelector('date'), '>', parseDate(comment.createdAt).date, '</div>',
      '</div>',
      '<div ', rustTag, buildSelector('commenttext'), '>', comment.text, '</div>',
      '<div ', rustTag, buildSelector('flags'), '>',
      '<div ', rustTag, buildSelector('heart'), '></div>',
      '<div ', rustTag, buildSelector('flag'), '></div>',
      '</div>',
      '</div>', '<br>',
      '</div>'
    ].join('');
  }
  result += '</div>';
  return result;
};

var addExpandButton = function(html) {
  html = '<div ' + rustTag + ' ' + buildSelector('rustbody') + ' ' + buildSelector('hide', 'show') + '>' + html;
  html += '</div><div ' + rustTag + ' ' + buildSelector('expandcontainer') + 'data-rust-show="show"><svg><polygon ' + rustTag + ' ' + dataAttribute + '="expand" points="20,0 0,20, 20,20"/></svg><div>';
  return html;
};

// add input field functionlity to html output
var inputField = function(html) {
  var inputElement = '<div ' + rustTag + " " + buildSelector('input') + '><input ' + rustTag + buildSelector('inputfield') + ' type="text" name="comment"/><div ' + rustTag + buildSelector('submit-comment') + '>Submit</div></div>';
  html += inputElement;
  return html;
};

// append final html output to DOM (ideall, we first do the container once globally, then the content.)
var appendToDOM = function(html) {
  var section = document.createElement('section');
  section.setAttribute(dataAttribute, dataAttributeValue);
  section.setAttribute('data-rust-css', 'rustful');
  section.setAttribute('data-rust-show', 'hide');
  section.className += 'rust cleanslate';
  section.innerHTML = html;
  document.body.appendChild(section);
};

// directly append the new comment which was submitted to server
var appendNewCommentToDom = function(html) {
  var rust = document.querySelector('[data-rust-identity="identity"]');
  rust.querySelector('[data-rust-identity="commentcontainer"]').insertAdjacentHTML('beforeend', '<div class="ownChild">' + html + '</div>');
};

// register all the events chrome needs to handle
var registerEventListeners = function() {
  var rust = document.querySelector('[data-rust-identity="identity"]');

  // returns an HTML element given value and type (type is optional and defaults to identity): '[data-rust-type="value"]' 
  var dataSelector = function(parentNode, value, type) {
    type = type || 'identity';
    var selector = buildSelector(value, type);
    console.log(selector);
    return rust.querySelector('[' + selector + ']');
  };

  rust.querySelector('[data-rust-identity="input"]').addEventListener('keydown', function(e) {
    // if user hits enter key
    if (e.keyCode === 13) {
      var text = document.querySelector('[data-rust-identity="inputfield"]').value;
      // Only proceed if text is not empty
      if (text !== '') {
        // send message to background script rust.js with new coment data tp be posted to server
        chrome.runtime.sendMessage({
          type: 'post',
          url: url,
          text: text,
          isPrivate: false
        }, function(response) {
          // TODO: We might need some error handling here if we don't have a valid response object!
          // background script rust.js should return the server response
          //reuse templating for new comment (needs to be in an array)
          var html = templating(response.data.comments);
          // Append new message 
          appendNewCommentToDom(html);
          // Reset input field
          document.getElementById('rustsubmit').value = '';
        });
      }
    }
  });

  //expand comments section when clicking expando button
  rust.querySelector('[data-rust-identity="expand"]').addEventListener('mouseover', function(evt) {
    var rustBody = rust.querySelector('[data-rust-identity="rustbody"]');
    var expandButton = rust.querySelector('[data-rust-identity="expandcontainer"]');
    if (rustBody.dataset.rustShow === 'hide') {
      rustBody.dataset.rustShow = 'show';
      expandButton.dataset.rustShow = 'hide';
    }
  });

  dataSelector(rust, 'rustbody').addEventListener('mouseleave', function(evt) {
    if (evt.toElement !== null) {
      var rustBody = rust.querySelector('[data-rust-identity="rustbody"]');
      var expandButton = rust.querySelector('[data-rust-identity="expandcontainer"]');
      if (rustBody.dataset.rustShow === 'show') {
        rustBody.dataset.rustShow = 'hide';
        expandButton.dataset.rustShow = 'show';
      }
    }
  });
};


/* MAGIC HAPPENS HERE */
// send 'init' message with url to the chome extension (rust.js) when loaded
chrome.runtime.sendMessage({
  type: 'init',
  url: url
}, function(response) {
  if (response.data.comments) {
    console.log('Response:', response);
    // remove DOM artifacts
    cleanDOM();
    // For demo: add user name if logged in. Makes not much sense like this
    var html = '';
    // if (response.data.userInfo.name) {
    //   html = '<div>Hello, ' + response.data.userInfo.name + '</div>';
    // }
    // templating
    html += templating(response.data.comments);
    // add input field
    html = inputField(html);
    // add expand button
    html = addExpandButton(html);
    // append to document
    appendToDOM(html);
    // register event listeners for user input
    registerEventListeners();
  }
});