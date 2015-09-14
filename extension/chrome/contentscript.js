// Initialize & get extension settings or defaults.
var settings = {};
chrome.runtime.sendMessage({
    from: 'content script',
    message: 'get settings'
  },
  function(response) {
    settings = response.settings;
    if (settings.showtrigger === true) {
      createIframe();
      createAndShowTrigger();
    }
  });

// Base Iframe Style
var iframeStyle = 'padding:0px !important; position:fixed !important;top:0;right:0;display:block;height:100%;z-index:2147483648!important;bottom: auto !important; border: none !important;  overflow: hidden !important; '
var iframeStyleClosed = iframeStyle + 'width:0px; !important; visibility: hidden;';
var iframeStyleOpened = iframeStyle + 'width:100% !important; visibility: visible;';

function createIframe() {
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
}

function createAndShowTrigger() {
  switch (settings.triggerposition) {
    case 0:
      var triggerClass = 'bottom-right';
      break;
    case 1:
      var triggerClass = 'bottom-left';
      break;
    case 2:
      var triggerClass = 'top-right';
      break;
    case 3:
      var triggerClass = 'top-left';
      break;
    default:
      var triggerClass = 'bottom-right';
  }

  var svgns = "http://www.w3.org/2000/svg";
  var svgDocument = document.createElementNS(svgns, "svg");
  svgDocument.setAttributeNS(null, 'data-oxidizer-identity', 'trigger');
  svgDocument.setAttributeNS(null, 'data-oxidizer-trigger', triggerClass);
  var shape = document.createElementNS(svgns, "polygon");
  shape.setAttributeNS(null, "points", "45,0 0,45 45,45");
  shape.setAttributeNS(null, "fill-opacity", ".5");
  var line = document.createElementNS(svgns, "polyline");
  line.setAttributeNS(null, "points", "45,0 0,45");
  svgDocument.appendChild(line);
  svgDocument.appendChild(shape);
  document.body.parentNode.insertBefore(svgDocument, null); // make sure to append AFTER body
  // Create listener to fire trigger to open iframe
  document.querySelector('[data-oxidizer-identity="trigger"]').addEventListener('mouseover', function(evt) {
    openIframe();
  });
  document.querySelector('[data-oxidizer-identity="trigger"]').addEventListener('click', function(evt) {
    openIframe();
  });
}



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


  // tell iframe to trigger open animation
  iframe.contentWindow.postMessage({
    type: 'open',
    url: document.location.href,
    settings: settings
  }, iframe.src);

  // display iframe if iframe acknowledged to have received postMessage with 'open' command. 
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.from === 'background' && request.message === 'iframe ok') {
      // console.log(request.details);
      iframe.setAttribute('data-oxidizer-state', 'opened');
      iframe.style.cssText = iframeStyleOpened;
      sendResponse({
        data: {
          from: 'content script',
          message: 'iframe opened',
          details: request.details
        }
      });
    }
  });
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