var React = require('react');

var Footer = React.createClass({
  render: function() {
    return (
      <div>
      <hr/>
      <div className="container">
      <footer>
        <p><i className="fa fa-copyright"></i> Oxidizer 2015</p>
        </footer>
        </div>
      </div>
    );
  }
});


module.exports = Footer;