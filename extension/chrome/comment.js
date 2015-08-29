/**
 * For maximum compatibility and avoiding conflicts:
 * no 3rd party libs, not even jQuery for DOM manipulation, templating, etc
 **/

// content script running for each chrome tab window injected by the extension rust.js
var url = document.location.href;
var dataAttribute = 'data-rust-identiy';
var dataAttributeValue = 'identity';

// remove DOM element from previous calls
var cleanDOM = function() {
  var old = document.querySelector('[data-rust-identiy="identity"]') || undefined;
  if (old !== undefined) {
    document.body.removeChild(old);
  }
}

// we can't use handlebars / hogan for mustache due to chrome security limitations 
var templating = function(comments) {
  var result = '<div>';
  for (var i = comments.length - 1; i >= 0; i--) {
    comment = comments[i];
    result += '<div id="' + comment['id'] + '"><div>' + comment['timestamp'] + '</div><div>' + comment['text'] + '</div></div>';
  };
  result += '</div>';
  return result;
}

// add input field functionlity to html output
var inputField = function(html) {
  var inputElement = '<input id="rustsubmit" type="text" name="comment"/><div class="submit-comment">Submit</div>';
  html += inputElement;
  return html;
}

// append final html output to DOM
var appendToDOM = function(html) {
  var section = document.createElement('section');
  section.setAttribute(dataAttribute, dataAttributeValue);
  section.className += 'rust cleanslate';
  section.innerHTML = html;
  document.body.appendChild(section);
}

// register all the events chrome needs to handle
var registerEventListeners = function() {
  var rust = document.querySelector('[data-rust-identiy="identity"]');
  rust.querySelector('#rustsubmit').addEventListener('keydown', function(e) {
    // if user hits enter key
    if (e.keyCode == 13) {
      var text = document.getElementById('rustsubmit').value;
      // send message to background script rust.js with new coment data tp be posted to server
      chrome.runtime.sendMessage({
        type: 'post',
        comment: text
      }, function(response) {
        // background script rust.js should return the server response
        console.log(response);
        // todo: append new message to output html.. 
      });

    }
  });
}

/* MAGIC HAPPENS HERE */
// send 'init' message with url to the chome extension (rust.js) when loaded
chrome.runtime.sendMessage({
  type: 'init',
  url: url
}, function(response) {
  if (response.data.comments) {
    console.log('Response:', response);
    cleanDOM();
    // templating
    var html = templating(response.data.comments);
    // add input field
    var html = inputField(html);
    // append to document
    appendToDOM(html);
    // register event listeners for user input
    registerEventListeners();
  };
});
