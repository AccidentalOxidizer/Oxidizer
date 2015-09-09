var React = require('react');

var React = require('react');
var Comment = require('./Comment');

// At the moment, Profile will only be used to display your personal
// profile, not that of others.
var Admin = React.createClass({
  getInitialState: function() {
    return {
    };
  },


  render: function() {
    return (
      <div className="row">
        Hello! ADMIN PAGE!
      </div>
    );
  }
});

module.exports = Admin;