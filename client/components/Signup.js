var React = require('react');

var Signup = React.createClass({
  handleGoogleSignup: function(event) {
    event.preventDefault();

    // Q: Our API will automatically redirect us, in success or failure,
    // so is there even anything we need to do here?
    // helpers.googleAuth()
    //   .then(function() {
    //     console.log("Google Auth Sign Up successful.");
    //   })
    //   .catch(function() {
    //   });
    window.location = "/api/auth/google";
    // $.ajax({
    //   url: window.location.origin + '/api/auth/google',
    //   method: 'GET',
    //   dataType: 'json',
    //   // xhrFields: {
    //   //   withCredentials: true
    //   // },
    //   success: function(data) {
    //     console.log('Google Signup successful...');
    //   }.bind(this),
    //   error: function(xhr, status, err) {
    //     console.error(xhr, status, err.message);
    //   }
    // });
  },

  render: function() {
                // <a href="/api/auth/google">Google</a>
        // <button type="button" onClick={this.handleGoogleSignup} className="btn btn-block btn-primary">Sign Up With Google</button>
        // <a onClick={this.handleGoogleSignup}>Sign Up With Google</a>
        // <button type="button" onClick={this.handleGoogleSignup} className="btn btn-block btn-primary">Sign Up With Google</button>
    return (
      <div>
        <a href="/api/auth/google">Google</a>
      </div>
    );
  }
});

module.exports = Signup;