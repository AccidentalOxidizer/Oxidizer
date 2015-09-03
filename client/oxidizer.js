$(document).ready(function() {

  // Initial vars
  // Setting this to emtpy so we can do some interesting stuff later.
  var url = '';

  // Use this to build out HTML for individual comments.
  // Basically, our AJAX call will get data back, loop over the array of comments
  // then send each individiaul comment here to build out the comment.
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

  // This should show or hide the login / logout options depending on the logged in status
  // of the user. This isn't working just yet though.
  if (isLoggedIn === false) {
    $('#login').show();
    $('#container').hide();
  } else if (isLoggedIn === true) {
    $('#login').show();
    $('#container').show();
  }

  // Wrapping our AJAX call to the server to get comments in a function. Why?
  // That way we can update the server if I input a new URL to look at in the
  // input box at the top of the screen.
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

  // On Initial Page Load (Providing we're ultimately logged into Google):
  // GET NEW COMMENTS!
  // We don't need to pass in an initial URL since the getComments() function will
  // check if anything exists, otherwise it's set to a default.
  getComments();

  // This checks the URL FORM for any URLs and will call the getComments()
  // function in order to get updated URLs.
  $("#urlForm").submit(function() {
    console.log('STATUS = BALLER');
    getComments($('#getUrl').val());
  });
});