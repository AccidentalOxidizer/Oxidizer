$(document).ready(function() {

  // Listen for User tools selection.
  $('#show-users').on('click', function() {
    $('#comments').html('');
    $('#search-url').hide();
    $('#search-comments').hide();
    $('#search-users').show();
    $('#sort-type').text('Showing Users:');
    getUsers();
  });

  // Use this to build out HTML for individual users.
  // Basically, our AJAX call will get data back, loop over the array of users
  // then send each individiaul user here to build out the user information panel.
  var buildUsers = function(user) {
    var userHTML = '<div class="user" data-userid="' + user.id + '"><img src="' + user.avatar + '" width=150><br/>' + 
      '<p>User ID:' + user.id + '<br/>Username: ' + user.name +
      '<br/>Registered on: ' + user.createdAt +
      '<br/>User status: ' + user.status +
      '<br/><a href="#" class="delete" data-user-id="' + user.id + '">DELETE USER?</a> || <a href="#" class="ban-user" data-user-id="' + user.id + '">BAN USER</a> || <a href="#" class="unflag" data-comment-id="' + user.id + '">CHANGE PERMISSION</a> <br/>' +
      '</div>';
    return userHTML;
  };

  var getUsers = function() {
    // Setting this to nothing (e.g., data = {}) returns ALL comments.
    var data = {};
    
    // AJAX call to server to get all users.
    $.ajax({
      type: "GET",
      url: 'http://localhost:3000/api/users/',
      data: data,
      contentType: 'application/json', // content type sent to server
      dataType: 'json', //Expected data format from server
      success: function(data) {
        $('#users').html('');

        console.log('USER DATA: ', data);
        //console.log('DONE!');

        // Set the logged in user's ID so we can pass into fav / flag functions.
        //adminSettings.userId = data.userInfo.userId;

        var userArrayHTML = '';
        // Render comment HTML
        data.forEach(function(element, index) {
          userArrayHTML = userArrayHTML.concat(buildUsers(data[index]));
        });

        $('#users').html(userArrayHTML);
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
  //getComments();

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


  // BAN USER
  $(document).on('click', '.ban-user', function(event) {
    event.preventDefault();
    console.log('BAN USER clicked!');
    console.log('BAN USER ID = ', $(this).attr('data-user-id'));
    var userId = $(this).attr('data-user-id');

    var data = {
      status: -1
    };

    $.ajax({
      url: window.location.origin + '/api/users/' + userId,
      method: 'PUT',
      data: JSON.stringify(data),
      contentType: 'application/json', // content type sent to server
      //dataType: 'json',
      success: function(data) {
        console.log('User banned!', data);

        //var getDivId = 'div[data-commentid="' + commentId +'"]';
        
        // If current mode is for flags only, then let's go ahead and
        // hide the div as well, since we reset current flags.
        // if (adminSettings.currentMode === 'flags') {
        //   $(getDivId).hide();
        // } else {
        //   $('#flags-' + commentId).text('0');
        // }
      },
      error: function(xhr, status, err) {
        console.error(xhr, status, err.message);
      }
    });
  });

});