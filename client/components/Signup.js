var React = require('react');

var Signup = React.createClass({

  render: function() {
    return (
      <div>
        <div><a href="/api/auth/google">Sign Up with Google</a></div>
        <div><a href="/api/auth/facebook">Sign Up with Facebook</a></div>
      </div>
    );
  }
});

module.exports = Signup;