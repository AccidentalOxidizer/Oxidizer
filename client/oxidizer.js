$(document).ready(function() {

  var buildComments = function(comment) {
    var commentHTML = '<p>' + comment.User.name + '</br>' +
      comment.createdAt + '</br>' + comment.text + '</p>';

    return commentHTML;
  }

  // Check if logged in from server?
  // NOTE: This isn't working at the moment.
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

      var commentArrayHTML = '';
      // Render comment HTML
      data['comments'].forEach(function(element, index) {
        commentArrayHTML = commentArrayHTML.concat(buildComments(data['comments'][index]));
      });

      $('#comments').html(commentArrayHTML);
    },
    error: function(err) {
      console.log("Awww shit", err);
    }
  });



});