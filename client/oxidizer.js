$(document).ready(function() {

  // Check if logged in from server?
  var isLoggedIn = true;

  if (isLoggedIn === false) {
    $('#login').show();
    $('#container').hide();
  } else if (isLoggedIn === true) {
    $('#login').show();
    $('#container').show();
  }

  var data = JSON.stringify({
    url: 'http://reddit.com/r/kerbalspaceprogram'
  });

  $.ajax({
    type: "POST",
    url: 'http://localhost:3000/api/comments/get',
    data: data,
    contentType: 'application/json', // content type sent to server
    dataType: 'json', //Expected data format from server
    success: function(data) {
      console.log('DATA: ', data);
      console.log('DONE!');
    },
    error: function(err) {
      console.log("Awww shit", err);
    }
  });



});