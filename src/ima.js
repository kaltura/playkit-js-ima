// @flow
// import {registerPlugin, BasePlugin} from 'playkit-js'
import ImaMiddleware from './ima-middleware'
import FiniteStateMachine from './fsm'
// import {VERSION} from 'playkit-js'
// import {PlayerMiddlewareBase} from 'playkit-js'

const pluginName: string = "ima";

const ADS_CONTAINER_ID: string = "ads-container";
const PLAYER_NAME: string = "kaltura-player-js";

export default class Ima extends BasePlugin {

  static defaultConfig: Object = {
    debug: false,
    timeout: 5000,
    prerollTimeout: 100,
    adLabel: 'Advertisement',
    showControlsForJSAds: true,
    adsRenderingSettings: {
      enablePreloading: true,
      useStyledLinearAds: true,
      useStyledNonLinearAds: true,
      bitrate: -1,
      autoAlign: true
    }
  };

  static IMA_SDK_LIB_URL: string = "//imasdk.googleapis.com/js/sdkloader/ima3.js";
  static IMA_SDK_DEBUG_LIB_URL: string = "//imasdk.googleapis.com/js/sdkloader/ima3_debug.js";

  prepareIma: Promise<*>;

  _fsm: any;
  _sdk: any;
  _adsContainerDiv: HTMLElement;
  _adDisplayContainer: any;
  _adsManager: any;
  _adsLoader: any;
  _contentPlayheadTracker: Object;
  _contentComplete: boolean;
  _playerLoaded: boolean;
  _intervalTimer: ?number;

  static isValid() {
    return true;
  }

  constructor(name: string, player: Player, config: Object) {
    super(name, player, config);
    this._fsm = new FiniteStateMachine(this);
    this._intervalTimer = null;
    this._adsManager = null;
    this._contentComplete = false;
    this._playerLoaded = false;
    this._contentPlayheadTracker = {currentTime: 0, previousTime: 0, seeking: false, duration: 0};
    this._addBindings();
    this._init();
  }

  getStateMachine(): any {
    return this._fsm;
  }

  getPlayerMiddleware(): PlayerMiddlewareBase {
    return new ImaMiddleware(this);
  }

  destroy(): void {
    this.logger.debug("destroy");
    this.eventManager.destroy();
    this._reset();
  }

  initialize() {
    try {
      let playerViewSize = this._getPlayerViewSize();
      // Initialize the container.
      this._adDisplayContainer.initialize();
      // Initialize the ads manager. Ad rules playlist will start at this time.
      this._adsManager.init(playerViewSize.width, playerViewSize.height, this._sdk.ViewMode.NORMAL);
      // Call play to start showing the ad.
      // Single video and overlay ads will start at this time.
      // The call will be ignored for ad rules.
      this._adsManager.start();
    }
    catch (adError) {
      this.logger.error(adError);
      this.destroy();
    }
  }

  resumeAd(): void {
    this._adsManager.resume();
  }

  pauseAd(): void {
    this._adsManager.pause();
  }

  _addBindings(): void {
    this.eventManager.listen(window, 'resize', this._onResize.bind(this));
    this.eventManager.listen(this.player, this.player.Event.LOADED_METADATA, this._onLoadedMetadata.bind(this));
    this.eventManager.listen(this.player, this.player.Event.TIME_UPDATE, this._onMediaTimeUpdate.bind(this));
    this.eventManager.listen(this.player, this.player.Event.SEEKING, this._onMediaSeeking.bind(this));
    this.eventManager.listen(this.player, this.player.Event.SEEKED, this._onMediaSeeked.bind(this));
    this.eventManager.listen(this.player, this.player.Event.ENDED, this._onMediaEnded.bind(this));
  }

  _init(): void {
    this.prepareIma = new Promise((resolve, reject) => {
      let loadPromise = (window.google && window.google.ima) ? Promise.resolve() : this._loadIma();
      loadPromise.then(() => {
        this._sdk = window.google.ima;
        this.logger.debug("IMA SDK version: " + this._sdk.VERSION);
        this._requestAds(resolve);
      }).catch((e) => {
        reject(e);
      });
    });
  }

  _initAdsContainer(): void {
    this.logger.debug("Init ads container");
    let adsContainerDiv = document.getElementById(ADS_CONTAINER_ID);
    let playerView = this.player.getView();
    if (!adsContainerDiv) {
      this._adsContainerDiv = playerView.appendChild(document.createElement('div'));
      this._adsContainerDiv.id = ADS_CONTAINER_ID;
      this._adsContainerDiv.style.position = "absolute";
      this._adsContainerDiv.style.zIndex = "2000";
      this._adsContainerDiv.style.top = "0";
    } else {
      this._adsContainerDiv = adsContainerDiv;
    }
    this._adDisplayContainer = new this._sdk.AdDisplayContainer(this._adsContainerDiv, this.player.getVideoElement());
  }

  _initAdsLoader(resolve: Function): void {
    this.logger.debug("Init ads loader");
    this._adsLoader = new this._sdk.AdsLoader(this._adDisplayContainer);
    this._adsLoader.addEventListener(this._sdk.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, this._onAdsManagerLoaded.bind(this, resolve));
    this._adsLoader.addEventListener(this._sdk.AdErrorEvent.Type.AD_ERROR, this._fsm.aderror);
  }

  _requestAds(resolve: Function): void {
    this.logger.debug("Request ads");
    if (!this.config.adTagUrl && !this.config.adsResponse) {
      throw new Error("Missing ad tag url for ima plugin");
    } else {
      this._sdk.settings.setPlayerType(PLAYER_NAME);
      this._sdk.settings.setPlayerVersion(VERSION);
      // Create the ad display container.
      this._initAdsContainer();
      // Create ads loader.
      this._initAdsLoader(resolve);
      // Request video ads.
      let adsRequest = new this._sdk.AdsRequest();
      if (this.config.adTagUrl) {
        adsRequest.adTagUrl = this.config.adTagUrl;
      } else {
        adsRequest.adsResponse = this.config.adsResponse;
      }
      let playerViewSize = this._getPlayerViewSize();
      adsRequest.linearAdSlotWidth = playerViewSize.width;
      adsRequest.linearAdSlotHeight = playerViewSize.height;
      adsRequest.nonLinearAdSlotWidth = playerViewSize.width;
      adsRequest.nonLinearAdSlotHeight = playerViewSize.height / 3;
      adsRequest.setAdWillAutoPlay(this.player.config.playback.autoplay);
      this._adsLoader.requestAds(adsRequest);
    }
  }

  _onResize() {
    if (this._sdk && this._adsManager) {
      let playerViewSize = this._getPlayerViewSize();
      this._adsManager.resize(playerViewSize.width, playerViewSize.height, this._sdk.ViewMode.NORMAL);
    }
  }

  _getPlayerViewSize(): Object {
    let playerView = this.player.getView();
    let width = playerView ? parseInt(getComputedStyle(playerView).width, 10) : 640;
    let height = playerView ? parseInt(getComputedStyle(playerView).height, 10) : 360;
    return {width: width, height: height};
  }

  _onLoadedMetadata(): void {
    this._contentPlayheadTracker.duration = this.player.duration;
  }

  _onMediaTimeUpdate(): void {
    if (!this._contentPlayheadTracker.seeking) {
      this._contentPlayheadTracker.previousTime = this._contentPlayheadTracker.currentTime;
      this._contentPlayheadTracker.currentTime = this.player.currentTime;
    }
  }

  _onMediaSeeking(): void {
    this._contentPlayheadTracker.seeking = true;
  }

  _onMediaSeeked(): void {
    this._contentPlayheadTracker.seeking = false;
  }

  _onMediaEnded(): void {
    if (this._adsLoader && !this._contentComplete) {
      this._adsLoader.contentComplete();
      this._contentComplete = true;
    }
  }

  _showAdsContainer(): void {
    if (this._adsContainerDiv) {
      this._adsContainerDiv.style.display = "";
    }
  }

  _hideAdsContainer(): void {
    if (this._adsContainerDiv) {
      this._adsContainerDiv.style.display = "none";
    }
  }

  _onAdsManagerLoaded(resolve: Function, adsManagerLoadedEvent: any): void {
    this.logger.debug('Ads manager loaded');
    let adsRenderingSettings = new this._sdk.AdsRenderingSettings();
    adsRenderingSettings.restoreCustomPlaybackStateOnAdBreakComplete = true;
    adsRenderingSettings.enablePreloading = this.config.adsRenderingSettings.enablePreloading;
    adsRenderingSettings.useStyledLinearAds = this.config.adsRenderingSettings.useStyledLinearAds;
    adsRenderingSettings.useStyledNonLinearAds = this.config.adsRenderingSettings.useStyledNonLinearAds;
    adsRenderingSettings.bitrate = this.config.adsRenderingSettings.bitrate;
    adsRenderingSettings.autoAlign = this.config.adsRenderingSettings.autoAlign;
    this._adsManager = adsManagerLoadedEvent.getAdsManager(this._contentPlayheadTracker, adsRenderingSettings);
    this._adsManager.addEventListener(this._sdk.AdEvent.Type.CONTENT_PAUSE_REQUESTED, this._fsm.adbreakstart);
    this._adsManager.addEventListener(this._sdk.AdEvent.Type.LOADED, this._fsm.adsloaded);
    this._adsManager.addEventListener(this._sdk.AdEvent.Type.STARTED, this._fsm.adstarted);
    this._adsManager.addEventListener(this._sdk.AdEvent.Type.PAUSED, this._fsm.adpaused);
    this._adsManager.addEventListener(this._sdk.AdEvent.Type.RESUMED, this._fsm.adresumed);
    this._adsManager.addEventListener(this._sdk.AdEvent.Type.FIRST_QUARTILE, this._fsm.adfirstquartile);
    this._adsManager.addEventListener(this._sdk.AdEvent.Type.MIDPOINT, this._fsm.admidpoint);
    this._adsManager.addEventListener(this._sdk.AdEvent.Type.THIRD_QUARTILE, this._fsm.adthirdquartile);
    this._adsManager.addEventListener(this._sdk.AdEvent.Type.CLICK, this._fsm.adclicked);
    this._adsManager.addEventListener(this._sdk.AdEvent.Type.SKIPPED, this._fsm.adskipped);
    this._adsManager.addEventListener(this._sdk.AdEvent.Type.COMPLETE, this._fsm.adcompleted);
    this._adsManager.addEventListener(this._sdk.AdEvent.Type.CONTENT_RESUME_REQUESTED, this._fsm.adbreakend);
    this._adsManager.addEventListener(this._sdk.AdEvent.Type.ALL_ADS_COMPLETED, this._fsm.alladscompleted);
    this._adsManager.addEventListener(this._sdk.AdEvent.Type.USER_CLOSE, this._fsm.userclosedad);
    this._adsManager.addEventListener(this._sdk.AdEvent.Type.VOLUME_CHANGED, this._fsm.advolumechanged);
    this._adsManager.addEventListener(this._sdk.AdEvent.Type.VOLUME_MUTED, this._fsm.admuted);
    this._adsManager.addEventListener(this._sdk.AdErrorEvent.Type.AD_ERROR, this._fsm.aderror);
    this._fsm.loaded().then(() => {
      resolve();
    });
  }

  _reset(): void {
    this._hideAdsContainer();
    if (this._adsManager) {
      this._adsManager.destroy();
      this._adsManager = null;
    }
    if (this._adsLoader && !this._contentComplete) {
      this._adsLoader.contentComplete();
    }
    this._adsLoader = null;
    this._contentComplete = false;
    this._playerLoaded = false;
    this._intervalTimer = null;
    this._contentPlayheadTracker = {currentTime: 0, previousTime: 0, seeking: false, duration: 0};
  }

  _loadIma(): Promise<*> {
    return new Promise((resolve, reject) => {
      let r = false,
        t = document.getElementsByTagName("script")[0],
        s = document.createElement("script");
      s.type = "text/javascript";
      s.src = this.config.debug ? Ima.IMA_SDK_DEBUG_LIB_URL : Ima.IMA_SDK_LIB_URL;
      s.async = true;
      this.logger.debug("Loading lib: " + s.src);
      s.onload = s.onreadystatechange = function () {
        if (!r && (!this.readyState || this.readyState === "complete")) {
          r = true;
          resolve(this);
        }
      };
      s.onerror = s.onabort = reject;
      if (t && t.parentNode) {
        t.parentNode.insertBefore(s, t);
      }
    });
  }
}

registerPlugin(pluginName, Ima);

// TODO: Remove
import {VERSION} from '../node_modules/playkit-js/src/playkit.js'
import {registerPlugin, BasePlugin} from '../node_modules/playkit-js/src/playkit.js'
import {PlayerMiddlewareBase} from '../node_modules/playkit-js/src/playkit.js'
import * as Playkit from '../node_modules/playkit-js/src/playkit.js'
window.Playkit = Playkit;
