var React = require('react');

var Signup = React.createClass({

  render: function() {
    return (
      <div>
        <div>
          <a href="/api/auth/google" className="btn btn-social btn-lg btn-google">
              <i className="fa fa-google"></i> Sign Up
          </a>
        </div>
        <br />
        <div>
          <a href="/api/auth/facebook" className="btn btn-social btn-lg btn-facebook">
            <i className="fa fa-facebook"></i> Sign Up
          </a>
        </div>
      </div>
    );
  }
});

module.exports = Signup;