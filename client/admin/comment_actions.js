$(document).ready(function() {

  var commentSort = 'recent'; // This represents two values. 'recent' or 'flags'
  var lastCommentId = null;

  // Listen for User tools selection.
  $('#show-comments').on('click', function() {
    $('#users').html('');
    $('#search-url').show();
    $('#search-comments').show();
    $('#search-users').hide();
    $('#load-more-users').hide();
    $('#load-more-comments').show();
    $('#sort-type').text('Showing Comments:');
    getComments();
  });

  // Use this to build out HTML for individual comments.
  // Basically, our AJAX call will get data back, loop over the array of comments
  // then send each individiaul comment here to build out the comment.
  var buildComments = function(comment) {
    var commentHTML = '<div class="comment" data-commentid="' + comment.id + '"><p>Comment ID:' + comment.id + '<br/>Username: ' + comment.username + ' | ' +
      comment.createdAt + '<br/>Site: <a href="http://' + comment.url + '" target="_blank">http://' + comment.url + '</a><br/>' + comment.text + '<br/>' +
      '<a href="#" class="delete" data-comment-id="' + comment.id + '">DELETE</a> || <a href="#" class="unflag" data-comment-id="' + comment.id + '">REMOVE FLAGS</a> <br/>' +
      'TOTAL FAVS: <span id="faves-' + comment.id + '">' + comment.HeartCount + '</span> || TOTAL FLAGS: <span id="flags-' + comment.id + '">' + comment.FlagCount + '</span></p></div>';
    return commentHTML;
  };

  // Wrapping our AJAX call to the server to get comments in a function. Why?
  // That way we can update the server if I input a new URL to look at in the
  // input box at the top of the screen.
  var getComments = function(url) {
    adminSettings.url = url || null;
    // Default website to show comments from on page load.
    // If this is for a POST request, we need to JSON.stringify() data.
    // If it's for a GET request, we don't need to stringify data.

    // Setting this to nothing (e.g., data = {}) returns ALL comments.
    var data = {};
    
    if (lastCommentId !== null) {
      data.lastCommentId = lastCommentId;
    }
    
    // Check if we're sorting by flags.
    if (commentSort === 'flags') {
      data.orderByFlags = 'DESC';
    }

    // Check if we're sorting by flags.
    if (commentSort === 'recent') {
      //data.orderByFlags = 'DESC';
    }    

    if (url) {
      data.url = url;
    }

    // AJAX call to server to get comments from a particular URL.
    $.ajax({
      type: "GET",
      url: window.location.origin + '/api/comments',
      data: data,
      contentType: 'application/json', // content type sent to server
      dataType: 'json', //Expected data format from server
      success: function(data) {
        $('#comments').html('');

        var commentData = data['comments'];
        console.log('DATA: ', data);
        console.log('LAST COMMENT ID: ', data['comments'][commentData.length-1].id);
        //console.log('DONE!');
        
        lastCommentId = data['comments'][commentData.length-1].id;

        // Set the logged in user's ID so we can pass into fav / flag functions.
        adminSettings.userId = data.userInfo.userId;

        var commentArrayHTML = '';
        // Render comment HTML
        data.comments.forEach(function(element, index) {

          // Check if Total Flags or Total Hearts is Null set to 0.
          if (data['comments'][index].FlagCount === null) {
            data['comments'][index].FlagCount = 0;
          }

          if (data['comments'][index].HeartCount === null) {
            data['comments'][index].HeartCount = 0;
          }

          commentArrayHTML = commentArrayHTML.concat(buildComments(data['comments'][index]));
        });

        $('#comments').html(commentArrayHTML);
      },
      error: function(err) {
        $('#comments').html('Please login with valid credentials first :)');
      }
    });
  };

  // On Initial Page Load (Providing we're ultimately logged into Google):
  // GET NEW COMMENTS!
  // We don't need to pass in an initial URL since the getComments() function will
  // check if anything exists, otherwise it's set to a default.
  getComments();

  // SEARCH COMMENTS FROM URL
  $("#url-search").keydown(function(event){
      if(event.keyCode == 13){
        var getURL = $("#url-search").val();
        
        // Allow posting paths only and not URLs by prepending 'http://'
        if (getURL === undefined || getURL === '') {
          // DO NOTHING cause we'll just return all URLs
          getURL = '';
          void 0;
        } else if (getURL.substr(0, 5) === 'http:' || getURL.substr(0, 6) === 'https:') {
          // ALSO DO NOTHING. WHY IS THIS HERE?
          // WHO KNOWS. BUT IT WORKS.
          // ¯\_(ツ)_/¯
        } else {
          getURL = 'http://' + getURL;
        }
        
        adminSettings.url = getURL;
        $('#comments').html();
        getComments(getURL);        
      }
  });

  // SORT COMMENTS BY NUMBER OF FLAGS
  $(document).on('click', '#sort-flags', function(event) {
    // Update Mode:
    commentSort = 'flags';
    lastCommentId = null;
    adminSettings.currentMode = "flags";
    console.log('Current Sort Mode:', adminSettings.currentMode);

    // Reset Comments HTML and get comments again.
    $('#comments').html('');
    getComments();
  });


  // SORT COMMENTS BY WHEN THEY WERE RECENTLY POSTED
  $(document).on('click', '#sort-recent', function(event) {
    // Update Mode:
    commentSort = 'recent';
    lastCommentId = null;
    adminSettings.currentMode = "recent";
    console.log('Current Sort Mode:', adminSettings.currentMode);

    // Reset Comments HTML and get comments again.
    $('#comments').html('');
    getComments();
  });

  $(document).on('click', '#load-more-comments', function(event) {
    // Reset Comments HTML and get comments again.
    if (adminSettings.currentMode !== 'users') {
      $('#comments').html('');
      $('#users').html('');
      getComments();    
    }
  });

  // DELETE COMMENT FROM DATABASE!!!!
  $(document).on('click', '.delete', function(event) {
    event.preventDefault();
    console.log('DELETE clicked!');
    console.log('DELETE CLICKED, ID = ', $(this).attr('data-comment-id'));
    var commentId = $(this).attr('data-comment-id');    

    $.ajax({
      url: window.location.origin + '/api/comments/remove/' + commentId,
      method: 'DELETE',
      //dataType: 'json',
      success: function(data) {
        console.log('Removing comment: ', commentId);
        var getDivId = 'div[data-commentid="' + commentId +'"]';
        $(getDivId).hide();
      },
      error: function(xhr, status, err) {
        console.error(xhr, status, err.message);
      }
    });
  });


  // REMOVE FLAGS FROM COMMENT
  $(document).on('click', '.unflag', function(event) {
    event.preventDefault();
    console.log('UNFLAG clicked!');
    console.log('UNFLAG CLICKED, ID = ', $(this).attr('data-comment-id'));
    var commentId = $(this).attr('data-comment-id');

    $.ajax({
      url: window.location.origin + '/api/flags/remove/' + commentId,
      method: 'DELETE',
      //dataType: 'json',
      success: function(data) {
        console.log('Removing flags: ', commentId);
        var getDivId = 'div[data-commentid="' + commentId +'"]';
        
        // If current mode is for flags only, then let's go ahead and
        // hide the div as well, since we reset current flags.
        if (adminSettings.currentMode === 'flags') {
          $(getDivId).hide();
        } else {
          $('#flags-' + commentId).text('0');
        }
      },
      error: function(xhr, status, err) {
        console.error(xhr, status, err.message);
      }
    });
  });

});