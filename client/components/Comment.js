var React = require('react');
var moment = require('moment');

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
    comment: React.PropTypes.object.isRequired,
    allowDelete: React.PropTypes.bool.isRequired,
    deleteComment: React.PropTypes.func.isRequired
  },
  
  render: function() {
    var userUrl = window.location.origin + '/#/profile?userId=' + this.props.comment.UserId;
    var hearts = this.props.comment.HeartCount ? this.props.comment.HeartCount : 0;
    var heartClass;

    console.log("Comment: heartedByUser: ", this.props.comment.HeartedByUser);

    if (this.props.comment.HeartedByUser) {
      heartClass = "fa fa-heart";
    } else {
      heartClass = "fa fa-heart-o";
    }

    // Delete Link: only show if allowed.
    var deleteLink;

    if (this.props.allowDelete) {
      deleteLink = (
        <div className="delete">
          <a onClick={this.props.deleteComment}>
            <i className="fa fa-trash-o"></i>&nbsp; 
          </a>
        </div>
      );
    }

    return (
      <div>
        <p><strong><a href={userUrl}>{this.props.comment.username}</a></strong> | {this.props.comment.url} | {moment(this.props.comment.createdAt).fromNow()}</p>
        <p>{this.props.comment.text}</p>

        <div className="row">
          <div className="heart">
            <i className={heartClass}></i>&nbsp;{hearts}
          </div>
          {deleteLink}
        </div>
      </div>
    );
  }
});

module.exports = Comment;