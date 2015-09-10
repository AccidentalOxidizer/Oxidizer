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

  getInitialState: function() {
    return {
      commentId: null,
      lastClickedComment: 'none'
    };
  },

  render: function() {

    var context = this;


    var setLastClicked = function(commentId) {
      console.log('WE BE CLICKING FOOLS IN COMMENT.JS!');
      console.log(context.state);
      context.setState({lastClickedComment: commentId});
    };

    return (
      <div>
        <p><strong>{this.props.comment.User.name}</strong> | {this.props.comment.Url.url} | {this.props.comment.createdAt}</p>
        <p>{this.props.comment.text}</p>
        <CommentActions commentid={this.props.comment.id} setLastClicked={setLastClicked} />
      </div>
    );
  }
});

module.exports = Comment;