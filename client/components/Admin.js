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

  loadComments: function(queryObj) {
    $.ajax({
      url: window.location.origin + '/api/comments/get/user',
      data: queryObj,
      method: 'GET',
      dataType: 'json',
      success: function(data) {
        console.log('Profile init: successfully loaded user comments');

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


  render: function() {
    var comments = this.state.comments.map(function(comment) {
      return <Comment key={comment.id} comment={comment} />;
    });
    
    return (
      <div className="row">
        Hello! ADMIN PAGE!
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
          comments go here....
        </div>
      </div>
    );
  }
});

module.exports = Admin;