var React = require('react');
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;
var DefaultRoute = Router.DefaultRoute;
var Route = Router.Route;
var Home = require('./components/Home');
var Profile = require('./components/Profile');
var Signup = require('./components/Signup');
var Login = require('./components/Login');
var Website = require('./components/Website');
var Navigation = require('./components/Navigation');

var App = React.createClass({
  render: function() {
    return (
      <div className="main-container">
        <Navigation />
        <div className="container">
          <RouteHandler />
        </div>
      </div>
    );
  }
});

var routes = (
  <Route name="app" path="/" handler={App}>
    <DefaultRoute handler={Home} />
    <Route name="profile" path="/profile" handler={Profile} />
    <Route name="website" path="/website/:website?" handler={Website} />
    <Route name="signup" path="/signup" handler={Signup} />
    <Route name="login" path="/login" handler={Login} />
  </Route>
);

Router.run(routes, function(Root) {
  React.render(<Root />, document.getElementById('app'));
});