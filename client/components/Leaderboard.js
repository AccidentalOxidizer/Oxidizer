var React = require('react');
var Comment = require('./Comment');
var InfiniteScroll = require('react-infinite-scroll')(React);

// Shows the most popular (highest number of people having favorited)
// comments across all sites.
//
// TODO: 
//  - Filter by time? e.g. show the most popular for last day or week?
//  - Set a limit on scrolling to load top xxx comments?
var Leaderboard = React.createClass({
  getInitialState: function() {
    return {
      comments: [],
    };
  },

  initLoadState: function() {
    this.commentOffset = 0;
    this.currentTime = undefined;

    // Used by InfiniteScroll addon
    this.hasMoreComments = true;
  },

  // Query fields:
  //  - orderByHearts: set to 'DESC' to indicate ordering search
  //    by highest number of hearts
  //  - isPrivate: false - load only public comments
  //  - commentOffset: the first row of the next set of comments to
  //    return.
  //  ? numberOfComments: optional value that determines number of 
  //    comments loaded per call; defaults to 25
  loadComments: function() {
    var query = {
      orderByHearts: 'DESC',
      isPrivate: false,
      commentOffset: this.commentOffset
    }

    console.log("Leaderboard loadComments: query ", query);

    $.ajax({
      url: window.location.origin + '/api/comments',
      data: query,
      method: 'GET',
      dataType: 'json',
      success: function(data) {
        console.log('Leaderboard: successfully loaded comments');
        console.log('DATA: ', data);

        // XXX: This comment offset value could become inaccurate if the 
        // top favs change while loading additional comments. This could
        // be fixed if we chose a specific time interval for this search.
        this.commentOffset += data.comments.length;
        console.log('Leaderboard loadComments: commentOffset ' + this.commentOffset);

        this.currentTime = data.currentTime;

        // If the number of loaded comments is less than 25 (XXX - should have a 
        // constant for this), we've loaded all the comments of this type.
        this.hasMoreComments = (data.comments.length < 25) ? false : true;

        var updatedComments = this.state.comments.concat(data.comments);

        this.setState({
          comments: updatedComments
        });
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(xhr, status, err.message);
      }
    });
  },

  componentDidMount: function() {
    this.initLoadState();
    this.loadComments();
  },

  render: function() {
    var comments = this.state.comments.map(function(comment, i) {
      return <Comment key={comment.id} comment={comment} />;
    });

    return (
      <div className="row">
        <div className="col-md-8 col-md-offset-2 leaderboard">
          <h3>The Highest Rated Comments Across The Web</h3>
          <InfiniteScroll pageStart="0" loadMore={this.loadComments} hasMore={this.hasMoreComments} 
              loader={<div className="loader">Loading ...</div>}>
            {comments}
          </InfiniteScroll>
        </div>
      </div>
    );
  }
});

module.exports = Leaderboard;
