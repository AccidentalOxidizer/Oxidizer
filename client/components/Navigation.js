var React = require('react');
var Router = require('react-router');
var Link = Router.Link;

var Navigation = React.createClass({
  // <i className="fa fa-google"></i> Sign Up
  // <li><a href="/api/auth/google">Login | Sign Up with Google</a></li>
  // <a href="/api/auth/google" className="btn btn-social-icon btn-xs btn-google"><i className="fa fa-google"></i></a>
  render: function() {
    return (
      <nav className="navbar navbar-default" role="navigation">
      <div className="container">
        <div className="navbar-header">
          <a className="navbar-brand" href="#">Oxidizer</a>
        </div>
        <ul className="nav navbar-nav navbar-right">
          <li><a href="test/test_favs.html">Test Page</a></li>
          <li><Link to="website" params={{website: ""}}>Websites</Link></li>
          <li><Link to="profile">My Profile</Link></li>

          <li className="dropdown">
            <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button"
              aria-haspopup="true" aria-expanded="false"><span className="caret"></span></a>
            <ul className="dropdown-menu">
              <li>
                <a href="/api/auth/google">Log In | Sign Up with Google</a>
              </li>
              <li>
                <a href="/api/auth/facebook">Log In | Sign Up with Facebook</a>
              </li>
              <li>
                <a href="/api/auth/logout">Log Out</a>
              </li>
            </ul>
          </li>
        </ul>
        </div>
      </nav>
    );
  }
});

module.exports = Navigation;