var React = require('react');
var Comment = require('./Comment');
// var InfiniteScroll = require('react-infinite-scroll')(React);

// At the moment, Profile will only be used to display your personal
// profile, not that of others.
var Profile = React.createClass({
  getInitialState: function() {
    return {
      displayName: '',
      comments: [],
      numComments: null,
    };
  },

  initLoadState: function() {
    this.oldestLoadedCommentId = 'undefined';
    this.currentTime = undefined;

    // Used by InfiniteScroll addon
    this.hasMoreComments = true;

    // How many times have we loaded this current feed? 
    // (Really only matters if 0)
    this.numLoads = 0;

    // If neither of these are set, load all comments.
    // Otherwise search on one should clear the other.
    this.urlSearch = '';
    this.textSearch =  '';
  },

  // Query fields:
  //  * filterByUser: set to true to indicate to load
  //      comments for the logged in user
  //  - isPrivate: currently 'false'
  //  - repliesToId (n/a for this route?)
  //  - lastCommentId: oldestLoadedCommentId
  //  - url (n/a for this route)
  //  * urlSearch 
  //  * textSearch
  loadComments: function() {
    var query = {
      filterByUser: true,
      isPrivate: false
    }

    // Don't send this query value on first load.
    if (this.numLoads !== 0) {
      query.lastCommentId = this.oldestLoadedCommentId;
    }

    if (this.urlSearch !== '') {
      query.urlSearch = this.urlSearch;
    }

    if (this.textSearch !== '') {
      query.textSearch = this.textSearch;
    }

    console.log("Profile loadComments: query ", query);

    $.ajax({
      url: window.location.origin + '/api/comments/get',
      data: query,
      method: 'GET',
      dataType: 'json',
      success: function(data) {
        console.log('Profile init: successfully loaded user comments');

        // XXX EE: what's the right thing to store here?
        // For now, if no comments returned, keep it the same as it was.
        // What if you have comments, but then you run a query -> 0 comments returned?
        this.oldestLoadedCommentId = data.comments.length > 0 ?
          data.comments[data.comments.length - 1].id : this.oldestLoadedCommentId;
        console.log('Profile init: oldestLoadedCommentId ' + this.oldestLoadedCommentId);

        // Update the time ...
        this.currentTime = data.currentTime;

        // If the number of loaded comments is less than 25 (XXX - should have a 
        // constant for this), we've loaded all the comments of this type.
        this.hasMoreComments = (data.comments.length < 25) ? false : true;

        // If reloading for a search query, reset the comments array;
        // otherwise append older comments now loaded to the end.
        // Also, only update the numComments total if not querying.
        var updatedComments;

        // If loading a comment feed for the first time, intialize the comments; 
        // otherwise, append the new comments.
        if (this.numLoads === 0) {
          updatedComments = data.comments;
        } else {
          updatedComments = this.state.comments.concat(data.comments);
        }
        this.numLoads++;

        // Only update the numComments total if not null, i.e. on first load
        var updatedNumComments = this.state.numComments || data.numComments;

        this.setState({
          displayName: data.userInfo.username,
          comments: updatedComments,
          numComments: updatedNumComments,
        });
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(xhr, status, err.message);
      }
    });
  },

  //
  // For the next three functions, firstLoad indicates that this feed needs to
  // be (re)initialized.
  // 
  loadUserComments: function(firstLoad) {
    console.log("Profile: loadUserComments, oldestLoadedCommentId " + this.oldestLoadedCommentId);

    this.oldestLoadedCommentId = firstLoad ? 'undefined' : this.oldestLoadedCommentId;
    this.numLoads = firstLoad ? 0 : this.numLoads;


    // Clear out state for Url and Text search if we are loading all comments
    this.urlSearch = '';
    this.textSearch = '';

    this.loadComments();
  },

  loadUserCommentsForUrl: function(url, firstLoad) {
    console.log("Profile: loadUserCommentsForUrl, " + url);

    this.oldestLoadedCommentId = firstLoad ? 'undefined' : this.oldestLoadedCommentId;
    this.numLoads = firstLoad ? 0 : this.numLoads;

    console.log("oldestLoadedCommentId: " + this.oldestLoadedCommentId + " numLoads " + this.numLoads);

    // Only allow search on Url or Text, not both
    this.urlSearch = url;
    this.textSearch = '';

    this.loadComments();
  },

  loadUserCommentsForText: function(text, firstLoad) {
    console.log("Profile: loadUserCommentsForText, " + text);

    this.oldestLoadedCommentId = firstLoad ? 'undefined' : this.oldestLoadedCommentId;
    this.numLoads = firstLoad ? 0 : this.numLoads;

    // Only allow search on Url or Text, not both
    this.urlSearch = '';
    this.textSearch = text;

    this.loadComments();
  },

  // Used by InfiniteScroll addon
  // We make a new request to load comments based on oldestLoadedCommentId ...
  // XXX - loadMoreComments appears to be called right away ... and then
  // loadUserComments is called again ... maybe remove call in componentDidMount?
  // XXX - should we be calling the loading function that we last used?
  // e.g. we were last loading for URL search, so we should continue doing so ...
  // Or maybe this whole thing would be better as pagination ...
  loadMoreComments: function() {
    console.log("Profile: loadMoreComments");

    // XXX - at this point, we've already moved the query params into
    // loadComments, so I think we don't even need to call the different
    // load functions ... and we may not need to have the loadType ...
    // this.loadComments();
  },

  // XXX EE: does this get called early enough to initialize state???
  componentDidMount: function() {
    this.initLoadState();
    this.loadUserComments(true);
  },

  handleUrlSearch: function() {
    var url = this.refs.searchUrl.getDOMNode().value;
    this.refs.searchUrl.getDOMNode().value = '';

    this.loadUserCommentsForUrl(url, true);
  },

  handleTextSearch: function() {
    var text = this.refs.searchText.getDOMNode().value;
    this.refs.searchText.getDOMNode().value = '';

    this.loadUserCommentsForText(text, true);
  },

  render: function() {
    var comments = this.state.comments.map(function(comment) {
      return <Comment key={comment.id} comment={comment} />;
    });

          // <InfiniteScroll pageStart="0" loadMore={this.loadMoreComments} hasMore={this.state.hasMoreComments} 
          //     loader={<div className="loader">Loading ...</div>}>
          // </InfiniteScroll>
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