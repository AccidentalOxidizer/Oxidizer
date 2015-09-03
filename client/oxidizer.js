$(document).ready(function() {

  // Initial vars
  var url = '';

  // Use this to build out HTML for individual comments.
  var buildComments = function(comment) {
    var commentHTML = '<p>Comment ID:' + comment.id + '<br/>' + comment.User.name + '<br/>' +
      comment.createdAt + '<br/>' + comment.text + '<br/>' +
      '<a href="#">FAVE IT</a> || <a href="#">FLAG IT</a> <br/>' +
      'TOTAL FAVS: 0 || TOTAL FLAGS: 0</p>';

    return commentHTML;
  };

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

  var getComments = function(url) {
    url = url || 'http://reddit.com/r/kerbalspaceprogram';
    // Default website to show comments from on page load.
    var data = JSON.stringify({
      url: url
    });

    // AJAX call to server to get comments from a particular URL.
    $.ajax({
      type: "POST",
      url: 'http://localhost:3000/api/comments/get',
      data: data,
      contentType: 'application/json', // content type sent to server
      dataType: 'json', //Expected data format from server
      success: function(data) {
        $('#comments').html('');

        console.log('DATA: ', data);
        console.log('DONE!');

        var commentArrayHTML = '';
        // Render comment HTML
        data['comments'].forEach(function(element, index) {
          commentArrayHTML = commentArrayHTML.concat(buildComments(data['comments'][index]));
        });

        $('#comments').html('<p>URL: ' + url + '</p>' + commentArrayHTML);
      },
      error: function(err) {
        $('#comments').html('Please login with Google credentials first :)');
        console.log("Awww shit", err);
      }
    });
  };

  // On Initial Page Load:
  getComments();


  $("#urlForm").submit(function() {
    console.log('STATUS = BALLER');
    getComments($('#getUrl').val());
  });
});