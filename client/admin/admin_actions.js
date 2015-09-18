// Initial vars
// Setting this to emtpy so we can do some interesting stuff later.
var adminSettings = {
  currentMode: 'recent', // This can either be 'recent' or 'flagged'
  url: '',
  urlId: '',
  userId: '',
  isAdmin: false
};

$.ajax({
  url: window.location.origin + '/api/user/isadmin',
  method: 'GET',
  success: function() {
    $('body').show();
    console.log('User is Admin!');
    adminSettings.isAdmin = true;

  },
  error: function(xhr, status, err) {
    window.location = window.location.origin;
    //console.error(xhr, status, err.message);
  }
});

$(document).ready(function() {

  // Initial Load
  $('#search-users').hide();

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