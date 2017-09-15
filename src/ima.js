// @flow
import ImaMiddleware from './ima-middleware'
import ImaStateMachine from './ima-state-machine'
import State from './state'
import {registerPlugin, BasePlugin} from 'playkit-js'
import {VERSION} from 'playkit-js'
import {PLAYER_NAME} from 'playkit-js'
import {BaseMiddleware} from 'playkit-js'
import {Utils} from 'playkit-js'

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
    companions: {},
    adsRenderingSettings: {
      restoreCustomPlaybackStateOnAdBreakComplete: true,
      enablePreloading: false,
      useStyledLinearAds: false,
      useStyledNonLinearAds: true,
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
  loadPromise: DeferredPromise;
  /**
   * The finite state machine of the plugin.
   * @member
   * @private
   */
  _stateMachine: any;
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
   * The promise which when resolved starts the next handler in the middleware chain.
   * @member
   * @private
   */
  _nextPromise: ?DeferredPromise;
  /**
   * The current playing ad.
   * @member
   * @private
   */
  _currentAd: any;

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
    this._stateMachine = new ImaStateMachine(this);
    this._intervalTimer = null;
    this._videoLastCurrentTime = null;
    this._adsManager = null;
    this._contentComplete = false;
    this._contentPlayheadTracker = {currentTime: 0, previousTime: 0, seeking: false, duration: 0};
    this._addBindings();
    this._init();
  }

  /**
   * Plays ad on demand.
   * @param {string} adTagUrl - The ad tag url to play.
   * @returns {void}
   */
  playAdNow(adTagUrl: string): void {
    super.updateConfig({adTagUrl: adTagUrl});
    this.loadPromise = Utils.Object.defer();
    this.destroy();
    this._addBindings();
    this._initAdsLoader();
    this._requestAds();
    this.loadPromise.then(this._startAdsManager.bind(this));
  }

  /**
   * Skips on an ad.
   * @returns {void}
   */
  skipAd(): void {
    this.logger.debug("Skip ad");
    if (this._adsManager) {
      if (this._adsManager.getAdSkippableState()) {
        this._adsManager.skip();
      } else if (this.config.skipSupport) {
        this._adsManager.stop();
      }
    }
  }

  /**
   * Resuming the ad.
   * @public
   * @returns {DeferredPromise} - The promise which when resolved starts the next handler in the middleware chain.
   */
  resumeAd(): ?DeferredPromise {
    this.logger.debug("Resume ad");
    this._nextPromise = Utils.Object.defer();
    this._adsManager.resume();
    return this._nextPromise;
  }

  /**
   * Pausing the ad.
   * @public
   * @returns {DeferredPromise} - The promise which when resolved starts the next handler in the middleware chain.
   */
  pauseAd(): ?DeferredPromise {
    this.logger.debug("Pause ad");
    this._nextPromise = Utils.Object.defer();
    this._adsManager.pause();
    return this._nextPromise;
  }

  /**
   * Updates the configuration of the plugin.
   * @param {Object} update - The fully or partially updated configuration.
   * @override
   * @returns {void}
   */
  updateConfig(update: Object): void {
    super.updateConfig(update);
    if (update.adTagUrl && this._stateMachine.is(State.LOADING)) {
      this._requestAds();
    }
  }

  /**
   * Gets the state machine.
   * @public
   * @returns {any} - The state machine.
   */
  getStateMachine(): any {
    return this._stateMachine;
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
    this._stopAdInterval();
    this._hideAdsContainer();
    if (this._adsManager) {
      this._adsManager.destroy();
    }
    if (this._adsLoader && !this._contentComplete) {
      this._adsLoader.contentComplete();
    }
    this._currentAd = null;
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
   * @returns {?DeferredPromise} - The promise which when resolved starts the next handler in the middleware chain.
   */
  initialUserAction(): ?DeferredPromise {
    try {
      this.logger.debug("Initial user action");
      this._nextPromise = Utils.Object.defer();
      this._adDisplayContainer.initialize();
      this.player.load();
      this._requestAds();
    } catch (adError) {
      this.logger.error(adError);
      this.destroy();
    }
    return this._nextPromise;
  }

  /**
   * Starts the ads manager.
   * @private
   * @returns {void}
   */
  _startAdsManager(): void {
    let playerViewSize = this._getPlayerViewSize();
    this.logger.debug("Start ads manager");
    this._adsManager.init(playerViewSize.width, playerViewSize.height, this._sdk.ViewMode.NORMAL);
    this._adsManager.start();
  }

  /**
   * Adding bindings.
   * @private_addBindings
   * @returns {void}
   */
  _addBindings(): void {
    this.eventManager.listen(window, 'resize', this._resizeAd.bind(this));
    this.eventManager.listen(this.player.getVideoElement(), 'resize', this._resizeAd.bind(this));
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
    this.loadPromise = Utils.Object.defer();
    this._isImaSDKLibLoaded()
      ? Promise.resolve()
      : Utils.Dom.loadScriptAsync(this.config.debug ? Ima.IMA_SDK_DEBUG_LIB_URL : Ima.IMA_SDK_LIB_URL)
        .then(() => {
          this._sdk = window.google.ima;
          this.logger.debug("IMA SDK version: " + this._sdk.VERSION);
          this._initImaSettings();
          this._initAdsContainer();
          this._initAdsLoader();
          this._stateMachine.loaded();
          this.loadPromise.resolve();
        }).catch((e) => {
          this.loadPromise.reject(e);
        });
  }

  /**
   * Checks for ima sdk lib availability.
   * @returns {boolean} - Whether ima sdk lib is loaded.
   * @private
   */
  _isImaSDKLibLoaded(): boolean {
    return (window.google && window.google.ima && window.google.ima.VERSION);
  }

  /**
   * Init ima settings.
   * @private
   * @returns {void}
   */
  _initImaSettings(): void {
    this._sdk.settings.setPlayerType(PLAYER_NAME);
    this._sdk.settings.setPlayerVersion(VERSION);
    this._sdk.settings.setVpaidAllowed(true);
    this._sdk.settings.setVpaidMode(this._sdk.ImaSdkSettings.VpaidMode.ENABLED);
    this._sdk.settings.setDisableCustomPlaybackForIOS10Plus(true);
  }

  /**
   * Initializing the ad container.
   * @private
   * @returns {void}
   */
  _initAdsContainer(): void {
    this.logger.debug("Init ads container");
    let adsContainerDiv = Utils.Dom.getElementById(ADS_CONTAINER_ID);
    if (!adsContainerDiv) {
      let playerView = this.player.getView();
      this._adsContainerDiv = Utils.Dom.createElement('div');
      this._adsContainerDiv.id = ADS_CONTAINER_ID + playerView.id;
      this._adsContainerDiv.style.position = "absolute";
      this._adsContainerDiv.style.top = "0px";
      Utils.Dom.appendChild(playerView, this._adsContainerDiv);
    } else {
      this._adsContainerDiv = adsContainerDiv;
    }
    this._adDisplayContainer = new this._sdk.AdDisplayContainer(this._adsContainerDiv, this.player.getVideoElement());
  }

  /**
   * Initializing the ads loader.
   * @private
   * @returns {void}
   */
  _initAdsLoader(): void {
    this.logger.debug("Init ads loader");
    this._adsLoader = new this._sdk.AdsLoader(this._adDisplayContainer);
    this._adsLoader.addEventListener(this._sdk.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, this._onAdsManagerLoaded.bind(this));
    this._adsLoader.addEventListener(this._sdk.AdErrorEvent.Type.AD_ERROR, adEvent => this._stateMachine.aderror(adEvent));
  }

  /**
   * Requests the ads from the ads loader.
   * @private
   * @returns {void}
   */
  _requestAds(): void {
    if (this.config.adTagUrl || this.config.adsResponse) {
      this.logger.debug("Request ads");
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
    } else {
      this.logger.warn("Missing ad tag url: create plugin without requesting ads");
    }
  }

  /**
   * Resize event handler.
   * @private
   * @returns {void}
   */
  _resizeAd() {
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
    if (this._adsManager.isCustomPlaybackUsed() && this.player.currentTime && this.player.currentTime > 0) {
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
      this.logger.debug("Custom playback used: set current time after ads", this._videoLastCurrentTime);
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
    if (!this._currentAd.isLinear()) {
      this.destroy();
    }
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
   * The ads manager loaded handler.
   * @param {any} adsManagerLoadedEvent - The event data.
   * @private
   * @returns {void}
   */
  _onAdsManagerLoaded(adsManagerLoadedEvent: any): void {
    this.logger.debug('Ads manager loaded');
    let adsRenderingSettings = new this._sdk.AdsRenderingSettings();
    Object.keys(this.config.adsRenderingSettings).forEach((setting) => {
      if (adsRenderingSettings[setting] != null) {
        adsRenderingSettings[setting] = this.config.adsRenderingSettings[setting];
      }
    });
    this._adsManager = adsManagerLoadedEvent.getAdsManager(this._contentPlayheadTracker, adsRenderingSettings);
    this._attachAdsManagerListeners();
    this._syncPlayerVolume();
    this.player.ready().then(() => {
      this._startAdsManager();
    });
  }

  /**
   * Attach the ads manager listeners.
   * @private
   * @returns {void}
   */
  _attachAdsManagerListeners(): void {
    this._adsManager.addEventListener(this._sdk.AdEvent.Type.CONTENT_PAUSE_REQUESTED, adEvent => this._stateMachine.adbreakstart(adEvent));
    this._adsManager.addEventListener(this._sdk.AdEvent.Type.LOADED, adEvent => this._stateMachine.adloaded(adEvent));
    this._adsManager.addEventListener(this._sdk.AdEvent.Type.STARTED, adEvent => this._stateMachine.adstarted(adEvent));
    this._adsManager.addEventListener(this._sdk.AdEvent.Type.PAUSED, adEvent => this._stateMachine.adpaused(adEvent));
    this._adsManager.addEventListener(this._sdk.AdEvent.Type.RESUMED, adEvent => this._stateMachine.adresumed(adEvent));
    this._adsManager.addEventListener(this._sdk.AdEvent.Type.FIRST_QUARTILE, adEvent => this._stateMachine.adfirstquartile(adEvent));
    this._adsManager.addEventListener(this._sdk.AdEvent.Type.MIDPOINT, adEvent => this._stateMachine.admidpoint(adEvent));
    this._adsManager.addEventListener(this._sdk.AdEvent.Type.THIRD_QUARTILE, adEvent => this._stateMachine.adthirdquartile(adEvent));
    this._adsManager.addEventListener(this._sdk.AdEvent.Type.CLICK, adEvent => this._stateMachine.adclicked(adEvent));
    this._adsManager.addEventListener(this._sdk.AdEvent.Type.SKIPPED, adEvent => this._stateMachine.adskipped(adEvent));
    this._adsManager.addEventListener(this._sdk.AdEvent.Type.COMPLETE, adEvent => this._stateMachine.adcompleted(adEvent));
    this._adsManager.addEventListener(this._sdk.AdEvent.Type.CONTENT_RESUME_REQUESTED, adEvent => this._stateMachine.adbreakend(adEvent));
    this._adsManager.addEventListener(this._sdk.AdEvent.Type.ALL_ADS_COMPLETED, adEvent => this._stateMachine.alladscompleted(adEvent));
    this._adsManager.addEventListener(this._sdk.AdEvent.Type.USER_CLOSE, adEvent => this._stateMachine.userclosedad(adEvent));
    this._adsManager.addEventListener(this._sdk.AdEvent.Type.VOLUME_CHANGED, adEvent => this._stateMachine.advolumechanged(adEvent));
    this._adsManager.addEventListener(this._sdk.AdEvent.Type.VOLUME_MUTED, adEvent => this._stateMachine.admuted(adEvent));
    this._adsManager.addEventListener(this._sdk.AdEvent.Type.LOG, adEvent => this._stateMachine.aderror(adEvent));
    this._adsManager.addEventListener(this._sdk.AdErrorEvent.Type.AD_ERROR, adEvent => this._stateMachine.aderror(adEvent));
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
   * Starts ad interval timer.
   * @private
   * @returns {void}
   */
  _startAdInterval(): void {
    this._stopAdInterval();
    this._intervalTimer = setInterval(() => {
      if (this._stateMachine.is(State.PLAYING)) {
        let remainingTime = this._adsManager.getRemainingTime();
        let duration = this._adsManager.getCurrentAd().getDuration();
        let currentTime = duration - remainingTime;
        if (Utils.Number.isNumber(duration) && Utils.Number.isNumber(currentTime)) {
          this.dispatchEvent(this.player.Event.AD_PROGRESS, {
            adProgress: {
              currentTime: currentTime,
              duration: duration
            }
          });
        }
      }
    }, 300);
  }

  /**
   * Stops ads interval timer.
   * @private
   * @returns {void}
   */
  _stopAdInterval(): void {
    if (this._intervalTimer) {
      clearInterval(this._intervalTimer);
      this._intervalTimer = null;
    }
  }

  /**
   * Resolves the next promise to let the next handler in the middleware chain start.
   * @private
   * @returns {void}
   */
  _resolveNextPromise(): void {
    if (this._nextPromise) {
      this._nextPromise.resolve();
      this._nextPromise = null;
    }
  }

  /**
   * Displays companion ads using the Ad API.
   * @private
   * @returns {void}
   */
  _maybeDisplayCompanionAds(): void {
    if (this.config.companions && !window.googletag) {
      let companionsIds = Object.keys(this.config.companions);
      for (let i = 0; i < companionsIds.length; i++) {
        let id = companionsIds[i];
        let width = this.config.companions[id].width;
        let height = this.config.companions[id].height;
        let sizeCriteria = this.config.companions[id].sizeCriteria || '';
        let companionAds = [];
        try {
          let selectionCriteria = new this._sdk.CompanionAdSelectionSettings();
          selectionCriteria.resourceType = this._sdk.CompanionAdSelectionSettings.ResourceType.ALL;
          selectionCriteria.creativeType = this._sdk.CompanionAdSelectionSettings.CreativeType.ALL;
          switch (sizeCriteria.toLowerCase()) {
            case 'selectnearmatch':
              selectionCriteria.sizeCriteria = this._sdk.CompanionAdSelectionSettings.SizeCriteria.SELECT_NEAR_MATCH;
              break;
            case 'ignore':
              selectionCriteria.sizeCriteria = this._sdk.CompanionAdSelectionSettings.SizeCriteria.IGNORE;
              break;
            case 'selectexactmatch':
            default:
              selectionCriteria.sizeCriteria = this._sdk.CompanionAdSelectionSettings.SizeCriteria.SELECT_EXACT_MATCH;
              break;
          }
          companionAds = this._currentAd.getCompanionAds(width, height, selectionCriteria);
          if (companionAds.length > 0) {
            let companionAd = companionAds[0];
            let content = companionAd.getContent();
            let el = Utils.Dom.getElementById(id);
            if (el) {
              el.innerHTML = content;
            }
          }
        } catch (e) {
          this.logger.error(e);
        }
      }
    }
  }
}

registerPlugin(pluginName, Ima);
