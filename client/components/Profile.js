var React = require('react');
var Comment = require('./Comment');

// At the moment, Profile will only be used to display your personal
// profile, not that of others.
// 
// Load all the comments for this user into this.state.comments
// 
var Profile = React.createClass({

  render: function() {
    return (
      <h2>Your Comments</h2>
    );
  }
});

module.exports = Profile;