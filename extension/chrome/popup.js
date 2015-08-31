document.querySelector('#login').addEventListener('click', function() {
  chrome.tabs.create({
    url: 'http://localhost:3000/api/auth/chrome/google'
  });
});

document.querySelector('#logout').addEventListener('click', function() {
  //send message to background script .. 
  chrome.runtime.sendMessage({
    type: 'logout'
  }, function(response) {
    console.log(response);
    // this is not working for some reason.. 
    $("body").append(document.createTextNode("Test"));
    // this neither.. 
    var msg = document.createElement('p');
    msg.innerHTML = 'logout complete';
    document.body.appendChild(msg);
  })
});

document.querySelector('#options').addEventListener('click', function() {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL('options.html'));
  }
});
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
