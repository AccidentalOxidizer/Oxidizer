var config = require('../../config').get().dbconfig;
var Sequelize = require('sequelize');
var sequelize = new Sequelize( config.name, config.username, config.password);

var Heart = sequelize.define('Heart', {});

module.exports = Heart;