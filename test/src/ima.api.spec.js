import {loadPlayerWithAds} from './helpers'
import * as TestUtils from 'playkit-js/test/src/utils/test-utils'
// eslint-disable-next-line no-unused-vars
import Ima from '../../src/ima'

const targetId = 'player-placeholder_ima.api.spec';

describe('Ima API', function () {

  let ima;
  let player;

  before(function () {
    TestUtils.createElement('DIV', targetId);
    let el = document.getElementById(targetId);
    el.style.height = '360px';
    el.style.width = '640px';
  });

  afterEach(function () {
    ima.destroy();
    ima = null;
    player.destroy();
    player = null;
    TestUtils.removeVideoElementsFromTestPage();
  });

  after(function () {
    TestUtils.removeElement(targetId);
  });

  it('skipAd()', function (done) {
    player = loadPlayerWithAds(targetId, {
      adTagUrl: 'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dskippablelinear&correlator='
    });
    ima = player._pluginManager.get('ima');
    player.addEventListener(player.Event.AD_STARTED, () => {
      let ima = player._pluginManager.get('ima');
      setTimeout(function () {
        ima.skipAd();
      }, 6000);
    });
    player.addEventListener(player.Event.AD_SKIPPED, () => {
      done();
    });
    player.play();
  });

  it.skip('playAdNow(adTagUrl: string)', function (done) {
    done();
  });

  it('pauseAd()', function (done) {
    player = loadPlayerWithAds(targetId, {
      adTagUrl: 'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dskippablelinear&correlator='
    });
    ima = player._pluginManager.get('ima');
    player.addEventListener(player.Event.AD_STARTED, () => {
      ima.pauseAd();
    });
    player.addEventListener(player.Event.AD_PAUSED, () => {
      done();
    });
    player.play();
  });

  it('resumeAd()', function (done) {
    player = loadPlayerWithAds(targetId, {
      adTagUrl: 'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dskippablelinear&correlator='
    });
    ima = player._pluginManager.get('ima');
    player.addEventListener(player.Event.AD_STARTED, () => {
      ima.pauseAd();
    });
    player.addEventListener(player.Event.AD_PAUSED, () => {
      ima.resumeAd();
    });
    player.addEventListener(player.Event.AD_RESUMED, () => {
      done();
    });
    player.play();
  });
});
