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

  handleClick: function() {
    // console.log('HANDLE CLICK DELETE: ', this.props.comment.id);
    // console.log('before state', this.state);
    //this.props.setLastClicked(this.props.commentid);
  },

  removeComment: function() {
    $.ajax({
      url: window.location.origin + '/api/comments/remove/' + this.props.comment.id,
      method: 'DELETE',
      //dataType: 'json',
      success: function(data) {
        console.log('Removing comment: ', this.props.comment.id);
        this.setState({commentId: this.props.comment.id});
        var getDivId = 'div[data-commentid="' + this.props.comment.id +'"]';
        $(getDivId).hide();
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(xhr, status, err.message);
      }
    });
  },

  removeFlags: function() {
    $.ajax({
      url: window.location.origin + '/api/flags/remove/' + this.props.comment.id,
      method: 'DELETE',
      //dataType: 'json',
      success: function(data) {
        console.log('Removing flags: ', this.props.comment.id);
        this.setState({commentId: this.props.comment.id});
        var getDivId = 'div[data-commentid="' + this.props.comment.id +'"]';
//        $(getDivId).hide();
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(xhr, status, err.message);
      }
    });
  },  

  render: function() {

    // TODO: Add comment actions buttons here.

        // <CommentActions commentid={this.props.comment.id} setLastClicked={setLastClicked} />
    return (
      <div data-commentid={this.props.comment.id}>
        <p><strong>{this.props.comment.User.name}</strong> | {this.props.comment.Url.url} | {this.props.comment.createdAt}</p>
        <p>{this.props.comment.text}</p>
        <p>TOTAL FLAGS: {this.props.comment.Flags} <a onClick={this.removeComment}>DELETE COMMENT</a> | <a onClick={this.removeFlags}>REMOVE FLAGS</a> </p>
      </div>
    );
  }
});

module.exports = Comment;