var React = require('react');
var Comment = require('./Comment');
var Router = require('react-router');
var InfiniteScroll = require('react-infinite-scroll')(React);

// At the moment, Profile will only be used to display your personal
// profile, not that of others.
var Profile = React.createClass({
  mixins: [Router.State, Router.Navigation],

  getInitialState: function() {
    return {
      userAvatar: '',
      displayName: '',
      comments: [],
      numComments: null,
    };
  },

  initLoadState: function() {
    // XXX: Error check that the userId is a valid number?
    this.userId = this.getQuery().userId;

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

    this.showNewReplies = false;
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
  //  ? numberOfComments: optional value that determines number of 
  //    comments loaded per call; defaults to 25
  loadComments: function() {
    // Adjust loading API and parameters according to whether we
    // are loading user comments or user favorited comments.
    var url;
    var query;

    
    if (this.loadFavorites) {
      url = window.location.origin + '/api/comments/faves/getForUser';
      query = {
        getHeartedByUser: true,
      };
    } else if (this.showNewHearts){ 
      url = window.location.origin + '/api/comments/newhearts';

      query = {
        userId: this.userId,
      };
    } else if (this.showNewReplies){

      url = window.location.origin + '/api/comments/newreplies';

      query = {
        userId: this.userId,
      };
    } else {
      url = window.location.origin + '/api/comments',

      query = {
        filterByUser: true,
        isPrivate: this.privateFeed
      };

      // To load any user's comments, pass in the userId in a query string
      // e.g. http://localhost:3000/#/profile?userId=1
      console.log("Profile loadComments: userId param is ", this.userId);
      if (this.userId) {
        query.userId = +this.userId;
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
        console.log('USER DATA: ', data);

        // If we loaded new comments on this iteration, update the value
        // to store the id of the oldest comment loaded which will be
        // at the last element of the comments array.
        this.oldestLoadedCommentId = data.comments.length > 0 ?
          data.comments[data.comments.length - 1].id : this.oldestLoadedCommentId;
        console.log('Profile loadComments: oldestLoadedCommentId ' + this.oldestLoadedCommentId);

        this.currentTime = data.currentTime;

        // If the number of loaded comments is less than 25 (XXX - should have a 
        // constant for this), we've loaded all the comments of this type.
        this.hasMoreComments = (data.comments.length < 25) ? false : true;
        console.log('Profile loadComments: comments.length: ' + data.comments.length + ' hasMoreComments? ' + this.hasMoreComments);

        // If reloading for a new comment set (e.g. for a search query, 
        // or for loading favorited comments) reset the comments array;
        // otherwise append older comments now loaded to the end.
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
        var updatedNumComments = this.state.numComments || data.userInfo.numComments;

        this.setState({
          displayName: data.userInfo.username,
          userAvatar: data.userInfo.userAvatar,
          comments: updatedComments,
          numComments: updatedNumComments,
        });
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(xhr, status, err.message);
        
        // We usually get an error if the user isn't logged in.
        // Transition to route:
        this.transitionTo('app');
      }.bind(this)
    });
  },

  resetLoadState: function(loadFavorites, showNewReplies, showNewHearts) {
    this.showNewReplies = showNewReplies || false;
    this.showNewHearts = showNewHearts || false;
    this.loadFavorites = loadFavorites;
    this.oldestLoadedCommentId = 'undefined';
    this.numLoads = 0;
  },

  loadUserComments: function() {
    console.log("Profile: loadUserComments, oldestLoadedCommentId " + this.oldestLoadedCommentId);

    this.resetLoadState(false);

    // Clear out state for Url and Text search if we are loading all comments
    this.urlSearch = '';
    this.textSearch = '';

    this.loadComments();
  },

  loadUserCommentsForUrl: function(url) {
    console.log("Profile: loadUserCommentsForUrl, " + url);

    this.resetLoadState(false);

    // Only allow search on Url or Text, not both
    this.urlSearch = url;
    this.textSearch = '';

    this.loadComments();
  },

  loadUserCommentsForText: function(text) {
    console.log("Profile: loadUserCommentsForText, " + text);

    this.resetLoadState(false);
    
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

    this.resetLoadState(true);

    // Clear out state for Url and Text search for load of favorites
    this.urlSearch = '';
    this.textSearch = '';

    this.loadComments();
  },

  loadNewReplies: function() {
    console.log('Profile: requested loadNewReplies');

    this.resetLoadState(false, true);

    // Clear out state for Url and Text search for load of favorites
    this.urlSearch = '';
    this.textSearch = '';

    this.loadComments();
  },
  
  loadNewHearts: function() {
    console.log('Profile: requested loadNewHearts');

    this.resetLoadState(false, false, true);

    // Clear out state for Url and Text search for load of favorites
    this.urlSearch = '';
    this.textSearch = '';

    this.loadComments();
  },

  // Delete the comment at index in the comments array.
  // Optimistically delete the comment from the view.
  deleteComment: function(index) {
    var deletedComment = this.state.comments.splice(index, 1)[0];

    console.log("Profile: requesting delete of comment ", deletedComment);
    this.setState({comments: this.state.comments});

    $.ajax({
      url: window.location.origin + '/api/comments/remove/' + deletedComment.id,
      method: "DELETE",
      contentType: "application/json",
      success: function(data) {
        console.log('Profile: delete successful.');
      },
      error: function(xhr, status, err) {
        console.error(xhr, status, err.message);
      }
    });
  },
  // Dismiss all user notifications
  dismissNotifications: function() {
    $.ajax({
      url: window.location.origin + '/api/user/notifications/markread',
      method: 'GET',
      contentType: "application/json",
      success: function(data) {
        console.log('notifications dismissed')
      },
      error: function(xhr, status, err) {
        console.error(xhr, status, err.message);
      }
    })
  },

  render: function() {
    // Optional header with more options if loading our personal profile
    var optionalHeader;
    var isPersonalProfile = this.userId ? false : true;

    if (isPersonalProfile) {
      optionalHeader = (
        <div>
            <nav className="navbar navbar-default navbar-comments">
              <div className="">
                <div className="navbar-header">
                <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar-comments-collapse" aria-expanded="false">
                  <span className="sr-only">Toggle navigation</span>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                </button>
                  <p className="navbar-brand" href="#">Comments</p>
                </div>
                <div id="navbar" className="navbar-collapse" id="navbar-comments-collapse">
                
                  <ul className=" nav navbar-nav">
                    <li className="dropdown">
                      <a id="privacy-select" href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                      Privacy <span className="caret"></span></a>
                      <ul className="dropdown-menu" aria-labelledby="privacy-select">
                        <li><a onClick={this.selectPrivateComments} href="#">Show Private Comments</a></li>
                        <li><a onClick={this.selectPublicComments} href="#">Show Public Comments</a></li>
                      </ul>
                    </li>
                    <li>
                      <form className="navbar-form " onSubmit={this.handleUrlSearch}>
                        <div className="input-group">
                          <input type="text" className="form-control" placeholder="Search for URL" ref="searchUrl" />
                          <div className="input-group-btn">
                              <button type="submit" className="btn btn-default btn-success"><i className="fa fa-search"></i></button>
                          </div>
                        </div>
                      </form>
                    </li>
                    <li>
                      <form className="navbar-form" onSubmit={this.handleTextSearch}>
                      <div className="input-group">
                          <input type="text" className="form-control" placeholder="Search for Comment Text" ref="searchText" />
                          <div className="input-group-btn">
                              <button type="submit" className="btn btn-default btn-success"><i className="fa fa-search"></i></button>
                          </div>
                        </div>
                      </form>
                    </li>
                  </ul>
                  <ul className="nav navbar-nav navbar-right">
                  
                    <li className="reset-comment-search"><a className="reset-comment-search" onClick={this.resetComments}><i className="fa fa-times"></i></a></li>
                  
                  </ul>
                </div>
              </div>
            </nav>

            <nav className="navbar navbar-default navbar-comments">
              <div className="">
                <div className="navbar-header">
                  <p className="navbar-brand">Reactions</p>
                </div>
                <div id="navbar" className="navbar-collapse">
                  <ul className="nav navbar-nav">
      
                    <li><a className="" onClick={this.loadNewReplies}><i className="fa fa-comments-o"></i> Comments with new replies</a></li>
                    <li><a className="" onClick={this.loadNewHearts}><i className="fa fa-heart"></i> Comments with new favorites</a></li>
                  </ul>
                  <ul className="nav navbar-nav navbar-right">
                    <li className="dismiss-notifications"><a className="dismiss-notifications" onClick={this.dismissNotifications}><i className="fa fa-times"></i> Dismiss all</a></li>
                  </ul>
                </div>
              </div>
            </nav>
        </div>
      );
    }

    var comments = this.state.comments.map(function(comment, i) {
      return <Comment key={comment.id} comment={comment}
              allowDelete={isPersonalProfile} deleteComment={this.deleteComment.bind(null, i)}  />;
    }.bind(this));



    return (
      <div className="container">
      <div className="row profile">
        <div className="hidden-xs col-sm-2 col-md-3">
          <p><img src={this.state.userAvatar + '&s=512'} className="img-thumbnail profile-image" /></p>
          <h2>{this.state.displayName}</h2>
          <p>Total Comments: {this.state.numComments}</p>
        </div>

        <div className="col-xs-12 col-sm-10 col-md-9">
          {optionalHeader}

         
          <div className="row">
          <div className="col-xs-12">

          <InfiniteScroll pageStart="0" loadMore={this.loadMoreComments} hasMore={this.hasMoreComments} 
              loader={<div className="loader">Loading ...</div>}>
            {comments}
          </InfiniteScroll>
          </div>
          </div>
        </div>
      </div>
      </div>
    );
  }

});

module.exports = Profile;