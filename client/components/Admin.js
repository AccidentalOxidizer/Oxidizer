var React = require('react');
var Comment = require('./Comment');

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

// At the moment, Profile will only be used to display your personal
// profile, not that of others.
var Admin = React.createClass({
  mixins: [AuthenticatedUser], // Use the mixin

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
    this.initLoadState();
    this.loadComments();
  },

  deleteComment: function(data_id) {
    var comments = this.state.comments;
    var newComments = comments.filter(function(elem) {
        return elem.id != data_id;
    });

    this.setState({comments: newComments});

    $.ajax({
          url: window.location.origin + '/api/comments/remove/' + data_id,
          method: 'DELETE',
          dataType: 'json',
          success: function() {
            console.log('Successfully removed comment');
          }.bind(this),
          error: function(xhr, status, err) {
            console.error(xhr, status, err.message);
          }
        });
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
      isPrivate: false
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


  render: function() {
    var comments = this.state.comments.map(function(comment) {
      return <Comment key={comment.id} comment={comment} />;
    });

    return (
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
          {comments}
        </div>
      </div>
    );
  }
});

module.exports = Admin;