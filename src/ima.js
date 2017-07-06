// @flow
import ImaMiddleware from './ima-middleware'
import ImaFSM from './ima-fsm'
import {registerPlugin, BasePlugin} from 'playkit-js'
import {VERSION} from 'playkit-js'
import {BaseMiddleware} from 'playkit-js'

/**
 * The plugin name.
 * @type {string}
 * @const
 */
const pluginName: string = "ima";
/**
 * The ads container id.
 * @type {string}
 * @const
 */
const ADS_CONTAINER_ID: string = "ads-container";
/**
 * The player name.
 * @type {string}
 * @const
 */
const PLAYER_NAME: string = "kaltura-player-js";

/**
 * The ima plugin.
 * @classdesc
 */
export default class Ima extends BasePlugin {

  /**
   * The default configuration of the plugin.
   * @type {Object}
   * @static
   */
  static defaultConfig: Object = {
    debug: false,
    timeout: 5000,
    prerollTimeout: 100,
    adLabel: 'Advertisement',
    showControlsForJSAds: true,
    adsRenderingSettings: {
      enablePreloading: false,
      useStyledLinearAds: false,
      useStyledNonLinearAds: false,
      bitrate: -1,
      autoAlign: true
    }
  };

  /**
   * The sdk lib url.
   * @type {string}
   * @static
   */
  static IMA_SDK_LIB_URL: string = "//imasdk.googleapis.com/js/sdkloader/ima3.js";
  /**
   * The debug sdk lib url.
   * @type {string}
   * @static
   */
  static IMA_SDK_DEBUG_LIB_URL: string = "//imasdk.googleapis.com/js/sdkloader/ima3_debug.js";
  /**
   * Promise for loading the plugin.
   * Will be resolved after:
   * 1) Ima script has been loaded in the page.
   * 2) The ads manager has been loaded and ready to start.
   * @type {Promise<*>}
   * @member
   * @public
   */
  preparePromise: Promise<*>;
  /**
   * The finite state machine of the plugin.
   * @member
   * @private
   */
  _fsm: any;
  /**
   * The sdk api.
   * @member
   * @private
   */
  _sdk: any;
  /**
   * The ads container dom element.
   * @member
   * @private
   */
  _adsContainerDiv: HTMLElement;
  /**
   * The ima ads container object.
   */
  _adDisplayContainer: any;
  /**
   * The ima ads manager.
   * @member
   * @private
   */
  _adsManager: any;
  /**
   * The ima ads loader.
   * @member
   * @private
   */
  _adsLoader: any;
  /**
   * The content tracker.
   * @member
   * @private
   */
  _contentPlayheadTracker: Object;
  /**
   * Flag to know when content complete.
   * @member
   * @private
   */
  _contentComplete: boolean;
  /**
   * The ad interval timer.
   * @member
   * @private
   */
  _intervalTimer: ?number;
  /**
   * Video current time before ads.
   * On custom playback when only one video tag playing, save the video current time.
   * @member
   * @private
   */
  _videoLastCurrentTime: ?number;

  /**
   * Whether the ima plugin is valid.
   * @static
   * @override
   * @public
   */
  static isValid() {
    return true;
  }

  /**
   * @constructor
   * @param {string} name - The plugin name.
   * @param {Player} player - The player instance.
   * @param {Object} config - The plugin config.
   */
  constructor(name: string, player: Player, config: Object) {
    super(name, player, config);
    this._fsm = new ImaFSM(this);
    this._intervalTimer = null;
    this._videoLastCurrentTime = null;
    this._adsManager = null;
    this._contentComplete = false;
    this._contentPlayheadTracker = {currentTime: 0, previousTime: 0, seeking: false, duration: 0};
    this._handleMobileAutoPlayCallback = this._bind(this, this._handleMobileAutoPlayCallback);
    this._addBindings();
    this._init();
  }

  /**
   * Gets the state machine.
   * @public
   * @returns {any} - The state machine.
   */
  getStateMachine(): any {
    return this._fsm;
  }

  /**
   * Gets the middleware.
   * @public
   * @returns {ImaMiddleware} - The middleware api.
   */
  getMiddlewareImpl(): BaseMiddleware {
    return new ImaMiddleware(this);
  }

  /**
   * Destroys the plugin.
   * @override
   * @public
   * @returns {void}
   */
  destroy(): void {
    this.logger.debug("destroy");
    this.eventManager.destroy();
    this._hideAdsContainer();
    if (this._adsManager) {
      this._adsManager.destroy();
    }
    if (this._adsLoader) {
      this._adsLoader.contentComplete();
    }
    this._adsManager = null;
    this._adsLoader = null;
    this._contentComplete = false;
    this._intervalTimer = null;
    this._videoLastCurrentTime = null;
    this._contentPlayheadTracker = {currentTime: 0, previousTime: 0, seeking: false, duration: 0};
  }

  /**
   * Initialize the ads for the first time.
   * @public
   * @returns {void}
   */
  initialUserAction(): void {
    try {
      this.logger.debug("Initial user action");
      this._maybeHandleMobileAutoPlay();
      let playerViewSize = this._getPlayerViewSize();
      // Initialize the container.
      this._adDisplayContainer.initialize();
      if (this._isMobilePlatform() && this._isIOS()) {
        this.logger.debug("Mobile ios: waiting for loadedmetada event");
        this.eventManager.listen(this.player, this.player.Event.LOADED_METADATA, () => {
          this.logger.debug("Loadedmetada event raised: start ads manager");
          this.eventManager.unlisten(this.player, this.player.Event.LOADED_METADATA);
          this._adsManager.init(playerViewSize.width, playerViewSize.height, this._sdk.ViewMode.NORMAL);
          this._adsManager.start();
        });
        this.logger.debug("Load player");
        this.player.load();
      } else {
        this.logger.debug("Start ads manager");
        this._adsManager.init(playerViewSize.width, playerViewSize.height, this._sdk.ViewMode.NORMAL);
        this._adsManager.start();
      }
    }
    catch (adError) {
      this.logger.error(adError);
      this.destroy();
    }
  }

  /**
   * Resuming the ad.
   * @public
   * @returns {void}
   */
  resumeAd(): void {
    this._adsManager.resume();
  }

  /**
   * Pausing the ad.
   * @public
   * @returns {void}
   */
  pauseAd(): void {
    this._adsManager.pause();
  }

  /**
   * Adding bindings.
   * @private
   * @returns {void}
   */
  _addBindings(): void {
    this.eventManager.listen(window, 'resize', this._onResize.bind(this));
    this.eventManager.listen(this.player, this.player.Event.LOADED_METADATA, this._onLoadedMetadata.bind(this));
    this.eventManager.listen(this.player, this.player.Event.TIME_UPDATE, this._onMediaTimeUpdate.bind(this));
    this.eventManager.listen(this.player, this.player.Event.SEEKING, this._onMediaSeeking.bind(this));
    this.eventManager.listen(this.player, this.player.Event.SEEKED, this._onMediaSeeked.bind(this));
    this.eventManager.listen(this.player, this.player.Event.VOLUME_CHANGE, this._syncPlayerVolume.bind(this));
  }

  /**
   * Initializing the plugin.
   * @private
   * @returns {void}
   */
  _init(): void {
    this.preparePromise = new Promise((resolve, reject) => {
      let loadPromise = (window.google && window.google.ima) ? Promise.resolve() : this._loadImaSDK();
      loadPromise.then(() => {
        this._sdk = window.google.ima;
        this.logger.debug("IMA SDK version: " + this._sdk.VERSION);
        this._initAdsContainer();
        this._initAdsLoader(resolve);
        this._requestAds();
      }).catch((e) => {
        reject(e);
      });
    });
  }

  /**
   * Initializing the ad container.
   * @private
   * @returns {void}
   */
  _initAdsContainer(): void {
    this.logger.debug("Init ads container");
    let adsContainerDiv = document.getElementById(ADS_CONTAINER_ID);
    let playerView = this.player.getView();
    if (!adsContainerDiv) {
      this._adsContainerDiv = playerView.appendChild(document.createElement('div'));
      this._adsContainerDiv.id = ADS_CONTAINER_ID;
      this._adsContainerDiv.style.position = "absolute";
      this._adsContainerDiv.style.top = "0";
    } else {
      this._adsContainerDiv = adsContainerDiv;
    }
    this._adDisplayContainer = new this._sdk.AdDisplayContainer(this._adsContainerDiv, this.player.getVideoElement());
  }

  /**
   * Initializing the ads loader.
   * @param {Function} resolve - The resolve function of the loading promise.
   * @private
   * @returns {void}
   */
  _initAdsLoader(resolve: Function): void {
    this.logger.debug("Init ads loader");
    this._adsLoader = new this._sdk.AdsLoader(this._adDisplayContainer);
    this._adsLoader.addEventListener(this._sdk.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, this._onAdsManagerLoaded.bind(this, resolve));
    this._adsLoader.addEventListener(this._sdk.AdErrorEvent.Type.AD_ERROR, this._fsm.aderror);
  }

  /**
   * Requests the ads from the ads loader.
   * @private
   * @returns {void}
   */
  _requestAds(): void {
    this.logger.debug("Request ads");
    if (!this.config.adTagUrl && !this.config.adsResponse) {
      throw new Error("Missing ad tag url for ima plugin");
    }
    this._sdk.settings.setPlayerType(PLAYER_NAME);
    this._sdk.settings.setPlayerVersion(VERSION);
    // Request video ads
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
    this._adsLoader.requestAds(adsRequest);
  }

  /**
   * Resize event handler.
   * @private
   * @returns {void}
   */
  _onResize() {
    if (this._sdk && this._adsManager) {
      let playerViewSize = this._getPlayerViewSize();
      this._adsManager.resize(playerViewSize.width, playerViewSize.height, this._sdk.ViewMode.NORMAL);
    }
  }

  /**
   * Gets the player view width and height.
   * @return {Object} - The player sizes.
   * @private
   */
  _getPlayerViewSize(): Object {
    let playerView = this.player.getView();
    let width = parseInt(getComputedStyle(playerView).width, 10);
    let height = parseInt(getComputedStyle(playerView).height, 10);
    return {width: width, height: height};
  }

  /**
   * Loadedmetada event handler.
   * @private
   * @returns {void}
   */
  _onLoadedMetadata(): void {
    this._contentPlayheadTracker.duration = this.player.duration;
  }

  /**
   * Timeupdate event handler.
   * @private
   * @returns {void}
   */
  _onMediaTimeUpdate(): void {
    if (!this._contentPlayheadTracker.seeking) {
      this._contentPlayheadTracker.previousTime = this._contentPlayheadTracker.currentTime;
      this._contentPlayheadTracker.currentTime = this.player.currentTime;
    }
  }

  /**
   * Seeking event handler.
   * @private
   * @returns {void}
   */
  _onMediaSeeking(): void {
    this._contentPlayheadTracker.seeking = true;
  }

  /**
   * Seeked event handler.
   * @private
   * @returns {void}
   */
  _onMediaSeeked(): void {
    this._contentPlayheadTracker.seeking = false;
  }

  /**
   * Removes or adds the listener for ended event.
   * @param {boolean} enable - Whether to enable the event listener or not.
   * @private
   * @return {void}
   */
  _setVideoEndedCallbackEnabled(enable: boolean): void {
    if (enable) {
      this.eventManager.listen(this.player, this.player.Event.ENDED, this._onMediaEnded.bind(this));
    } else {
      this.eventManager.unlisten(this.player, this.player.Event.ENDED);
    }
  }

  /**
   * Maybe save the video current time before ads starts (on ios this is necessary).
   * @private
   * @return {void}
   */
  _maybeSaveVideoCurrentTime(): void {
    if (this._adsManager.isCustomPlaybackUsed() &&
      this.player.currentTime &&
      this.player.currentTime > 0) {
      this.logger.debug("Custom playback used: save current time before ads", this.player.currentTime);
      this._videoLastCurrentTime = this.player.currentTime;
    }
  }

  /**
   * Maybe sets the video current time after ads finished (on ios this is necessary).
   * @private
   * @return {void}
   */
  _maybeSetVideoCurrentTime(): void {
    if (this._videoLastCurrentTime) {
      this.logger.debug("Custom playback used: set current time after ads", this.player.currentTime);
      this.player.currentTime = this._videoLastCurrentTime;
      this._videoLastCurrentTime = null;
    }
  }

  /**
   * Ended event handler.
   * @private
   * @returns {void}
   */
  _onMediaEnded(): void {
    this.logger.debug("Media ended");
    this._adsLoader.contentComplete();
    this._contentComplete = true;
  }


  /**
   * Shows the ads container.
   * @private
   * @returns {void}
   */
  _showAdsContainer(): void {
    if (this._adsContainerDiv) {
      this._adsContainerDiv.style.display = "";
    }
  }

  /**
   * Hides the ads container.
   * @private
   * @returns {void}
   */
  _hideAdsContainer(): void {
    if (this._adsContainerDiv) {
      this._adsContainerDiv.style.display = "none";
    }
  }

  /**
   * Checks for mobile platform.
   * @returns {boolean} - Whether the device is mobile or tablet.
   * @private
   */
  _isMobilePlatform(): boolean {
    let device = this.player.env.device.type;
    return (device === "mobile" || device === "tablet");
  }

  /**
   * Checks for iOS os.
   * @returns {boolean} - Whether the os name is iOS.
   * @private
   */
  _isIOS(): boolean {
    let os = this.player.env.os.name;
    return (os === "iOS");
  }

  /**
   * The ads manager loaded handler.
   * @param {Function} resolve - The resolve function of the loading promise.
   * @param {any} adsManagerLoadedEvent - The event data.
   * @private
   * @returns {void}
   */
  _onAdsManagerLoaded(resolve: Function, adsManagerLoadedEvent: any): void {
    this.logger.debug('Ads manager loaded');
    let adsRenderingSettings = new this._sdk.AdsRenderingSettings();
    adsRenderingSettings.restoreCustomPlaybackStateOnAdBreakComplete = true;
    /* For now we have issue with this settings: autoplay mobile doesn't works if it sets to true.
     adsRenderingSettings.enablePreloading = this.config.adsRenderingSettings.enablePreloading; */
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
    this._syncPlayerVolume();
    this._fsm.loaded().then(() => {
      resolve();
    });
  }

  /**
   * Syncs the player volume.
   * @private
   * @returns {void}
   */
  _syncPlayerVolume(): void {
    if (this._adsManager) {
      if (this.player.muted) {
        this._adsManager.setVolume(0);
      } else {
        this._adsManager.setVolume(this.player.volume);
      }
    }
  }

  /**
   * Binds an handler to a desired context.
   * @param {any} thisObj - The handler context.
   * @param {Function} fn - The handler.
   * @returns {Function} - The new bound function.
   * @private
   * @returns {void}
   */
  _bind(thisObj: any, fn: Function): void {
    return function () {
      fn.apply(thisObj, arguments);
    };
  }

  /**
   * Starts ad interval timer.
   * @private
   * @returns {void}
   */
  _startAdInterval(): void {
    this._intervalTimer = setInterval(() => {
      // let remainingTime = this._adsManager.getRemainingTime();
    }, 300);
  }

  /**
   * Maybe pre loaded the player.
   * @private
   * @returns {void}
   */
  _maybePreloadContent(): void {
    if (!this.player.src) {
      this.logger.debug("Preloading content");
      this.player.load();
    }
  }

  /**
   * Checks for mobile auto play and if it's the case, registers the necessary listeners.
   * @private
   * @returns {void}
   */
  _maybeHandleMobileAutoPlay(): void {
    if (this._isMobilePlatform()) {
      this._isMobileAutoPlay = this.player.config.playback.autoplay && this.player.muted;
      if (this._isIOS()) {
        this._isMobileAutoPlay = this._isMobileAutoPlay && this.player.playsinline;
      }
      if (this._isMobileAutoPlay) {
        this._setMobileAutoPlayCallbackEnable(true);
      }
    }
  }

  /**
   * The mobile auto play callback handler.
   * @private
   * @returns {void}
   */
  _handleMobileAutoPlayCallback(): void {
    this.logger.debug("Mobile auto play: cancel mute on user interaction");
    this._setMobileAutoPlayCallbackEnable(false);
    this._adsManager.setVolume(this.player.volume);
    this.player.muted = false;
  }

  /**
   * Register/unregister the mobile auto play handler to the relevant events.
   * @param {boolean} enable - Whether to add or remove the listeners.
   * @private
   * @returns {void}
   */
  _setMobileAutoPlayCallbackEnable(enable: boolean): void {
    if (enable) {
      // TODO: full screen event?
      this.player.addEventListener(this.player.Event.PAUSE, this._handleMobileAutoPlayCallback);
      this.player.addEventListener(this.player.Event.VOLUME_CHANGE, this._handleMobileAutoPlayCallback);
      this.player.addEventListener(this.player.Event.SEEKING, this._handleMobileAutoPlayCallback);
      this.player.addEventListener(this.player.Event.AD_PAUSED, this._handleMobileAutoPlayCallback);
      this.player.addEventListener(this.player.Event.AD_VOLUME_CHANGED, this._handleMobileAutoPlayCallback);
      this.player.addEventListener(this.player.Event.AD_CLICKED, this._handleMobileAutoPlayCallback);
    } else {
      this.player.removeEventListener(this.player.Event.PAUSE, this._handleMobileAutoPlayCallback);
      this.player.removeEventListener(this.player.Event.VOLUME_CHANGE, this._handleMobileAutoPlayCallback);
      this.player.removeEventListener(this.player.Event.SEEKING, this._handleMobileAutoPlayCallback);
      this.player.removeEventListener(this.player.Event.AD_PAUSED, this._handleMobileAutoPlayCallback);
      this.player.removeEventListener(this.player.Event.AD_VOLUME_CHANGED, this._handleMobileAutoPlayCallback);
      this.player.removeEventListener(this.player.Event.AD_CLICKED, this._handleMobileAutoPlayCallback);
    }
  }


  /**
   * Loads ima sdk lib dynamically.
   * @return {Promise} - The loading promise.
   * @private
   */
  _loadImaSDK(): Promise<*> {
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

// Register to the player
registerPlugin(pluginName, Ima);
