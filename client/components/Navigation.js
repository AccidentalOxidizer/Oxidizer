var React = require('react');

var Navigation = React.createClass({
  render: function() {
    return (
      <nav className="navbar navbar-default" role="navigation">
        <div className="navbar-header">
          <a className="navbar-brand" href="#">Oxidizer</a>
        </div>
        <ul className="nav navbar-nav navbar-right">
          <li><a href="#">Sign Up</a></li>
          <li><a href="#">Login</a></li>
        </ul>
      </nav>
    );
  }
});

module.exports = Navigation;