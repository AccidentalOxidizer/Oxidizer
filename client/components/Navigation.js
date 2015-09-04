var React = require('react');
var Router = require('react-router');
var Link = Router.Link;

var Navigation = React.createClass({
  render: function() {
    return (
      <nav className="navbar navbar-default" role="navigation">
        <div className="navbar-header">
          <a className="navbar-brand" href="#">Oxidizer</a>
        </div>
        <ul className="nav navbar-nav navbar-right">
          <li><Link to="signup">Sign Up</Link></li>
          <li><Link to="login">Login</Link></li>
        </ul>
      </nav>
    );
  }
});

module.exports = Navigation;