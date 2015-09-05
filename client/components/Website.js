var React = require('react');
var Comment = require('./Comment');

var Website = React.createClass({
  getInitialState: function() {
    return {
    };
  },

  init: function() {
  },

  componentDidMount: function() {
    this.init();
  },

  render: function() {
    return (
      <div>
      <h2>{this.props.params}</h2>

    );
  }
});

module.exports = Website;