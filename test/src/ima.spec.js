import {loadGPT, loadPlayerWithAds, maybeDoneTest, registerCompanionSlots} from './helpers';
import * as TestUtils from './utils/test-utils';
import {core} from 'kaltura-player-js';
const {AdBreakType, FakeEvent} = core;

const targetId = 'player-placeholder_ima.spec';

describe('Ima Plugin', function () {
  let ima;
  let player;
  let adPodIndex;
  let cuePoints;

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
    adPodIndex = null;
    TestUtils.removeVideoElementsFromTestPage();
  });

  after(function () {
    TestUtils.removeElement(targetId);
  });

  it('should fire all ads events', done => {
    player = loadPlayerWithAds(targetId, {
      adTagUrl:
        'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dskippablelinear&correlator=[timestamp]'
    });
    ima = player._pluginManager.get('ima');
    let adsEvents = [
      player.Event.AD_LOADED,
      player.Event.AD_STARTED,
      player.Event.AD_RESUMED,
      player.Event.AD_PAUSED,
      player.Event.AD_COMPLETED,
      player.Event.ADS_COMPLETED,
      player.Event.AD_BREAK_END,
      player.Event.AD_BREAK_START,
      player.Event.AD_FIRST_QUARTILE,
      player.Event.AD_MIDPOINT,
      player.Event.AD_THIRD_QUARTILE,
      player.Event.AD_VOLUME_CHANGED,
      player.Event.AD_MUTED,
      player.Event.AD_PROGRESS
    ];
    player.addEventListener(player.Event.AD_LOADED, () => {
      maybeDoneTest(adsEvents, player.Event.AD_LOADED, done);
    });
    player.addEventListener(player.Event.AD_PROGRESS, () => {
      maybeDoneTest(adsEvents, player.Event.AD_PROGRESS, done);
    });
    player.addEventListener(player.Event.AD_STARTED, () => {
      maybeDoneTest(adsEvents, player.Event.AD_STARTED, done);
      ima._adsManager.setVolume(0.5);
      ima.pauseAd();
    });
    player.addEventListener(player.Event.AD_PAUSED, () => {
      maybeDoneTest(adsEvents, player.Event.AD_PAUSED, done);
      ima._adsManager.setVolume(0);
      ima.resumeAd();
    });
    player.addEventListener(player.Event.AD_RESUMED, () => {
      maybeDoneTest(adsEvents, player.Event.AD_RESUMED, done);
    });
    player.addEventListener(player.Event.AD_COMPLETED, () => {
      maybeDoneTest(adsEvents, player.Event.AD_COMPLETED, done);
    });
    player.addEventListener(player.Event.ADS_COMPLETED, () => {
      maybeDoneTest(adsEvents, player.Event.ADS_COMPLETED, done);
    });
    player.addEventListener(player.Event.AD_BREAK_START, () => {
      maybeDoneTest(adsEvents, player.Event.AD_BREAK_START, done);
    });
    player.addEventListener(player.Event.AD_BREAK_END, () => {
      maybeDoneTest(adsEvents, player.Event.AD_BREAK_END, done);
    });
    player.addEventListener(player.Event.AD_FIRST_QUARTILE, () => {
      maybeDoneTest(adsEvents, player.Event.AD_FIRST_QUARTILE, done);
    });
    player.addEventListener(player.Event.AD_MIDPOINT, () => {
      maybeDoneTest(adsEvents, player.Event.AD_MIDPOINT, done);
    });
    player.addEventListener(player.Event.AD_THIRD_QUARTILE, () => {
      maybeDoneTest(adsEvents, player.Event.AD_THIRD_QUARTILE, done);
    });
    player.addEventListener(player.Event.AD_VOLUME_CHANGED, () => {
      maybeDoneTest(adsEvents, player.Event.AD_VOLUME_CHANGED, done);
    });
    player.addEventListener(player.Event.AD_MUTED, () => {
      maybeDoneTest(adsEvents, player.Event.AD_MUTED, done);
    });
    player.play();
  });

  describe('ad events order', () => {
    it('should fire AD_BREAK_STARTED before AD_STARTED - video ad', done => {
      player = loadPlayerWithAds(targetId, {
        adTagUrl:
          'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dskippablelinear&correlator=[timestamp]'
      });
      ima = player._pluginManager.get('ima');
      player.addEventListener(player.Event.AD_BREAK_START, () => {
        player.addEventListener(player.Event.AD_STARTED, () => {
          done();
        });
      });
      player.play();
    });

    it('should fire AD_BREAK_STARTED before AD_STARTED - linear image ad', done => {
      const vastXML = require('../setup/linear-image.vast.xml').default;
      player = loadPlayerWithAds(targetId, {
        adsResponse: vastXML
      });
      ima = player._pluginManager.get('ima');
      player.addEventListener(player.Event.AD_BREAK_START, () => {
        player.addEventListener(player.Event.AD_STARTED, () => {
          done();
        });
      });
      player.play();
    });
  });

  it('should sent the ad data - linear', done => {
    player = loadPlayerWithAds(targetId, {
      adTagUrl:
        '//pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/ad_rule_samples&ciu_szs=300x250&ad_rule=1&impl=s&gdfp_req=1&env=vp&output=vmap&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ar%3Dpremidpost&cmsid=496&vid=short_onecue&correlator='
    });
    ima = player._pluginManager.get('ima');
    player.addEventListener(player.Event.AD_STARTED, e => {
      try {
        e.payload.ad.width.should.gt(0);
        e.payload.ad.height.should.gt(0);
        e.payload.ad.bitrate.should.gt(0);
        e.payload.ad.vpaid.should.be.false;
        done();
      } catch (e) {
        done(e);
      }
    });
    player.play();
  });

  it('should sent the ad data - non-linear', done => {
    player = loadPlayerWithAds(targetId, {
      adTagUrl:
        '//pubads.g.doubleclick.net/gampad/ads?sz=480x70&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dnonlinear&correlator='
    });
    ima = player._pluginManager.get('ima');
    player.addEventListener(player.Event.AD_STARTED, e => {
      try {
        e.payload.ad.width.should.gt(0);
        e.payload.ad.height.should.gt(0);
        e.payload.ad.vpaid.should.be.false;
        done();
      } catch (e) {
        done(e);
      }
    });
    player.play();
  });

  it('should support setting adsRenderingSettings config object', done => {
    player = loadPlayerWithAds(targetId, {
      adTagUrl:
        'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dskippablelinear&correlator=[timestamp]',
      adsRenderingSettings: {uiElements: ['countdown']}
    });

    ima = player._pluginManager.get('ima');
    player.addEventListener(player.Event.AD_LOADED, () => {
      let refAdsRenderingSettings = new ima._sdk.AdsRenderingSettings();
      refAdsRenderingSettings['uiElements'] = ['countdown'];
      const adsRenderingSettings = ima._getAdsRenderingSetting();
      try {
        adsRenderingSettings['uiElements'][0].should.equals(refAdsRenderingSettings['uiElements'][0]);
        done();
      } catch (e) {
        done(e);
      }
    });
    player.play();
  });

  it('should play vmap-preroll', done => {
    cuePoints = [0];
    player = loadPlayerWithAds(targetId, {
      adTagUrl:
        'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/ad_rule_samples&ciu_szs=300x250&ad_rule=1&impl=s&gdfp_req=1&env=vp&output=vmap&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ar%3Dpreonly&cmsid=496&vid=short_onecue&correlator=[timestamp]'
    });
    ima = player._pluginManager.get('ima');
    player.addEventListener(player.Event.AD_LOADED, e => {
      adPodIndex = e.payload.extraAdData.adPodInfo.podIndex;
      e.payload.adType.should.equal(AdBreakType.PRE_ROLL);
    });
    player.addEventListener(player.Event.AD_STARTED, () => {
      maybeDoneTest(cuePoints, adPodIndex, done);
    });
    player.play();
  });

  it('should call requestAds once', done => {
    cuePoints = [0];
    player = loadPlayerWithAds(targetId, {
      adTagUrl:
        'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/ad_rule_samples&ciu_szs=300x250&ad_rule=1&impl=s&gdfp_req=1&env=vp&output=vmap&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ar%3Dpreonly&cmsid=496&vid=short_onecue&correlator=[timestamp]'
    });
    ima = player._pluginManager.get('ima');
    const spy = sinon.spy(ima, '_requestAds');
    player.addEventListener(player.Event.AD_LOADED, e => {
      adPodIndex = e.payload.extraAdData.adPodInfo.podIndex;
      e.payload.adType.should.equal(AdBreakType.PRE_ROLL);
      spy.should.calledOnce;
    });
    player.addEventListener(player.Event.AD_STARTED, () => {
      maybeDoneTest(cuePoints, adPodIndex, done);
    });
    player.play();
  });

  it.skip('should play vmap-preroll-bumper', done => {
    cuePoints = [0, 0];
    player = loadPlayerWithAds(targetId, {
      adTagUrl:
        'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/ad_rule_samples&ciu_szs=300x250&ad_rule=1&impl=s&gdfp_req=1&env=vp&output=vmap&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ar%3Dpreonlybumper&cmsid=496&vid=short_onecue&correlator=[timestamp]'
    });
    ima = player._pluginManager.get('ima');
    player.addEventListener(player.Event.AD_LOADED, e => {
      adPodIndex = e.payload.extraAdData.adPodInfo.podIndex;
      e.payload.adType.should.equal(AdBreakType.PRE_ROLL);
    });
    player.addEventListener(player.Event.AD_STARTED, () => {
      maybeDoneTest(cuePoints, adPodIndex, done);
    });
    player.play();
  });

  it.skip('should play vmap-preroll-midroll-postroll', done => {
    cuePoints = [0, 1, -1];
    player = loadPlayerWithAds(targetId, {
      adTagUrl:
        'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/ad_rule_samples&ciu_szs=300x250&ad_rule=1&impl=s&gdfp_req=1&env=vp&output=vmap&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ar%3Dpremidpost&cmsid=496&vid=short_onecue&correlator=[timestamp]'
    });
    ima = player._pluginManager.get('ima');
    player.addEventListener(player.Event.AD_LOADED, e => {
      adPodIndex = e.payload.extraAdData.adPodInfo.podIndex;
      let adType = '';
      switch (adPodIndex) {
        case 0:
          adType = AdBreakType.PRE_ROLL;
          break;
        case 1:
          adType = AdBreakType.MID_ROLL;
          break;
        case -1:
          adType = AdBreakType.POST_ROLL;
          break;
      }
      e.payload.adType.should.equal(adType);
    });
    player.addEventListener(player.Event.AD_STARTED, () => {
      maybeDoneTest(cuePoints, adPodIndex, done);
    });
    player.addEventListener(player.Event.LOADED_METADATA, () => {
      player.currentTime = player.duration - 1;
    });
    player.play();
  });

  it('should play vmap-postroll', done => {
    cuePoints = [-1];
    player = loadPlayerWithAds(targetId, {
      adTagUrl:
        'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/ad_rule_samples&ciu_szs=300x250&ad_rule=1&impl=s&gdfp_req=1&env=vp&output=vmap&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ar%3Dpostonly&cmsid=496&vid=short_onecue&correlator=[timestamp]'
    });
    ima = player._pluginManager.get('ima');
    player.addEventListener(player.Event.AD_LOADED, e => {
      adPodIndex = e.payload.extraAdData.adPodInfo.podIndex;
      e.payload.adType.should.equal(AdBreakType.POST_ROLL);
    });
    player.addEventListener(player.Event.AD_STARTED, () => {
      maybeDoneTest(cuePoints, adPodIndex, done);
    });
    player.addEventListener(player.Event.LOADED_METADATA, () => {
      player.currentTime = player.duration - 1;
    });
    player.play();
  });

  it.skip('should play vmap-postroll-bumper', done => {
    cuePoints = [-1, -1];
    player = loadPlayerWithAds(targetId, {
      adTagUrl:
        'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/ad_rule_samples&ciu_szs=300x250&ad_rule=1&impl=s&gdfp_req=1&env=vp&output=vmap&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ar%3Dpostonlybumper&cmsid=496&vid=short_onecue&correlator=[timestamp]'
    });
    ima = player._pluginManager.get('ima');
    player.addEventListener(player.Event.AD_LOADED, e => {
      adPodIndex = e.payload.extraAdData.adPodInfo.podIndex;
      e.payload.adType.should.equal(AdBreakType.POST_ROLL);
    });
    player.addEventListener(player.Event.AD_STARTED, () => {
      maybeDoneTest(cuePoints, adPodIndex, done);
    });
    player.addEventListener(player.Event.LOADED_METADATA, () => {
      player.currentTime = player.duration - 1;
    });
    player.play();
  });

  it('should play single-skippable-inline', done => {
    cuePoints = [0];
    player = loadPlayerWithAds(targetId, {
      adTagUrl:
        'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dskippablelinear&correlator=[timestamp]'
    });
    ima = player._pluginManager.get('ima');
    player.addEventListener(player.Event.AD_LOADED, e => {
      adPodIndex = e.payload.extraAdData.adPodInfo.podIndex;
      e.payload.adType.should.equal(AdBreakType.PRE_ROLL);
    });
    player.addEventListener(player.Event.AD_STARTED, () => {
      maybeDoneTest(cuePoints, adPodIndex);
      setTimeout(function () {
        ima.skipAd();
      }, 6000);
    });
    player.addEventListener(player.Event.AD_SKIPPED, () => {
      done();
    });
    player.play();
  });

  it('should play single-redirect-linear', done => {
    cuePoints = [0];
    player = loadPlayerWithAds(targetId, {
      adTagUrl:
        'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dredirectlinear&correlator=[timestamp]'
    });
    ima = player._pluginManager.get('ima');
    player.addEventListener(player.Event.AD_LOADED, e => {
      adPodIndex = e.payload.extraAdData.adPodInfo.podIndex;
      e.payload.adType.should.equal(AdBreakType.PRE_ROLL);
    });
    player.addEventListener(player.Event.AD_STARTED, () => {
      maybeDoneTest(cuePoints, adPodIndex, done);
    });
    player.play();
  });

  it('should throw error because single-redirect-error', done => {
    player = loadPlayerWithAds(targetId, {
      adTagUrl:
        'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dredirecterror&nofb=1&correlator=[timestamp]'
    });
    ima = player._pluginManager.get('ima');
    player.addEventListener(player.Event.AD_ERROR, () => {
      done();
    });
    player.play();
  });

  it.skip('should play single-redirect-broken(fallback)', done => {
    cuePoints = [0];
    player = loadPlayerWithAds(targetId, {
      adTagUrl:
        'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dredirecterror&correlator=[timestamp]'
    });
    ima = player._pluginManager.get('ima');
    player.addEventListener(player.Event.AD_LOADED, e => {
      adPodIndex = e.payload.extraAdData.adPodInfo.podIndex;
      e.payload.adType.should.equal(AdBreakType.PRE_ROLL);
    });
    player.addEventListener(player.Event.AD_STARTED, () => {
      maybeDoneTest(cuePoints, adPodIndex, done);
    });
    player.play();
  });

  it('should play single-non-linear-inline', done => {
    cuePoints = [0];
    player = loadPlayerWithAds(targetId, {
      adTagUrl:
        'https://pubads.g.doubleclick.net/gampad/ads?sz=480x70&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dnonlinear&correlator=[timestamp]'
    });
    ima = player._pluginManager.get('ima');
    player.addEventListener(player.Event.AD_LOADED, e => {
      adPodIndex = e.payload.extraAdData.adPodInfo.podIndex;
      e.payload.ad.isLinear().should.be.false;
      e.payload.adType.should.equal(AdBreakType.OVERLAY);
    });
    player.addEventListener(player.Event.AD_STARTED, () => {
      maybeDoneTest(cuePoints, adPodIndex, done);
    });
    player.play();
  });

  it('should play single-inline-linear', done => {
    cuePoints = [0];
    player = loadPlayerWithAds(targetId, {
      adTagUrl:
        'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dlinear&correlator=[timestamp]'
    });
    ima = player._pluginManager.get('ima');
    player.addEventListener(player.Event.AD_LOADED, e => {
      adPodIndex = e.payload.extraAdData.adPodInfo.podIndex;
    });
    player.addEventListener(player.Event.AD_STARTED, () => {
      maybeDoneTest(cuePoints, adPodIndex, done);
    });
    player.play();
  });

  it('should display companion-ads-manual', done => {
    TestUtils.createElement('DIV', 'testCompanionSquare');
    let testCompanionSquare = document.getElementById('testCompanionSquare');
    testCompanionSquare.style.height = '250px';
    testCompanionSquare.style.width = '300px';
    player = loadPlayerWithAds(targetId, {
      adTagUrl:
        'http://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/ad_rule_samples&ciu_szs=300x250&ad_rule=1&impl=s&gdfp_req=1&env=vp&output=xml_vmap1&unviewed_position_start=1&cust_params=sample_ar%3Dpreonly&cmsid=496&vid=short_onecue&correlator=[timestamp]',
      companions: {
        ads: {
          testCompanionSquare: {
            width: 300,
            height: 250
          }
        },
        sizeCriteria: 'SELECT_EXACT_MATCH'
      }
    });
    ima = player._pluginManager.get('ima');
    player.addEventListener(player.Event.AD_STARTED, () => {
      try {
        testCompanionSquare.innerHTML.should.not.be.empty;
        testCompanionSquare.parentNode.removeChild(testCompanionSquare);
        done();
      } catch (e) {
        done(e);
      }
    });
    player.play();
  });

  it('should display companion-ads-automatic', done => {
    TestUtils.createElement('DIV', 'testCompanionSquare');
    let testCompanionSquare = document.getElementById('testCompanionSquare');
    testCompanionSquare.style.height = '250px';
    testCompanionSquare.style.width = '300px';
    TestUtils.createElement('DIV', 'testCompanionLong');
    let testCompanionLong = document.getElementById('testCompanionLong');
    testCompanionLong.style.height = '90px';
    testCompanionLong.style.width = '728px';
    player = loadPlayerWithAds(targetId, {
      adTagUrl:
        'http://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/ad_rule_samples&ciu_szs=300x250&ad_rule=1&impl=s&gdfp_req=1&env=vp&output=xml_vmap1&unviewed_position_start=1&cust_params=sample_ar%3Dpreonly&cmsid=496&vid=short_onecue&correlator=[timestamp]'
    });
    loadGPT();
    registerCompanionSlots();
    ima = player._pluginManager.get('ima');
    player.addEventListener(player.Event.AD_STARTED, () => {
      try {
        testCompanionSquare.innerHTML.should.not.be.empty;
        testCompanionSquare.innerHTML.should.not.be.empty;
        testCompanionSquare.parentNode.removeChild(testCompanionSquare);
        testCompanionLong.parentNode.removeChild(testCompanionLong);
        done();
      } catch (e) {
        done(e);
      }
    });
    player.play();
  });

  it('should play ads and then content with preload="auto"', done => {
    let adPlayed = false;
    player = loadPlayerWithAds(
      targetId,
      {
        adTagUrl:
          'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dlinear&correlator=[timestamp]'
      },
      {
        preload: 'auto'
      }
    );
    ima = player._pluginManager.get('ima');
    player.addEventListener(player.Event.AD_STARTED, () => {
      adPlayed = true;
    });
    player.addEventListener(player.Event.PLAYING, () => {
      if (adPlayed) {
        done();
      } else {
        done(new Error('Content start without ads'));
      }
    });
    player.play();
  });

  it('should play the content immediately for empty config', done => {
    player = loadPlayerWithAds(targetId, {});
    ima = player._pluginManager.get('ima');
    player.addEventListener(player.Event.PLAYING, () => {
      done();
    });
    player.play();
  });

  it('should be reset on a critical error', done => {
    player = loadPlayerWithAds(targetId, {});
    ima = player._pluginManager.get('ima');
    const spy = sinon.spy(ima, 'reset');
    player.addEventListener(player.Event.ERROR, () => {
      try {
        spy.should.calledOnce;
        done();
      } catch (e) {
        done(e);
      }
    });
    player.dispatchEvent(new FakeEvent(player.Event.ERROR, {severity: 2}));
  });

  it('should return the correct vpaid for INSECURE', function (done) {
    player = loadPlayerWithAds(targetId, {
      vpaidMode: 'INSECURE',
      adTagUrl:
        'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dskippablelinear&correlator=[timestamp]'
    });
    ima = player._pluginManager.get('ima');
    ima.loadPromise.then(function () {
      try {
        const value = ima._getVpaidMode();
        value.should.equals(2);
        done();
      } catch (e) {
        done(e);
      }
    });
  });

  it('should return the correct vpaid for ENABLED', function (done) {
    player = loadPlayerWithAds(targetId, {
      vpaidMode: 'ENABLED',
      adTagUrl:
        'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dskippablelinear&correlator=[timestamp]'
    });
    ima = player._pluginManager.get('ima');
    ima.loadPromise.then(function () {
      try {
        const value = ima._getVpaidMode();
        value.should.equals(1);
        done();
      } catch (e) {
        done(e);
      }
    });
  });

  it('should return the correct vpaid for DISABLED', function (done) {
    player = loadPlayerWithAds(targetId, {
      vpaidMode: 'DISABLED',
      adTagUrl:
        'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dskippablelinear&correlator=[timestamp]'
    });
    ima = player._pluginManager.get('ima');
    ima.loadPromise.then(function () {
      try {
        const value = ima._getVpaidMode();
        value.should.equals(0);
        done();
      } catch (e) {
        done(e);
      }
    });
  });

  it('should return the correct vpaid for ENABLED', function (done) {
    player = loadPlayerWithAds(targetId, {
      vpaidMode: '',
      adTagUrl:
        'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dskippablelinear&correlator=[timestamp]'
    });
    ima = player._pluginManager.get('ima');
    ima.loadPromise.then(function () {
      try {
        const value = ima._getVpaidMode();
        value.should.equals(1);
        done();
      } catch (e) {
        done(e);
      }
    });
  });

  it('should set playAdsAfterTime according the playback.startTime config', function (done) {
    player = loadPlayerWithAds(
      targetId,
      {
        adTagUrl:
          'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dskippablelinear&correlator=[timestamp]'
      },
      {
        startTime: 15
      }
    );
    ima = player._pluginManager.get('ima');
    player.addEventListener(player.Event.AD_MANIFEST_LOADED, () => {
      try {
        ima._adsManager.w && typeof ima._adsManager.w.playAdsAfterTime === 'number' && ima._adsManager.w.playAdsAfterTime.should.equal(15);
        done();
      } catch (e) {
        done(e);
      }
    });
    player.play();
  });

  it('should override playAdsAfterTime according the plugin config', function (done) {
    player = loadPlayerWithAds(
      targetId,
      {
        adTagUrl:
          'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dskippablelinear&correlator=[timestamp]',
        adsRenderingSettings: {
          playAdsAfterTime: -1
        }
      },
      {
        startTime: 15
      }
    );
    ima = player._pluginManager.get('ima');
    player.addEventListener(player.Event.AD_MANIFEST_LOADED, () => {
      try {
        ima._adsManager.w && typeof ima._adsManager.w.playAdsAfterTime === 'number' && ima._adsManager.w.playAdsAfterTime.should.equal(-1);
        done();
      } catch (e) {
        done(e);
      }
    });
    player.play();
  });

  it('should return _playAdByConfig true for adTagUrl configured', function () {
    player = loadPlayerWithAds(
      targetId,
      {
        adTagUrl:
          'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dskippablelinear&correlator=[timestamp]'
      },
      {
        startTime: 15
      }
    );
    ima = player._pluginManager.get('ima');
    ima._playAdByConfig().should.be.true;
  });

  it('should return _playAdByConfig true for adsResponse configured', function () {
    player = loadPlayerWithAds(
      targetId,
      {
        adsResponse:
          'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dskippablelinear&correlator=[timestamp]'
      },
      {
        startTime: 15
      }
    );
    ima = player._pluginManager.get('ima');
    ima._playAdByConfig().should.be.true;
  });

  it('should return _playAdByConfig false for neither adTagUrl or adsResponse configured', function () {
    player = loadPlayerWithAds(
      targetId,
      {},
      {
        startTime: 15
      }
    );
    ima = player._pluginManager.get('ima');
    ima._playAdByConfig().should.be.false;
  });

  it('Should load the content while the pre-roll playing', done => {
    player = loadPlayerWithAds(targetId, {
      adTagUrl:
        'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/ad_rule_samples&ciu_szs=300x250&ad_rule=1&impl=s&gdfp_req=1&env=vp&output=vmap&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ar%3Dpreonly&cmsid=496&vid=short_onecue&correlator=[timestamp]'
    });
    ima = player._pluginManager.get('ima');
    player.addEventListener(player.Event.LOAD_START, () => {
      player.addEventListener(player.Event.AD_BREAK_END, () => {
        done();
      });
    });
    player.play();
  });

  it('Should load and play the content only once the pre-roll finished since disableMediaPreload is true', done => {
    player = loadPlayerWithAds(targetId, {
      adTagUrl:
        'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/ad_rule_samples&ciu_szs=300x250&ad_rule=1&impl=s&gdfp_req=1&env=vp&output=vmap&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ar%3Dpreonly&cmsid=496&vid=short_onecue&correlator=[timestamp]',
      disableMediaPreload: true
    });
    ima = player._pluginManager.get('ima');
    player.addEventListener(player.Event.AD_COMPLETED, () => {
      player.addEventListener(player.Event.LOAD_START, () => {
        player.addEventListener(player.Event.FIRST_PLAYING, () => {
          done();
        });
      });
    });
    player.play();
  });

  it('Should load the content if the pre-roll load failed', done => {
    player = loadPlayerWithAds(targetId, {
      adTagUrl: 'some/invalid/url'
    });
    ima = player._pluginManager.get('ima');
    player.addEventListener(player.Event.AD_ERROR, () => {
      player.addEventListener(player.Event.LOAD_START, () => {
        done();
      });
    });
    player.load();
  });

  it('Should play the content if the pre-roll load failed', done => {
    player = loadPlayerWithAds(targetId, {
      adTagUrl: 'some/invalid/url'
    });
    ima = player._pluginManager.get('ima');
    player.addEventListener(player.Event.AD_ERROR, () => {
      player.addEventListener(player.Event.FIRST_PLAYING, () => {
        done();
      });
    });
    player.play();
  });

  it('Should load the content if no adTagUrl or adsResponse given', done => {
    player = loadPlayerWithAds(targetId, {});
    ima = player._pluginManager.get('ima');
    player.addEventListener(player.Event.LOAD_START, () => {
      done();
    });
    player.load();
  });

  it('should sent vpaid true - linear', done => {
    player = loadPlayerWithAds(targetId, {
      adTagUrl:
        '//pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dlinearvpaid2js&correlator='
    });
    ima = player._pluginManager.get('ima');
    player.addEventListener(player.Event.AD_STARTED, e => {
      try {
        e.payload.ad.vpaid.should.be.true;
        done();
      } catch (e) {
        done(e);
      }
    });
    player.play();
  });

  it('should sent vpaid true - non-linear', done => {
    player = loadPlayerWithAds(targetId, {
      adTagUrl:
        '//pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dnonlinearvpaid2js&correlator='
    });
    ima = player._pluginManager.get('ima');
    player.addEventListener(player.Event.AD_STARTED, e => {
      try {
        e.payload.ad.vpaid.should.be.true;
        done();
      } catch (e) {
        done(e);
      }
    });
    player.play();
  });

  it('should call to player load when non-linear and disableMediaPreload', done => {
    player = loadPlayerWithAds(targetId, {
      disableMediaPreload: true,
      adTagUrl:
        '//pubads.g.doubleclick.net/gampad/ads?sz=480x70&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dnonlinear&correlator='
    });
    ima = player._pluginManager.get('ima');
    player.addEventListener(player.Event.MEDIA_LOADED, () => {
      done();
    });
    player.play();
  });

  describe('playAdNow', function () {
    let sandbox;
    const vasts = [
      'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dskippablelinear&correlator=[timestamp]',
      'https://pubads.g.doubleclick.net/gampad/ads?slotname=%2F124319096%2Fexternal%2Fad_rule_samples&sz=640x480&ciu_szs=728x90%2C300x250%2C180x150%2C120x60%2C88x31%2C300x60%2C300x100%2C320x50%2C468x60%2C300x600%2C160x600&cust_params=deployment%3Ddevsite%26sample_ar%3Dpreonlybumper&url=https%3A%2F%2Fdevelopers.google.com%2Finteractive-media-ads%2Fdocs%2Fsdks%2Fhtml5%2Fvastinspector&unviewed_position_start=1&output=xml_vast4&env=vp&gdfp_req=1&ad_rule=0&vad_type=linear&vpos=preroll&pod=1&bumper=after&min_ad_duration=0&max_ad_duration=10000&vrid=5896&sb=1&is_amp=0&dt=1568197624492&idt=1045&dlt=1568197616840&adk=4018648594&correlator=4086141714122770&scor=2715330385634426&ged=ve4_td7_tt6_pd7_la0_er316.20.676.660_vi0.0.2540.509_vp76_ts0_eb20331&osd=2&cdm=google-developers.appspot.com&cookie_enabled=1&vis=1&jar=2019-9-11-8&hl=he&frm=2&video_doc_id=short_onecue&cmsid=496&sdkv=h.3.329.0&sdki=44d&mpt=h5_vsi&sdr=1&eid=651800008&u_so=l&afvsz=200x200%2C250x250%2C300x250%2C336x280%2C450x50%2C468x60%2C480x70&kfa=0&tfcd=0&adsid=ChAI8Lbi6wUQ8_Xq75y2n6gzEkwAtiXUNfqKuVR9qwyD1lwdPg36ANqqxEhxk1XLd5vpe1rNXc2uC400F_Kniq1_Dtsas5O7A5qH1IZWUFgWFWgnfwrgqdvt__nSPwdd'
    ];

    beforeEach(() => {
      player = loadPlayerWithAds(targetId, {}, {autoplay: true});
      ima = player._pluginManager.get('ima');
      sandbox = sinon.createSandbox();
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('should play given single preroll', function (done) {
      player.addEventListener(player.Event.AD_BREAK_START, event => {
        try {
          event.payload.adBreak.position.should.equal(0);
          event.payload.adBreak.type.should.equal(AdBreakType.PRE);
          event.payload.adBreak.numAds.should.equal(1);
          done();
        } catch (e) {
          done(e);
        }
      });
      ima.playAdNow([{url: [vasts[0]]}]);
    });

    it('should play given single midroll', function (done) {
      player.addEventListener(player.Event.AD_BREAK_START, event => {
        try {
          event.payload.adBreak.position.should.gt(1);
          event.payload.adBreak.type.should.equal(AdBreakType.MID);
          event.payload.adBreak.numAds.should.equal(1);
          done();
        } catch (e) {
          done(e);
        }
      });
      setTimeout(() => {
        ima.playAdNow([{url: [vasts[0]]}]);
      }, 1500);
    });

    it('should play given single postroll', function (done) {
      player.addEventListener(player.Event.AD_BREAK_START, event => {
        try {
          event.payload.adBreak.position.should.equal(-1);
          event.payload.adBreak.type.should.equal(AdBreakType.POST);
          event.payload.adBreak.numAds.should.equal(1);
          done();
        } catch (e) {
          done(e);
        }
      });
      player.addEventListener(player.Event.ENDED, () => {
        ima.playAdNow([{url: [vasts[0]]}]);
      });
      player.addEventListener(player.Event.FIRST_PLAYING, () => {
        player.currentTime = player.duration;
      });
    });

    it('should not play while ad is playing', function (done) {
      player.addEventListener(player.Event.AD_BREAK_START, () => {
        player.addEventListener(player.Event.AD_ERROR, () => {
          done(new Error('should not play while ad playing'));
        });
        player.addEventListener(player.Event.AD_FIRST_QUARTILE, () => {
          done();
        });
        ima.playAdNow([{url: [vasts[0]]}]);
      });
      ima.playAdNow([{url: [vasts[0]]}]);
    });

    it('should not play when adTagUrl or adsResponse configured', function (done) {
      sandbox.stub(ima, '_playAdByConfig').callsFake(function () {
        return true;
      });
      player.addEventListener(player.Event.AD_BREAK_START, () => {
        done(new Error('should not play while ad playing'));
      });

      ima.playAdNow([{url: [vasts[0]]}]);
      setTimeout(done, 2000);
    });

    it('should play ad pod - next once first complete', function (done) {
      player.addEventListener(player.Event.AD_COMPLETED, () => {
        player.addEventListener(player.Event.AD_STARTED, () => {
          done();
        });
      });
      ima.playAdNow([{url: [vasts[0]]}, {url: [vasts[1]]}]);
    });

    it('should play ad pod - next once first skipped', function (done) {
      player.addEventListener(player.Event.AD_CAN_SKIP, () => {
        player.addEventListener(player.Event.AD_SKIPPED, () => {
          player.addEventListener(player.Event.AD_STARTED, () => {
            done();
          });
        });
        ima.skipAd();
      });
      ima.playAdNow([{url: [vasts[0]]}, {url: [vasts[1]]}]);
    });

    it('should play ad pod - next once first failed', function (done) {
      player.addEventListener(player.Event.AD_ERROR, () => {
        player.addEventListener(player.Event.AD_STARTED, () => {
          done();
        });
      });
      ima.playAdNow([{url: ['bad/url']}, {url: [vasts[1]]}]);
    });

    it('should fire AD_BREAK_START, AD_BREAK_END and ADS_COMPLETED once for ad pod', function (done) {
      player.addEventListener(player.Event.AD_BREAK_START, event => {
        try {
          event.payload.adBreak.position.should.equal(0);
          event.payload.adBreak.type.should.equal(AdBreakType.PRE);
          event.payload.adBreak.numAds.should.equal(2);
        } catch (e) {
          done(e);
        }
        player.addEventListener(player.Event.AD_BREAK_START, () => {
          done(new Error('AD_BREAK_START should be triggered once for ad pod'));
        });
        player.addEventListener(player.Event.AD_CAN_SKIP, () => {
          player.addEventListener(player.Event.AD_BREAK_END, () => {
            player.addEventListener(player.Event.AD_BREAK_END, () => {
              done(new Error('AD_BREAK_END should be triggered once for ad pod'));
            });
            player.addEventListener(player.Event.ADS_COMPLETED, () => {
              player.addEventListener(player.Event.ADS_COMPLETED, () => {
                done(new Error('ALL_ADS_COMPLETED should be triggered once for ad pod'));
              });
              done();
            });
          });
          ima.skipAd();
        });
      });
      ima.playAdNow([{url: [vasts[0]]}, {url: [vasts[1]]}]);
    });

    it('should fire AD_BREAK_END and ADS_COMPLETED once the second ad failed', function (done) {
      player.addEventListener(player.Event.AD_ERROR, () => {
        player.addEventListener(player.Event.AD_BREAK_END, () => {
          player.addEventListener(player.Event.ADS_COMPLETED, () => {
            done();
          });
        });
      });
      ima.playAdNow([{url: [vasts[1]]}, {url: ['bad/url']}]);
    });

    it('should fire only ADS_COMPLETED once the whole ad pod failed', function (done) {
      player.addEventListener(player.Event.AD_BREAK_END, () => {
        done(new Error('AD_BREAK_END should not be triggered when the whole ad pod failed'));
      });
      player.addEventListener(player.Event.ADS_COMPLETED, () => {
        done();
      });
      ima.playAdNow([{url: ['bad/url']}, {url: ['bad/url']}]);
    });

    it('should fire AD_LOADED with correct params', function (done) {
      const onFirstLoaded = event => {
        player.removeEventListener(player.Event.AD_LOADED, onFirstLoaded);
        try {
          event.payload.ad.position.should.equal(1);
          event.payload.ad.bumper.should.be.false;
        } catch (e) {
          done(e);
        }
        player.addEventListener(player.Event.AD_CAN_SKIP, () => {
          player.addEventListener(player.Event.AD_LOADED, event => {
            try {
              event.payload.ad.position.should.equal(2);
              event.payload.ad.bumper.should.be.true;
              done();
            } catch (e) {
              done(e);
            }
          });
          ima.skipAd();
        });
      };
      player.addEventListener(player.Event.AD_LOADED, onFirstLoaded);
      ima.playAdNow([{url: [vasts[0]]}, {bumper: true, url: [vasts[1]]}]);
    });

    it('should fire AD_WATERFALLING instead of AD_ERROR once the first url failed and waterfall and play next', function (done) {
      player.addEventListener(player.Event.AD_ERROR, () => {
        done(new Error('AD_ERROR should not be triggered when waterfall exists'));
      });
      player.addEventListener(player.Event.AD_WATERFALLING, event => {
        try {
          event.payload.adFailed.url.should.equal('bad/url');
          event.payload.adFailed.adBreak.should.equal(AdBreakType.PRE);
          event.payload.adFailed.position.should.equal(1);
        } catch (e) {
          done(e);
        }
        player.addEventListener(player.Event.AD_CAN_SKIP, () => {
          player.addEventListener(player.Event.AD_LOADED, () => {
            done();
          });
          ima.skipAd();
        });
      });
      ima.playAdNow([{url: ['bad/url', vasts[0]]}, {url: [vasts[1]]}]);
    });

    it('should fire AD_WATERFALLING_FAILED and AD_ERROR once the all urls failed and play next', function (done) {
      player.addEventListener(player.Event.AD_WATERFALLING, () => {
        player.addEventListener(player.Event.AD_WATERFALLING_FAILED, () => {
          player.addEventListener(player.Event.AD_ERROR, () => {
            player.addEventListener(player.Event.AD_LOADED, () => {
              done();
            });
          });
        });
      });
      ima.playAdNow([{url: ['bad/url', 'bad/url']}, {url: [vasts[1]]}]);
    });
  });
});
