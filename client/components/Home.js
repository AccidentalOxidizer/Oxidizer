var React = require('react');

var Home = React.createClass({
  render: function() {
    // TODO: build out actual landing page
    return (
      <div>
    <div className="jumbotron">
      <div className="container-fluid">
      <div className="row">
      <div className="col-xs-12 col-sm-5">
      <h1>Oxidizer IO</h1>
        <p>A unified commenting system for the internet, allowing anyone to annotate any web entity via browser extensions.</p>
        <p>Get the Chrome Extension now!</p>
        <p><a className="" href="#" role="button">
          <img className="img-responsive chrome" src="lib/images/ChromeWebStore_BadgeWBorder_v2_340x96.png" alt=""/></a></p>
      </div>
      <div id="myCarousel" className="col-xs-12 col-sm-7 carousel slide" data-ride="carousel" data-interval="4000">
      <ol className="carousel-indicators">
        <li data-target="#myCarousel" data-slide-to="0" className="active"></li>
        <li data-target="#myCarousel" data-slide-to="1" className=""></li>
      </ol>
      <div className="carousel-inner" role="listbox">
        <div className="item active">
          <img className="first-slide" src="lib/images/screens/1.png" alt="First slide"/>
          <div className="container">
            <div className="carousel-caption">
              <h2>image 1</h2>
            </div>
          </div>
        </div>
        <div className="item">
          <img className="second-slide" src="lib/images/screens/3.png" alt="Second slide"/>
          <div className="container">
            <div className="carousel-caption">
              <h2>image 2</h2>
            </div>
          </div>
        </div>
      </div>
      <a className="left carousel-control" href="#myCarousel" role="button" data-slide="prev">
        <span className="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
        <span className="sr-only">Previous</span>
      </a>
      <a className="right carousel-control" href="#myCarousel" role="button" data-slide="next">
        <span className="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
        <span className="sr-only">Next</span>
      </a>
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
          <h2>Heading</h2>
          <p>Donec sed odio dui. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Vestibulum id ligula porta felis euismod semper. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.</p>
          <p><a className="btn btn-default" href="#" role="button">View details</a></p>
        </div>
      </div>
    </div>

    </div>
    );
  }
});

module.exports = Home;