/**
 * For maximum compatibility and avoiding conflicts:
 * no 3rd party libs, not even jQuery for DOM manipulation, templating, etc
 **/

// content script running for each chrome tab window injected by the extension rust.js
console.log('comment.js loaded');
var url = document.location.href;

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
  var result = '';
  for (var i = comments.length - 1; i >= 0; i--) {
    comment = comments[i];
    console.log(comment);
    result += '<div id="' + comment['id'] + '"><div>' + comment['timestamp'] + '</div><div>' + comment['text'] + '</div></div>';
  };
  return result;
}

// send message to the chome extension (rust.js)
chrome.runtime.sendMessage({
  type: 'init',
  url: url
}, function(response) {
  cleanDOM();
  console.log(response);
  // let's do some templating
  var html = templating(response.data);
  console.log(html);
  // append to body.. 
  // document.body.appendChild(html);

  // var rustContainer = document.createElement('rust-x-container');
  // var rustElement = document.createElement('rust-x-element');
  // rustElement.innerHTML = 'test';
  // rustContainer.innerHTML = rustElement;
  // document.body.appendChild(rustContainer);

  var section = document.createElement('section');
  section.id = 'rust';
  section.className += 'rust cleanslate';
  section.innerHTML = html;
  document.body.appendChild(section);
});
