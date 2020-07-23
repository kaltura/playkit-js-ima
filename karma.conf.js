const path = require('path');
let webpackConfig = require('./webpack.config.js');
//Need to remove externals otherwise they won't be included in test
delete webpackConfig.externals;
// Need to define inline source maps when using karma
webpackConfig.devtool = 'inline-source-map';
// Need to add alias for a specific kaltura-player-js export lib
webpackConfig.resolve = webpackConfig.resolve || {};
webpackConfig.resolve.alias = webpackConfig.resolve.alias || {};
webpackConfig.resolve.alias['kaltura-player-js'] = path.resolve('./node_modules/kaltura-player-js/dist/kaltura-ovp-player');

const isWindows = /^win/.test(process.platform);
const isMacOS = /^darwin/.test(process.platform);
// Create custom launcher in case running with Travis
const customLaunchers = {
  Chrome_travis_ci: {
    base: 'Chrome',
    flags: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required']
  }
};

const launchers = {
  Chrome_browser: {
    base: 'Chrome',
    flags: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required']
  }
};

module.exports = function (config) {
  let karmaConf = {
    logLevel: config.LOG_INFO,
    browserDisconnectTimeout: 30000,
    browserNoActivityTimeout: 60000,
    customLaunchers: launchers,
    browsers: ['Chrome_browser', 'Firefox'],
    concurrency: 1,
    singleRun: true,
    colors: true,
    frameworks: ['mocha'],
    files: ['test/setup/karma.js'],
    preprocessors: {
      'src/**/*.js': ['webpack', 'sourcemap'],
      'test/setup/karma.js': ['webpack', 'sourcemap']
    },
    reporters: ['mocha', 'coverage'],
    webpack: webpackConfig,
    webpackServer: {
      noInfo: true
    },
    client: {
      mocha: {
        reporter: 'html',
        timeout: 50000
      }
    }
  };

  if (process.env.TRAVIS) {
    karmaConf.customLaunchers = customLaunchers;
    karmaConf.browsers = ['Chrome_travis_ci'];
  } else {
    if (isWindows) {
      karmaConf.browsers.push('IE');
    } else if (isMacOS) {
      karmaConf.browsers.push('Safari');
    }
  }

  config.set(karmaConf);
};
