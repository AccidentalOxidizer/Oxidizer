$(document).ready(function() {

  // Initial vars
  // Setting this to emtpy so we can do some interesting stuff later.

  var testSettings = {
    url: '',
    urlId: '',
    userId: ''
  };

  // Use this to build out HTML for individual comments.
  // Basically, our AJAX call will get data back, loop over the array of comments
  // then send each individiaul comment here to build out the comment.
  var buildComments = function(comment) {
    var commentHTML = '<div class="comment"><p>Comment ID:' + comment.id + '<br/>' + comment.User.name + '<br/>' +
      comment.createdAt + '<br/>' + comment.text + '<br/>' +
      '<a href="#" class="fave" data-comment-id="' + comment.id + '">FAVE IT</a> || <a href="#" class="flag" data-comment-id="' + comment.id + '">FLAG IT</a> <br/>' +
      'TOTAL FAVS: <span id="faves-' + comment.id + '">' + comment.Hearts + '</span> || TOTAL FLAGS: <span id="flags-' + comment.id + '">' + comment.Flags + '</span></p></div>';
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
    testSettings.url = url || 'http://reddit.com/r/kerbalspaceprogram';
    // Default website to show comments from on page load.
    // If this is for a POST request, we need to JSON.stringify() data.
    // If it's for a GET request, we don't need to stringify data.
    var data = {
      url: testSettings.url
    };

    // AJAX call to server to get comments from a particular URL.
    $.ajax({
      type: "GET",
      url: 'http://localhost:3000/api/comments/get',
      data: data,
      contentType: 'application/json', // content type sent to server
      dataType: 'json', //Expected data format from server
      success: function(data) {
        $('#comments').html('');

        //console.log('DATA: ', data);
        //console.log('DONE!');

        // Set the logged in user's ID so we can pass into fav / flag functions.
        testSettings.userId = data.userInfo.userId;

        var commentArrayHTML = '';
        // Render comment HTML
        data['comments'].forEach(function(element, index) {
          commentArrayHTML = commentArrayHTML.concat(buildComments(data['comments'][index]));
        });

        $('#comments').html('<p>URL: ' + testSettings.url + '</p>' + commentArrayHTML);
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
  // function in order to get updated comments related to a specific URL.
  $("#urlForm").submit(function() {
    getComments($('#getUrl').val());
  });

  // Detect if we've clicked on a FAVE link
  // If so, send an AJAX call to the database and update the number of favorites.
  $(document).on('click', '.fave', function(event) {
    event.preventDefault();
    //console.log('FAVE clicked!');
    //console.log('FAVE CLICKED, ID = ', $(this).attr('data-comment-id'));

    // COOL! Let's FAVORITE SOME STUFF!

    // Convert our data-comment-id attribute to a number.
    var thisCommentId = Number($(this).attr('data-comment-id'));

    var data = JSON.stringify({
      UserId: testSettings.userId,
      CommentId: thisCommentId
    });

    $.ajax({
      type: "POST",
      url: 'http://localhost:3000/api/comments/fave',
      data: data,
      contentType: 'application/json', // content type sent to server
      dataType: 'json', //Expected data format from server
      success: function(result) {
        //console.log("SUCCESS! Comment FAVORITED! # of favs: ", result);
        $('#faves-' + thisCommentId).html(result.favs);
      },
      error: function(err) {
        console.log("Awww, man. Couldn't favorite!", err);
      }
    });

  });

  // Detect if we've clicked on a FLAG link
  // If so, send an AJAX call to the database and update the number of flags for
  // a particular comment.
  $(document).on('click', '.flag', function(event) {
    event.preventDefault();
    //console.log('FAVE clicked!');
    //console.log('FLAG CLICKED, ID = ', $(this).attr('data-comment-id'));

    // COOL! Let's FLAG SOME STUFF!
    // Convert our data-comment-id attribute to a number.
    var thisCommentId = Number($(this).attr('data-comment-id'));

    var data = JSON.stringify({
      UserId: testSettings.userId,
      CommentId: thisCommentId
    });

    $.ajax({
      type: "POST",
      url: 'http://localhost:3000/api/comments/flag',
      data: data,
      contentType: 'application/json', // content type sent to server
      dataType: 'json', //Expected data format from server
      success: function(result) {
        //console.log("SUCCESS! Comment FLAGGED! # of flags", result);
        $('#flags-' + thisCommentId).html(result.flags);
      },
      error: function(err) {
        console.log("Awww, man. Couldn't flag!", err);
      }
    });


  });

});