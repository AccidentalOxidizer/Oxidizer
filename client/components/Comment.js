var React = require('react');
var moment = require('moment');

// A Comment component that can be applied to a user profile feed,
// a url feed, or any other comment list.
// Comment data will be passed down in this.props.comment.
var Comment = React.createClass({
  propTypes: {
    comment: React.PropTypes.object.isRequired,
    allowDelete: React.PropTypes.bool,
    deleteComment: React.PropTypes.func
  },

  getInitialState: function() {
    return {
      replies: []
    };
  },

  getDefaultProps: function() {
    return {
      allowDelete: false,
      deleteComment: function() {}
    };
  },

  getReplies: function(){
    var query = {
      repliesToId: this.props.comment.id
    };

    var context = this;

    $.ajax({
      url: window.location.origin + '/api/comments/replies',
      data: query,
      method: 'GET',
      dataType: 'json',
      success: function(data){
        console.log('received data', data);
        context.setState({replies: data.comments});
      },  
      error: function(err){
        console.log(error);
      }
    });
  },
  
  render: function() {
    var userUrl = window.location.origin + '/#/profile?userId=' + this.props.comment.UserId;
    var hearts = this.props.comment.HeartCount ? this.props.comment.HeartCount : 0;
    var heartClass;

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
            Delete Comment
          </a>
        </div>
      );
    }

    var isPersonalProfile = false;

    var replies = this.state.replies.map(function(comment, i) {
      return <Comment key={comment.id} comment={comment}  />;
    }.bind(this));

    return (
      <div className="comment">
        <div className="row">
          <div className="col-xs-12 comment-header"> 
          Comment on: <a target="_blank" href={'http://'+this.props.comment.url}>{this.props.comment.url}</a> posted: {moment(this.props.comment.createdAt).fromNow()}
          
          </div>
        </div>
       
        <div className="row"> 
          <div className="col-xs-12 comment-body">{this.props.comment.text}</div>
        </div>
        <div className="row">
        <div className="col-xs-12 comment-footer">
          <div className="heart">Received: <i className={heartClass}></i>&nbsp;{hearts} </div>
          {deleteLink}
          <div className="replies">Received: <i className={heartClass}></i><a onClick={this.getReplies}>
            get replies!
          </a> </div>
        </div>
        <div>Replies!!!: {replies}</div>
        </div>
      </div>
    );
  }
});

module.exports = Comment;