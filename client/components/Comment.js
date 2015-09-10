var React = require('react');
var CommentActions = require('./CommentActions');

// A Comment component that can be applied to a user profile feed,
// a url feed, or any other comment list.
// Comment data will be passed down in this.props.comment.
//
// TODO:
// - Show a delete link if this comment belongs to the logged in user?
//   How does the comment get deleted from the feed?
// - Show # Hearts?

// We're passing the comment.id into the CommentActions component
// as a property, that way we can carry out actions on a specific comment.

var Comment = React.createClass({
  propTypes: {
    comment: React.PropTypes.object.isRequired
  },

  onChildChanged: function(newState) {
    console.log('COMMENT.JS STATE CHANGE!', newState);
    this.setState({ checked: 'Raaaannndom' });
    this.props.callbackParent(newState);
  },

  render: function() {
    return (
      <div>
        <p><strong>{this.props.comment.User.name}</strong> | {this.props.comment.Url.url} | {this.props.comment.createdAt}</p>
        <p>{this.props.comment.text}</p>
        <CommentActions commentid={this.props.comment.id} callbackParent={this.onChildChanged}/>
      </div>
    );
  }
});

module.exports = Comment;