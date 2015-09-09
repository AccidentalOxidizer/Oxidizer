var React = require('react');

// A Comment component that can be applied to a user profile feed,
// a url feed, or any other comment list.
// Comment data will be passed down in this.props.comment.
//
// TODO:
// - Show a delete link if this comment belongs to the logged in user?
//   How does the comment get deleted from the feed?
// - Show # Hearts?

// TODO: We need a way to check if user is either viewing their own comments
//       or if the user is an Admin and they can view all these things! Going
//       to simulate this for now.

var userStatus = 1;

var CommentActions = React.createClass({
  removeComment: function() {
    alert('HELLO! ' + this.props.commentid);
  },

  render: function() {
    console.log('COMMENT ID: ', this.props.commentid);
    if (userStatus === 1) {
      return (
          <p><a onClick={this.removeComment}>DELETE COMMENT</a> | REMOVE FLAG</p>
      );    
    } else {
      return null;  
    }
  }
});

module.exports = CommentActions;