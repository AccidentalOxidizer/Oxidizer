/**
 * For maximum compatibility and avoiding conflicts:
 * no 3rd party libs, not even jQuery for DOM manipulation, templating, etc
 **/

// content script running for each chrome tab window injected by the extension rust.js
console.log('comment.js loaded');
var url = document.location.href;
var dataAttribute = 'data-rust-identiy';
var dataAttributeValue = 'identity';

// remove DOM element from previous calls
var cleanDOM = function() {
  var old = document.getElementById('rust') || undefined;
  if (old !== undefined) {
    console.log('removing');
    document.body.removeChild(old);
  }
}

// we can't use handlebars / hogan for mustache due to chrome security limitations 
var templating = function(comments) {
  var result = '<div>';
  for (var i = comments.length - 1; i >= 0; i--) {
    comment = comments[i];
    console.log(comment);
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

var registerEventListeners = function() {
  var rust = document.querySelector('[data-rust-identiy="identity"]');

  rust.querySelector('#rustsubmit').addEventListener('keydown', function(e) {
    if (e.keyCode == 13) {
      var text = document.getElementById('rustsubmit').value;

      var xhr = new XMLHttpRequest();
      xhr.open('POST', 'http://localhost:3000/test/comments');
      xhr.setRequestHeader('Content-Type', 'application/json');

      xhr.onload = function() {
        if (xhr.status === 201) {
          console.log(xhr.responseText);
        }
      };

      xhr.send(JSON.stringify({
        name: 'Matthias',
        age: 32,
        text: text
      }));

    }
  });
}

// send message to the chome extension (rust.js)
chrome.runtime.sendMessage({
  type: 'init',
  url: url
}, function(response) {
  if (response.data) {
    console.log(response);
    cleanDOM();
    // templating
    var html = templating(response.data);
    // add input field
    var html = inputField(html);
    // append to document
    appendToDOM(html);
    // register event listeners for user input
    registerEventListeners();
  };

});
