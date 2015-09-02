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

// remove DOM element from previous calls
var cleanDOM = function() {
  var old = document.querySelector('[data-rust-identity="identity"]') || undefined;
  if (old !== undefined) {
    document.body.removeChild(old);
  }
};

// we can't use handlebars / hogan for mustache due to chrome security limitations 
var templating = function(comments) {
  var result = '<div id="commentContainer">';
  for (var i = comments.length - 1; i >= 0; i--) {
    comment = comments[i];
    result += [
      '<div id="', comment.User.name, '">',
        '<div>', comment.User.name, '</div>',
        '<div>', comment.createdAt, '</div>',
        '<div>', comment.text, '</div>',
      '</div>'].join('');
  }
  result += '</div>';
  return result;
};

// add input field functionlity to html output
var inputField = function(html) {
  var inputElement = '<input id="rustsubmit" type="text" name="comment"/><div class="submit-comment">Submit</div>';
  inputElement += '<a id="test">Auth Test</a> || <a href="http://localhost:3000/api/auth/chrome/google">Login link test</a> || <a id="close">close</a>';
  html += inputElement;
  return html;
};

// append final html output to DOM (ideall, we first do the container once globally, then the content.)
var appendToDOM = function(html) {
  var section = document.createElement('section');
  section.setAttribute(dataAttribute, dataAttributeValue);
  section.className += 'rust cleanslate';
  section.innerHTML = html;
  document.body.appendChild(section);
};

// directly append the new comment which was submitted to server
var appendNewCommentToDom = function(html) {
  var rust = document.querySelector('[data-rust-identity="identity"]');
  rust.querySelector('#commentContainer').insertAdjacentHTML('beforeend', '<div class="ownChild">' + html + '</div>');
};

// register all the events chrome needs to handle
var registerEventListeners = function() {
  var rust = document.querySelector('[data-rust-identity="identity"]');
  rust.querySelector('#rustsubmit').addEventListener('keydown', function(e) {
    // if user hits enter key
    if (e.keyCode === 13) {
      var text = document.getElementById('rustsubmit').value;
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
          console.log(response.data);
          var html = templating(response.data.comments);
          // Append new message 
          appendNewCommentToDom(html);
          // Reset input field
          document.getElementById('rustsubmit').value = '';
        });
      }
    }
  });

  // remove everything on clicking close
  rust.querySelector('#close').addEventListener('click', function() {
    rust.parentNode.removeChild(rust);
  });

  // test if user is authenticated
  rust.querySelector('#test').addEventListener('click', function() {
    chrome.runtime.sendMessage({
      type: 'test'
    }, function(response) {
      console.log('auth test response:');
      console.log(response);
    });
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
    if (response.data.userInfo.name) {
      html = '<div>Hello, ' + response.data.userInfo.name + '</div>';
    }
    // templating
    html += templating(response.data.comments);
    // add input field
    html = inputField(html);
    // append to document
    appendToDOM(html);
    // register event listeners for user input
    registerEventListeners();
  }
});
