var React = require('react');

var Home = React.createClass({
  render: function() {
    return (
      <div>
    <div className="jumbotron">
      <div className="container">
      <div className="row">
      <div className="col-xs-12">
      <h1>Oxidizer IO</h1>
        <p>A unified commenting system for the internet, allowing anyone to annotate any web entity via browser extensions.</p>
        <p>Get the Chrome Extension now!</p>
        <p><a className="" href="#" role="button">
          <img className="img-responsive chrome" src="lib/images/ChromeWebStore_BadgeWBorder_v2_340x96.png" alt=""/></a></p>
      </div>
     

    </div>
    </div>
    </div>

    <div className="container">
      <div className="row">
        <div className="col-md-4">
          <h2>Heading</h2>
          <p>Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui. </p>
          <p><a className="btn btn-default" href="#" role="button">View details</a></p>
        </div>
        <div className="col-md-4">
          <h2>Heading</h2>
          <p>Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui. </p>
          <p><a className="btn btn-default" href="#" role="button">View details</a></p>
       </div>
        <div className="col-md-4">
          <h2>Open Source</h2>
          <p>Oxidizer.io is open source. Get it on Github, fork it, or contribue.</p>
          <p><a className="btn btn-default" target="_blank" href="https://github.com/AccidentalOxidizer/Oxidizer" role="button">GitHub</a></p>
        </div>
      </div>
    </div>

    </div>
    );
  }
});

module.exports = Home;