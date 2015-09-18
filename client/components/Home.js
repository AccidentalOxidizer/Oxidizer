var React = require('react');

var Home = React.createClass({
  render: function() {
    return (
      <div>
      <div>
        <div className="jumbotron">
          <div className="container">
            <div className="row">
              <div className="col-xs-12">
                <h1>Oxidizer IO</h1>
                  <p>A universal commenting system for the internet, allowing anyone to annotate any web entity via browser extensions.</p>
                  <p>Get the Chrome Extension now!</p>
                  <p><a className="" href="#" role="button">
                    <img className="img-responsive chrome" src="lib/images/ChromeWebStore_BadgeWBorder_v2_340x96.png" alt=""/></a></p>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-sm-6">
              <h2>What and Why?</h2>
              <p>Oxidizer.io aims to provide <i>a unified commenting system for the internet</i>, allowing anyone to annotate any web entity via browser extensions or other clients, independently from the provider and owner of the web content</p>
              <p>Why do we think we need it?
              <ul>
                <li>if a website doesn&#39;t offer commenting, <b>you can&#39;t</b></li>
                <li>if a website wants to take down a specific comment, <b>it can</b></li>
                <li>it&#39;s <b>inconvenient for you</b> to keep signing up and logging into different commenting systems</li>
                <li>your comments are <b>not in 1 place</b></li>
                <li>your comments <b>might be used by 3rd parties</b> without your knowledge</li>
              </ul>
              </p>
            </div>
            <div className="col-xs-12 col-sm-6">
              <h2>Open Source</h2>
              <p>Oxidizer.io is open source. Get it on Github, fork it, or even better... contribute! Hint: Wouldn&#39;t a Firefox extension be awesome?</p>
              <p><a className="btn btn-default" target="_blank" href="https://github.com/AccidentalOxidizer/Oxidizer" role="button">Get it on Github</a></p>
            </div>
          </div>
          <div className="row team">
            <div className="col-xs-12">
              <div className="col-xs-12 headline">
                <h2>Who</h2>
                Oxidizer.io was conceived as a <a href="http://www.hackreactor.com/">Hack Reactor</a> thesis project. <br />Our team <i><a href="https://github.com/AccidentalOxidizer">Accidential Oxidizer</a></i> is made up following amazing .. um .. characters:
              </div>
              <div className="col-xs-12 col-sm-6 col-md-6 media">
                
                <div className="media-body media-middle right">
                  <h4 className="media-heading">Dave Schumaker</h4>
                  <a className="btn btn-default" href="https://github.com/daveschumaker"><i className="fa fa-github"></i> Github</a>&nbsp; 
                  <a className="btn btn-default" href="https://twitter.com/davely"><i className="fa fa-twitter"></i> Twitter</a>
                </div>
                <div className="media-right">
                    <img className="media-object" src="https://avatars3.githubusercontent.com/u/5395723?v=3&s=460" />
                </div>
              </div>
              <div className="col-xs-12 col-sm-6 col-md-6 media">
                <div className="media-left">
                    <img className="media-object" src="https://avatars1.githubusercontent.com/u/8949284?v=3&s=460" />
                </div>
                <div className="media-body media-middle">
                  <h4 className="media-heading">Eliot Winder</h4>
                  <a className="btn btn-default" href="https://github.com/eliotwinder"><i className="fa fa-github"></i> Github</a>
                </div>
              </div>
              <div className="col-xs-12 col-sm-6 col-md-6 media">
                
                <div className="media-body media-middle right">
                  <h4 className="media-heading">Emily Eng</h4>
                  <a className="btn btn-default" href="https://github.com/fractal5"><i className="fa fa-github"></i> Github</a>

                </div>
                <div className="media-right">
                    <img className="media-object" src="https://avatars2.githubusercontent.com/u/12725623?v=3&s=460" />
                </div>
              </div>
              <div className="col-xs-12 col-sm-6 col-md-6 media">
                <div className="media-left">
                    <img className="media-object" src="https://avatars0.githubusercontent.com/u/6237113?v=3&s=460" />
                </div>
                <div className="media-body media-middle">
                  <h4 className="media-heading">Matthias Gattermeier</h4>
                  <a  className="btn btn-default" href="https://github.com/Gattermeier"><i className="fa fa-github"></i> Github</a>&nbsp;
                  <a  className="btn btn-default" href="https://twitter.com/Gattermeier"><i className="fa fa-twitter"></i> Twitter</a>
                </div>
              </div>
            </div>
          </div>

       </div>
    </div>
    </div>
    );
  }
});

module.exports = Home;