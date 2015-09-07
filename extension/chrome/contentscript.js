// Base Iframe Style
var iframeStyle = 'position:fixed !important;top:0;right:0;display:block;height:100%;z-index:2147483648!important;bottom: auto !important; border: none !important;  overflow: hidden !important; '
var iframeStyleClosed = iframeStyle + 'width:0px; !important; visibility: hidden;';
var iframeStyleOpened = iframeStyle + 'width:100% !important; visibility: visible;';

var extensionOrigin = 'chrome-extension://' + chrome.runtime.id;
if (!location.ancestorOrigins.contains(extensionOrigin)) {
  var iframe = document.createElement('iframe');
  // Must be declared at web_accessible_resources in manifest.json
  iframe.src = chrome.runtime.getURL('sideframe.html');
  iframe.setAttribute('data-oxidizer-identity', 'iframe');
  iframe.setAttribute('allowtransparency', 'true');
  iframe.setAttribute('data-oxidizer-state', 'closed');
  iframe.style.cssText = iframeStyleClosed;

  document.body.appendChild(iframe);
}

// Create trigger
var section = document.createElement('section');
section.setAttribute('data-oxidizer-identity', 'trigger');
section.className = 'oxidizer cleanslate';
section.style.cssText = 'position:fixed !important; bottom:0 !important; right:0 !important; background: red;';
section.innerHTML = 'TRIGGER'; // this should be a nice SVG element
document.body.appendChild(section);

// Create listener to fire trigger to open iframe
document.querySelector('[data-oxidizer-identity="trigger"]').addEventListener('mouseover', function(evt) {
  openIframe();
});


// Event listener for incoming messages
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

  if (request.from === 'background' && request.message === 'close iframe') {
    closeIframe();
    sendResponse({
      data: 'close iframe'
    })
  }
  // toggle open and close of iframe via keyboard shortcut
  if (request.command === "toggle") {
    var state = document.querySelector('[data-oxidizer-identity="iframe"').getAttribute('data-oxidizer-state');
    if (state === 'closed') {
      openIframe();
    } else {
      closeIframe();
    }
  }

  /* Generic callback passing along an inital round trip message */
  if (request.from === 'background' && request.message === 'callback') {
    sendResponse({
      data: 'callback'
    });
  }
});

function openIframe() {
  var iframe = document.querySelector('[data-oxidizer-identity="iframe"');
  iframe.setAttribute('data-oxidizer-state', 'opened');
  iframe.style.cssText = iframeStyleOpened;
  iframe.contentWindow.postMessage({
    type: 'open',
    url: document.location.href
  }, iframe.src);
}

function closeIframe() {
  var iframe = document.querySelector('[data-oxidizer-identity="iframe"');
  iframe.contentWindow.postMessage({
    type: 'close'
  }, iframe.src);
  setTimeout(function() {
    iframe.style.cssText = iframeStyleClosed;
    iframe.setAttribute('data-oxidizer-state', 'closed');

  }, 500)
}
