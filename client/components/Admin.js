var React = require('react');
var AdminComment = require('./AdminComments');

// Create Mixin to check that user has the correct credentials to access this page.
var AuthenticatedUser = {
  permitted: function (requiredRoles) {
    console.log("Heeeeey");
    // return this.props.profile.roles
    //   .some(role =>
    //     requiredRoles.some(rr => rr === role)
    //   );
  }
};

// Admin Page!
var Admin = React.createClass({
  mixins: [AuthenticatedUser], // Use the mixin

  getInitialState: function() {
    return {
      comments: [],
      numComments: 0,
      // API expects string 'undefined' on first load
      //oldestLoadedCommentId: 'undefined',
      //currentTime: undefined
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

  // XXX EE: does this get called early enough to initialize state???
  componentDidMount: function() {
    //this.initLoadState();
    this.loadComments();
  },

  deleteComment: function(data_id) {
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
      filterByUser: false,
      isPrivate: false,
    };

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

    console.log("Admin Load Comments ", query);

    $.ajax({
      url: window.location.origin + '/api/comments/get',
      data: query,
      method: 'GET',
      dataType: 'json',
      success: function(data) {

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

  sortFlags: function() {
    console.log('Sort by Flags');
  },

  render: function() {

    var context = this;

    var setLastClicked = function(commentId) {
      console.log('WE BE CLICKING FOOLS IN COMMENT.JS!');
      console.log(context.state);
      context.setState({lastClickedComment: commentId});
    };

    console.log('STATE: ', this.state);
    var comments = this.state.comments.map(function(comment) {
      return <AdminComment key={comment.id} comment={comment} setLastClicked={setLastClicked} />;
    });

    return (
      <div className="container">
      <div className="row">
        <h1>Hello! ADMIN PAGE!</h1>
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
          <p>Sort By: <a onClick={this.sortFlags}>FLAGS</a> | <a onClick={this.loadComments}>RECENT</a></p>
          {comments}
        </div>
      </div>
      </div>
    );
  }
});

module.exports = Admin;