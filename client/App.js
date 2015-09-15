var React = require('react');
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;
var DefaultRoute = Router.DefaultRoute;
var Route = Router.Route;
var Admin = require('./components/Admin');
var Home = require('./components/Home');
var Profile = require('./components/Profile');
var Signup = require('./components/Signup');
var Login = require('./components/Login');
var Website = require('./components/Website');
var Leaderboard = require('./components/Leaderboard');
var Navigation = require('./components/Navigation');
var Footer = require('./components/Footer');

var App = React.createClass({
  render: function() {
    return (
      <div className="main-container">
        <Navigation />
        <div className="no-container-class-here-please">
          <RouteHandler />
        </div>
        <Footer />
      </div>
    );
  }
});

var routes = (
  <Route name="app" path="/" handler={App}>
    <DefaultRoute handler={Home} />
    <Route name="admin" path="/admin" handler={Admin} />
    <Route name="profile" path="/profile/?:userId?" handler={Profile} />
    <Route name="website" path="/website/:website?" handler={Website} />
    <Route name="leaderboard" path="/leaderboard" handler={Leaderboard} />
  </Route>
);

Router.run(routes, function(Root) {
  React.render(<Root />, document.getElementById('app'));
});     
