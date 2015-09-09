var React = require('react');
var Comment = require('./Comment');

// Create Mixin to check that user has the correct credentials to access this page.
var RoleRequiredMixin = {
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
  mixins: [RoleRequiredMixin], // Use the mixin
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