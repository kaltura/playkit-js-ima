const webpackConfig = require('../../webpack.config');

const entryName = 'playkit-ima';
const libraryName = 'ima';
const dirPath = '/packages/ima-sdk';

module.exports = webpackConfig(entryName, libraryName, dirPath);
