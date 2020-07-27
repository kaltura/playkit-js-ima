import {setup} from 'kaltura-player-js';

/**
 * @param {string} targetId _
 * @param {Object} imaConfig _
 * @param {Object} playbackConfig _
 * @returns {Player} _
 */
function loadPlayerWithAds(targetId, imaConfig, playbackConfig) {
  let config = {
    targetId,
    provider: {},
    sources: {
      progressive: [
        {
          mimetype: 'video/mp4',
          url:
            'https://cfvod.kaltura.com/pd/p/1726172/sp/172617200/serveFlavor/entryId/1_po3v31zx/v/1/ev/7/flavorId/1_67zt1djx/fileName/BBB_(Basic_Small_-_WEB_MBL_(H264_400)).mp4/name/a.mp4'
        }
      ]
    },
    plugins: {
      ima: imaConfig
    }
  };
  if (playbackConfig) {
    config.playback = playbackConfig;
  }
  return setup(config);
}

/**
 * @param {Array} array _
 * @param {string|number} value _
 * @param {Function} done _
 * @returns {void}
 */
function maybeDoneTest(array, value, done) {
  let i = array.indexOf(value);
  if (i !== -1) {
    array.splice(i, 1);
  }
  if (array.length === 0 && typeof done === 'function') {
    done();
  }
}

/**
 * @returns {void}
 */
function loadGPT() {
  window.googletag = window.googletag || {};
  window.googletag.cmd = window.googletag.cmd || [];
  (function () {
    var gads = document.createElement('script');
    gads.async = true;
    gads.type = 'text/javascript';
    gads.src = '//www.googletagservices.com/tag/js/gpt.js';
    var node = document.getElementsByTagName('script')[0];
    node.parentNode.insertBefore(gads, node);
  })();
}

/**
 * @returns {void}
 */
function registerCompanionSlots() {
  window.googletag.cmd.push(function () {
    // Supply YOUR_NETWORK and YOUR_UNIT_PATH.
    window.googletag
      .defineSlot('/YOUR_NETWORK/YOUR_UNIT_PATH', [728, 90], 'testCompanionLong')
      .addService(window.googletag.companionAds())
      .addService(window.googletag.pubads());
    window.googletag
      .defineSlot('/YOUR_NETWORK/YOUR_UNIT_PATH', [300, 250], 'testCompanionSquare')
      .addService(window.googletag.companionAds())
      .addService(window.googletag.pubads());
    window.googletag.companionAds().setRefreshUnfilledSlots(true);
    window.googletag.pubads().enableVideoAds();
    window.googletag.enableServices();
  });

  window.googletag.cmd.push(function () {
    window.googletag.display('testCompanionLong');
  });

  window.googletag.cmd.push(function () {
    window.googletag.display('testCompanionSquare');
  });
}

export {loadPlayerWithAds, maybeDoneTest, loadGPT, registerCompanionSlots};
