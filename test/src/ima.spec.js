import {loadPlayerWithAds, maybeDoneTest, loadGPT, registerCompanionSlots} from './helpers';
import * as TestUtils from 'playkit-js/test/src/utils/test-utils';
import {FakeEvent} from 'playkit-js';
// eslint-disable-next-line no-unused-vars
import Ima from '../../src/ima';
import AdType from '../../src/ad-type';

const targetId = 'player-placeholder_ima.spec';

describe('Ima Plugin', function() {
  let ima;
  let player;
  let adPodIndex;
  let cuePoints;

  before(function() {
    TestUtils.createElement('DIV', targetId);
    let el = document.getElementById(targetId);
    el.style.height = '360px';
    el.style.width = '640px';
  });

  afterEach(function() {
    ima.destroy();
    ima = null;
    player.destroy();
    player = null;
    adPodIndex = null;
    TestUtils.removeVideoElementsFromTestPage();
  });

  after(function() {
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
      player.Event.ALL_ADS_COMPLETED,
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
    player.addEventListener(player.Event.ALL_ADS_COMPLETED, () => {
      maybeDoneTest(adsEvents, player.Event.ALL_ADS_COMPLETED, done);
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
      e.payload.adType.should.equal(AdType.PRE_ROLL);
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
      e.payload.adType.should.equal(AdType.PRE_ROLL);
      spy.should.calledOnce;
    });
    player.addEventListener(player.Event.AD_STARTED, () => {
      maybeDoneTest(cuePoints, adPodIndex, done);
    });
    player.play();
  });

  it('should play vmap-preroll-bumper', done => {
    cuePoints = [0, 0];
    player = loadPlayerWithAds(targetId, {
      adTagUrl:
        'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/ad_rule_samples&ciu_szs=300x250&ad_rule=1&impl=s&gdfp_req=1&env=vp&output=vmap&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ar%3Dpreonlybumper&cmsid=496&vid=short_onecue&correlator=[timestamp]'
    });
    ima = player._pluginManager.get('ima');
    player.addEventListener(player.Event.AD_LOADED, e => {
      adPodIndex = e.payload.extraAdData.adPodInfo.podIndex;
      e.payload.adType.should.equal(AdType.PRE_ROLL);
    });
    player.addEventListener(player.Event.AD_STARTED, () => {
      maybeDoneTest(cuePoints, adPodIndex, done);
    });
    player.play();
  });

  it('should play vmap-preroll-midroll-postroll', done => {
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
          adType = AdType.PRE_ROLL;
          break;
        case 1:
          adType = AdType.MID_ROLL;
          break;
        case -1:
          adType = AdType.POST_ROLL;
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
      e.payload.adType.should.equal(AdType.POST_ROLL);
    });
    player.addEventListener(player.Event.AD_STARTED, () => {
      maybeDoneTest(cuePoints, adPodIndex, done);
    });
    player.addEventListener(player.Event.LOADED_METADATA, () => {
      player.currentTime = player.duration - 1;
    });
    player.play();
  });

  it('should play vmap-postroll-bumper', done => {
    cuePoints = [-1, -1];
    player = loadPlayerWithAds(targetId, {
      adTagUrl:
        'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/ad_rule_samples&ciu_szs=300x250&ad_rule=1&impl=s&gdfp_req=1&env=vp&output=vmap&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ar%3Dpostonlybumper&cmsid=496&vid=short_onecue&correlator=[timestamp]'
    });
    ima = player._pluginManager.get('ima');
    player.addEventListener(player.Event.AD_LOADED, e => {
      adPodIndex = e.payload.extraAdData.adPodInfo.podIndex;
      e.payload.adType.should.equal(AdType.POST_ROLL);
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
      e.payload.adType.should.equal(AdType.PRE_ROLL);
    });
    player.addEventListener(player.Event.AD_STARTED, () => {
      maybeDoneTest(cuePoints, adPodIndex);
      setTimeout(function() {
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
      e.payload.adType.should.equal(AdType.PRE_ROLL);
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

  it('should play single-redirect-broken(fallback)', done => {
    cuePoints = [0];
    player = loadPlayerWithAds(targetId, {
      adTagUrl:
        'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dredirecterror&correlator=[timestamp]'
    });
    ima = player._pluginManager.get('ima');
    player.addEventListener(player.Event.AD_LOADED, e => {
      adPodIndex = e.payload.extraAdData.adPodInfo.podIndex;
      e.payload.adType.should.equal(AdType.PRE_ROLL);
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
      e.payload.adType.should.equal(AdType.OVERLAY);
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
      testCompanionSquare.innerHTML.should.not.be.empty;
      testCompanionSquare.parentNode.removeChild(testCompanionSquare);
      done();
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
      testCompanionSquare.innerHTML.should.not.be.empty;
      testCompanionSquare.innerHTML.should.not.be.empty;
      testCompanionSquare.parentNode.removeChild(testCompanionSquare);
      testCompanionLong.parentNode.removeChild(testCompanionLong);
      done();
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

  it('should be destroyed on a critical error', done => {
    player = loadPlayerWithAds(targetId, {});
    ima = player._pluginManager.get('ima');
    const spy = sinon.spy(ima, 'destroy');
    player.addEventListener(player.Event.ERROR, () => {
      spy.should.calledOnce;
      done();
    });
    player.dispatchEvent(new FakeEvent(player.Event.ERROR, {severity: 2}));
  });
});
