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
      '<br/>User status: ' + userLevelDescription(user.status) +
      '<br/><a href="#" class="ban-user" data-user-id="' + user.id + '">BAN USER</a> || <a href="#" class="change-permissions" data-user-id="' + user.id + '">CHANGE PERMISSION</a> <br/>' +
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

  // This function takes a level and returns an English Description.
  var userLevelDescription = function(level) {
    if (level === null) {
      return "default user (active)";
    }

    if (level === -1) {
      return "banned";
    } else if (level === 0) {
      return "default user (active)";
    } else if (level === 10) {
      return "admin user";
    }
  };

  // CHANGE USER PERMISSIONS
  $(document).on('click', '.change-permissions', function(event) {
    var userLevel = Number(prompt('Enter new user level:\n -1: Banned\n 0: Default (Active)\n 10: Admin User', 0));
    var userId = $(this).attr('data-user-id');

    if (userLevel === -1 || userLevel === 0 || userLevel === 10) {
      // Input is okay, continue...
      //console.log('Valid UserLevel: ', userLevel);
    } else {
      // Set default user level to 0...
      userLevel = 0;
    }

    var data = {
      status: userLevel
    };

    $.ajax({
      url: window.location.origin + '/api/users/' + userId,
      method: 'PUT',
      data: JSON.stringify(data),
      contentType: 'application/json', // content type sent to server
      success: function(data) {
        console.log('User permissions updated!');
      },
      error: function(xhr, status, err) {
        console.error(xhr, status, err.message);
      }
    });

  });

  // BAN USER
  $(document).on('click', '.ban-user', function(event) {
    event.preventDefault();
    // console.log('BAN USER clicked!');
    // console.log('BAN USER ID = ', $(this).attr('data-user-id'));
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
        console.log('User banned!');
      },
      error: function(xhr, status, err) {
        console.error(xhr, status, err.message);
      }
    });
  });

});