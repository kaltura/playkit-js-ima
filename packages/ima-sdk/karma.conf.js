const webpackConfig = require('./webpack.config.js');
const karmaConfig = require('../../karma.conf.js');

module.exports = karmaConfig(webpackConfig);
