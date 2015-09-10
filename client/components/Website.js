var React = require('react');
var Comment = require('./Comment');

// At the moment, Website will only be used to display your personal
// Website, not that of others.
// 
// Load all the comments for this user into this.state.comments
// Need to store maxCommentId ... last comment in array id
// comments[length - 1].id
// 
var Website = React.createClass({
  getInitialState: function() {
    return {
      comments: [],
      lastCommentId: -1
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
        console.log('Website init: successfully loaded user comments');
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

  loadComments: function(){
    var query = {};


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
          <InfiniteScroll pageStart="0" loadMore={this.loadMoreComments} hasMore={this.hasMoreComments} 
              loader={<div className="loader">Loading ...</div>}>
            {comments}
          </InfiniteScroll>
        </div>
      </div>
    );
  }
});

module.exports = Website;