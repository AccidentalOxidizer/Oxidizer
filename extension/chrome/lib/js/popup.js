// CONFIG
var config = '';

var getConfig = function() {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    config = JSON.parse(xhr.responseText);
  };
  xhr.open("GET", chrome.extension.getURL('config.json'), true);
  xhr.send();
};

getConfig();

// LOGIN STRATEGIES
var googleLogin = function() {
  chrome.tabs.create({
    url: config.server + '/api/auth/chrome/google'
  });
}

var facebookLogin = function() {
  chrome.tabs.create({
    url: config.server + '/api/auth/chrome/facebook'
  });
}

// LOGOUT STRATEGIES 
var logout = function() {
  chrome.runtime.sendMessage({
    type: 'logout'
  }, function(response) {
    console.log(response);

    var status = document.getElementById('status');
    status.textContent = 'Logout.. done.';
    setTimeout(function() {
      // reset the status message after 2 seconds
      status.textContent = '';
    }, 2000);

  })
}

// open the options page
var options = function() {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    // fallback
    window.open(chrome.runtime.getURL('options.html'));
  }
}

// for debugging only..
var popup = function() {
  chrome.extension.sendMessage({
    type: 'popup'
  }, function(response) {
    console.log(response);
  })
}

// Register Events on DOM
document.querySelector('#facebook-login').addEventListener('click', facebookLogin);
document.querySelector('#google-login').addEventListener('click', googleLogin);
document.querySelector('#logout').addEventListener('click', logout);
document.querySelector('#options').addEventListener('click', options);
document.querySelector('#popup').addEventListener('click', popup);



// nope..
// $(document).ready(function() {
//   $('body').on('click', 'a', function() {
//     if ($(this).attr('href') === '') {
//       chrome.tabs.create({
//         url: $(this).attr('href')
//       });
//       return false;
//     }
//   });
// });
