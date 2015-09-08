var React = require('react');
var Comment = require('./Comment');

// At the moment, Profile will only be used to display your personal
// profile, not that of others.
var Profile = React.createClass({
  getInitialState: function() {
    return {
      displayName: '',
      comments: [],
      numComments: 0,
      // API expects string 'undefined' on first load
      oldestLoadedCommentId: 'undefined',
      currentTime: undefined
    };
  },

  loadComments: function(queryObj) {
    $.ajax({
      url: window.location.origin + '/api/comments/get/user',
      data: queryObj,
      method: 'GET',
      dataType: 'json',
      success: function(data) {
        console.log('Profile init: successfully loaded user comments');
        console.log(data);

        // XXX EE: what's the right thing to store here?
        // For now, if no comments returned, keep it the same as it was.
        // What if you have comments, but then you run a query -> 0 comments returned?
        var oldestLoadedCommentId = data.comments.length > 0 ?
          data.comments[data.comments.length - 1].id : oldestLoadedCommentId;

        // If reloading for a search query, reset the comments array;
        // otherwise append older comments now loaded to the end.
        // Also, only update the numComments total if not querying.
        var updatedComments;
        var updatedNumComments;

        // XXX: edge case where a user searches on 'undefined'
        if (queryObj.url !== 'undefined' || queryObj.text !== 'undefined') {
          updatedComments = data.comments;
          updatedNumComments = this.state.numComments;
        } else {
          updatedComments = this.state.comments.concat(data.comments);
          updatedNumComments = data.numComments;
        }

        this.setState({
          displayName: data.displayName,
          comments: updatedComments,
          numComments: updatedNumComments,
          oldestLoadedCommentId: oldestLoadedCommentId,
          currentTime: data.currentTime
        });
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(xhr, status, err.message);
      }
    });
  },

  loadUserComments: function() {
    console.log("Profile: loadUserComments, " + this.state.oldestLoadedCommentId);
    this.loadComments({
      oldestLoadedCommentId: this.state.oldestLoadedCommentId,
      url: 'undefined',
      text: 'undefined'
    });
  },

  loadUserCommentsForUrl: function(url) {
    console.log("Profile: loadUserCommentsForUrl, " + url);
    this.loadComments({
      oldestLoadedCommentId: 'undefined',
      url: url,
      text: 'undefined'
    });
  },

  loadUserCommentsForText: function(text) {
    console.log("Profile: loadUserCommentsForText, " + text);
    this.loadComments({
      oldestLoadedCommentId: 'undefined',
      url: 'undefined',
      text: text
    });
  },

  componentDidMount: function() {
    this.loadUserComments();
  },

  handleUrlSearch: function() {
    var url = this.refs.searchUrl.getDOMNode().value;
    this.refs.searchUrl.getDOMNode().value = '';

    this.loadUserCommentsForUrl(url);
  },

  handleTextSearch: function() {
    var text = this.refs.searchText.getDOMNode().value;
    this.refs.searchText.getDOMNode().value = '';

    this.loadUserCommentsForText(text);
  },

  render: function() {
    var comments = this.state.comments.map(function(comment) {
      return <Comment key={comment.id} comment={comment} />;
    });

    return (
      <div className="row">
        <div className="col-md-4">
          <h2>{this.state.displayName}</h2>
          <p>Total Comments: {this.state.numComments}</p>
        </div>
        <div className="col-md-8">
          <form onSubmit={this.handleUrlSearch}>
            <div className="form-group col-sm-7">
              <input type="text" className="form-control" placeholder="Search for URL" ref="searchUrl" />
            </div>
            <div className="form-group col-sm-5">
              <button type="submit" className="btn btn-block btn-primary">Search</button>
            </div>
          </form>
          <form onSubmit={this.handleTextSearch}>
            <div className="form-group col-sm-7">
              <input type="text" className="form-control" placeholder="Search for Comment Text" ref="searchText" />
            </div>
            <div className="form-group col-sm-5">
              <button type="submit" className="btn btn-block btn-primary">Search</button>
            </div>
          </form>
          {comments}
        </div>
      </div>
    );
  }
});

module.exports = Profile;