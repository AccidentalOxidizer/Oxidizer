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

  findImages: function(text) {

    // RegEx for matching image URLs
    var imagePattern = /\b(https?:\/\/\S+(?:png|jpe?g|gif)\S*)\b/igm;

    // Create an array of matching image URLs
    var isImageLink = text.match(imagePattern);

    // Let's eliminate any duplicate items in our array so things don't get too crazy.
    // Also, if we have the same URL In our array multiple times, things will break!
    if (isImageLink !== null && isImageLink.length > 0) {
      // Create an array of nonDuplicate image links.
      var nonDuplicateImages = [];

      isImageLink.forEach(function(element, index) {
        if (nonDuplicateImages.indexOf(element) === -1) {
          nonDuplicateImages.push(element);
        }
      });

      // Iterate through our array of unique URLs and replace matching image URLs
      // with HTML img tags.
      nonDuplicateImages.forEach(function(imageLink) {
        // Since we want to replace all instances of the URL,
        // we need to create a regEx object and tell it to look
        // for all instances that match within the string using the "/g" modifier.
        var replaceURL = new RegExp(imageLink, 'g');
        text = text.replace(replaceURL, '<p align="center"><img src="' + imageLink + '" style="max-width: 450px;"/></p>');
      });
    }

    return text;
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
    var replyCount = this.props.comment.ReplyCount ? this.props.comment.ReplyCount : 0;

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

    var parseTextForImages = this.findImages(this.props.comment.text);

    var replies = this.state.replies.map(function(comment, i) {
      return <Comment key={comment.id} comment={comment}  />;
    }.bind(this));

    return (
      <div className="comment">
        <div className="row">
          <div className="col-xs-12 comment-header"> 
          Comment on: <a target="_blank" href={'http://'+this.props.comment.url}>{this.props.comment.url}</a> posted: {moment(this.props.comment.createdAt).fromNow()}
          {deleteLink}
          </div>
        </div>
       
        <div className="row"> 
          <div className="col-xs-12 comment-body" dangerouslySetInnerHTML={{__html: parseTextForImages}}></div>
        </div>
        <div className="row">
        <div className="col-xs-12 comment-footer">
          <div className="heart">Received: <i className={heartClass}></i>&nbsp;{hearts} </div>
          
          <div className="replies"><a onClick={this.getReplies}>
            Show replies to comment
          </a> </div>
        </div>
        <div>{replies}</div>
        </div>
      </div>
    );
  }
});

module.exports = Comment;