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
  // make iframe visible
  document.querySelector('[data-oxidizer-identity="iframe"').style.cssText = iframeStyleOpened;
  // tell iframe to fire / reload content that needs refreshing (we can't use chrome messages here)
  var iframe = document.querySelector('[data-oxidizer-identity="iframe"');
  iframe.contentWindow.postMessage({
    type: 'fire',
    url: document.location.href
  }, iframe.src);

});



// Event listener for incoming messages
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

  if (request.from === 'background' && request.message === 'close iframe') {
    console.log('need to close iframe');
    document.querySelector('[data-oxidizer-identity="iframe"').style.cssText = iframeStyleClosed;
    sendResponse({
      data: 'close iframe'
    })
  }

  /* Generic callback passing along an inital round trip message */
  if (request.from === 'background' && request.message === 'callback') {
    sendResponse({
      data: 'callback'
    });
  }
});
