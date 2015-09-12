var React = require('react');
var Comment = require('./Comment');
var InfiniteScroll = require('react-infinite-scroll')(React);

// At the moment, Profile will only be used to display your personal
// profile, not that of others.
var Profile = React.createClass({
  getInitialState: function() {
    return {
      userAvatar: '',
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

    // Default to loading public comments initially.
    // TODO? Persist a default setting for the user?
    this.privateFeed = false;

    // Are we loading the user's favorited comments?
    this.loadFavorites = false;
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
    // Adjust loading API and parameters according to whether we
    // are loading user comments or user favorited comments.
    var url;
    var query;

    if (this.loadFavorites) {
      url = window.location.origin + '/api/comments/faves/getForUser',
      query = {};
    } else {
      url = window.location.origin + '/api/comments/get',

      query = {
        filterByUser: true,
        isPrivate: this.privateFeed
      }

      if (this.urlSearch !== '') {
        query.urlSearch = this.urlSearch;
      }

      if (this.textSearch !== '') {
        query.textSearch = this.textSearch;
      }
    }

    // Don't send this query value on first load.
    if (this.numLoads !== 0) {
      query.lastCommentId = this.oldestLoadedCommentId;
    }
    console.log("Profile loadComments: numLoads ", this.numLoads);


    console.log("Profile loadComments: url ", url);
    console.log("Profile loadComments: query ", query);

    $.ajax({
      url: url,
      data: query,
      method: 'GET',
      dataType: 'json',
      success: function(data) {
        console.log('Profile: successfully loaded comments');

        // Print user data in the console.
        console.log('USER DATA: ', data);

        // XXX EE: what's the right thing to store here?
        // For now, if no comments returned, keep it the same as it was.
        // What if you have comments, but then you run a query -> 0 comments returned?
        this.oldestLoadedCommentId = data.comments.length > 0 ?
          data.comments[data.comments.length - 1].id : this.oldestLoadedCommentId;
        console.log('Profile loadComments: oldestLoadedCommentId ' + this.oldestLoadedCommentId);

        // Update the time ...
        this.currentTime = data.currentTime;

        // If the number of loaded comments is less than 25 (XXX - should have a 
        // constant for this), we've loaded all the comments of this type.
        this.hasMoreComments = (data.comments.length < 25) ? false : true;
        console.log('Profile loadComments: comments.length: ' + data.comments.length + ' hasMoreComments? ' + this.hasMoreComments);

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

        console.log('Ava', data.userInfo);

        this.setState({
          displayName: data.userInfo.username,
          userAvatar: data.userInfo.userAvatar,
          comments: updatedComments,
          numComments: updatedNumComments,
        });
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(xhr, status, err.message);
      }
    });
  },

  loadUserComments: function() {
    console.log("Profile: loadUserComments, oldestLoadedCommentId " + this.oldestLoadedCommentId);

    this.loadFavorites = false;
    this.oldestLoadedCommentId = 'undefined';
    this.numLoads = 0;

    // Clear out state for Url and Text search if we are loading all comments
    this.urlSearch = '';
    this.textSearch = '';

    this.loadComments();
  },

  loadUserCommentsForUrl: function(url) {
    console.log("Profile: loadUserCommentsForUrl, " + url);

    this.loadFavorites = false;
    this.oldestLoadedCommentId = 'undefined';
    this.numLoads = 0;

    // Only allow search on Url or Text, not both
    this.urlSearch = url;
    this.textSearch = '';

    this.loadComments();
  },

  loadUserCommentsForText: function(text) {
    console.log("Profile: loadUserCommentsForText, " + text);

    this.loadFavorites = false;
    this.oldestLoadedCommentId = 'undefined';
    this.numLoads = 0;

    // Only allow search on Url or Text, not both
    this.urlSearch = '';
    this.textSearch = text;

    this.loadComments();
  },

  // Used by InfiniteScroll addon
  loadMoreComments: function() {
    console.log("Profile: loadMoreComments");
    
    this.loadComments();
  },

  componentDidMount: function() {
    this.initLoadState();
    this.loadUserComments();
  },

  handleUrlSearch: function(e) {
    e.preventDefault();

    var url = this.refs.searchUrl.getDOMNode().value;
    this.refs.searchUrl.getDOMNode().value = '';

    this.loadUserCommentsForUrl(url);
  },

  handleTextSearch: function(e) {
    e.preventDefault();
    var text = this.refs.searchText.getDOMNode().value;
    this.refs.searchText.getDOMNode().value = '';

    this.loadUserCommentsForText(text);
  },

  // After the private/public comment feed option is selected, simply
  // load all of the user's comments again with the new setting. If
  // the user was currently in the middle of a url or text search, it
  // will need to be repeated after the setting change.
  selectPrivateComments: function(e) {
    e.preventDefault();

    console.log("Profile: selecting private comments");
    this.privateFeed = true;

    this.loadUserComments();
  },

  selectPublicComments: function(e) {
    e.preventDefault();

    console.log("Profile: selecting public comments");
    this.privateFeed = false;

    this.loadUserComments();
  },

  resetComments: function(e) {
    e.preventDefault();
    this.loadUserComments();
  },

  loadUserFavorites: function() {
    console.log('Profile: requested loadUserFavorites');

    this.loadFavorites = true;
    this.oldestLoadedCommentId = 'undefined';
    this.numLoads = 0;

    // Clear out state for Url and Text search for load of favorites
    this.urlSearch = '';
    this.textSearch = '';

    this.loadComments();
  },

  render: function() {
    var comments = this.state.comments.map(function(comment) {
      return <Comment key={comment.id} comment={comment} />;
    });

          // <div className="col-sm-offset-3 col-sm-6">
            // <p><a href="#">Clear Search</a> | <a href="#">Public</a></p>
    return (
      <div className="row">
        <div className="col-md-4">
          <p><img src={this.state.userAvatar} width="200px" /></p>
          <h2>{this.state.displayName}</h2>
          <p>Total Comments: {this.state.numComments}</p>
        </div>
        <div className="col-md-8">
          <div className="row">
            <div className="dropdown">
              <button className="btn btn-default dropdown-toggle" type="button" id="privacy-select"
                data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                Comment Options <span className="caret"></span>
              </button>
              <ul className="dropdown-menu" aria-labelledby="privacy-select">
                <li><a onClick={this.selectPrivateComments} href="#">Show Private Comments</a></li>
                <li><a onClick={this.selectPublicComments} href="#">Show Public Comments</a></li>
              </ul>
                | <a onClick={this.resetComments} href="#">Clear Search</a>
                | <a onClick={this.loadUserFavorites}>Load Favorites</a>
            </div>
            <hr />
          </div>
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

module.exports = Profile;