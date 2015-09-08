var React = require('react');

// A Comment component that can be applied to a user profile feed,
// a url feed, or any other comment list.
// Comment data will be passed down in this.props.comment.
//
// TODO:
// - Show a delete link if this comment belongs to the logged in user?
//   How does the comment get deleted from the feed?
// - Show # Hearts?
//
var Comment = React.createClass({
  propTypes: {
    comment: React.PropTypes.object.isRequired
  },
  
  render: function() {
    return (
      <div>
        <p><strong>{this.props.comment.User.name}</strong> | {this.props.comment.Url.url} | {this.props.comment.createdAt}</p>
        <p>{this.props.comment.text}</p>
      </div>
    );
  }
});

module.exports = Comment;