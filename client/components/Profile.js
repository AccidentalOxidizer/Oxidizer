var React = require('react');
var Comment = require('./Comment');

// At the moment, Profile will only be used to display your personal
// profile, not that of others.
// 
// Load all the comments for this user into this.state.comments
// Need to store maxCommentId ... last comment in array id
// comments[length - 1].id
// 
var Profile = React.createClass({
  getInitialState: function() {
    return {
      comments: [],
      maxCommentId: -1
    };
  },

  // TODO: refactor to use to load additional comments too.
  init: function() {
    $.ajax({
      url: window.location.origin + '/api/comments/get/user',
      // data: {maxCommentId: this.state.maxCommentId},
      method: 'GET',
      dataType: 'json',
      success: function(data) {
        console.log('Profile init: successfully loaded user comments');
        console.log(data);

        var maxCommentId = data.comments[data.comments.length - 1].id;
        this.setState({
          comments: data.comments,
          maxCommentId: maxCommentId
        });
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(xhr, status, err.message);
      }
    });
  },

  componentDidMount: function() {
    this.init();
  },

  render: function() {
    var comments = this.state.comments.map(function(comment) {
      return <Comment key={comment.id} comment={comment} />;
    });

    return (
      <div className="row">
        {comments}
      </div>
    );
  }
});

module.exports = Profile;