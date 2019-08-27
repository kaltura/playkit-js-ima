// @flow
import {ImaMiddleware} from './ima-middleware';
import {ImaAdsController} from './ima-ads-controller';
import {ImaStateMachine} from './ima-state-machine';
import {State} from './state';
import {BaseMiddleware, BasePlugin, EngineType, Error, getCapabilities, Utils, Env, AudioTrack, TextTrack} from '@playkit-js/playkit-js';
import './assets/style.css';
import {ImaEngineDecorator} from './ima-engine-decorator';

/**
 * The full screen events..
 * @type {Array<string>}
 * @const
 * @private
 */
const FULL_SCREEN_EVENTS: Array<string> = ['fullscreenchange', 'mozfullscreenchange', 'webkitfullscreenchange'];

/**
 * The overlay ad margin.
 * @type {number}
 * @const
 * @private
 */
const OVERLAY_AD_MARGIN: number = 8;
/**
 * The ads container class.
 * @type {string}
 * @const
 * @private
 */
const ADS_CONTAINER_CLASS: string = 'playkit-ads-container';
/**
 * The ads cover class.
 * @type {string}
 * @const
 * @private
 */
const ADS_COVER_CLASS: string = 'playkit-ads-cover';

/**
 * The ima plugin.
 * @class Ima
 * @param {string} name - The plugin name.
 * @param {Player} player - The player instance.
 * @param {ImaConfigObject} config - The plugin config.
 * @implements {IMiddlewareProvider}
 * @implements {IAdsControllerProvider}
 * @implements {IEngineDecoratorProvider}
 * @extends BasePlugin
 */
class Ima extends BasePlugin implements IMiddlewareProvider, IAdsControllerProvider, IEngineDecoratorProvider {
  /**
   * The default configuration of the plugin.
   * @type {Object}
   * @static
   * @memberof Ima
   */
  static defaultConfig: Object = {
    debug: false,
    delayInitUntilSourceSelected: Env.os.name === 'iOS',
    disableMediaPreload: false,
    forceReloadMediaAfterAds: false,
    adsRenderingSettings: {
      restoreCustomPlaybackStateOnAdBreakComplete: false,
      enablePreloading: false,
      useStyledLinearAds: false,
      useStyledNonLinearAds: true,
      bitrate: -1,
      autoAlign: true,
      loadVideoTimeout: -1
    },
    companions: {
      ads: null,
      sizeCriteria: 'SELECT_EXACT_MATCH'
    }
  };

  /**
   * The sdk lib url.
   * @type {string}
   * @static
   * @private
   * @memberof Ima
   */
  static IMA_SDK_LIB_URL: string = '//imasdk.googleapis.com/js/sdkloader/ima3.js';
  /**
   * The debug sdk lib url.
   * @type {string}
   * @static
   * @private
   * @memberof Ima
   */
  static IMA_SDK_DEBUG_LIB_URL: string = '//imasdk.googleapis.com/js/sdkloader/ima3_debug.js';
  /**
   * Promise for loading the plugin.
   * Will be resolved after:
   * 1) Ima script has been loaded in the page.
   * 2) The ads manager has been loaded and ready to start.
   * @type {Promise<*>}
   * @member
   * @public
   * @memberof Ima
   */
  loadPromise: DeferredPromise;
  /**
   * The finite state machine of the plugin.
   * @member
   * @private
   * @memberof Ima
   */
  _stateMachine: any;
  /**
   * The sdk api.
   * @member
   * @private
   * @memberof Ima
   */
  _sdk: any;
  /**
   * The ads container dom element.
   * @member
   * @private
   * @memberof Ima
   */
  _adsContainerDiv: HTMLElement;
  /**
   * The ads cover dom element.
   * @member
   * @private
   * @memberof Ima
   */
  _adsCoverDiv: HTMLElement;
  /**
   * The ima ads container object.
   * @private
   * @memberof Ima
   */
  _adDisplayContainer: any;
  /**
   * The ima ads manager.
   * @member
   * @private
   * @memberof Ima
   */
  _adsManager: any;
  /**
   * The ima ads loader.
   * @member
   * @private
   * @memberof Ima
   */
  _adsLoader: any;
  /**
   * The content tracker.
   * @member
   * @private
   * @memberof Ima
   */
  _contentPlayheadTracker: Object;
  /**
   * Flag to know when content complete.
   * @member
   * @private
   * @memberof Ima
   */
  _contentComplete: boolean;
  /**
   * Video current time before ads.
   * On custom playback when only one video tag playing, save the video current time.
   * @member
   * @private
   * @memberof Ima
   */
  _videoLastCurrentTime: ?number;
  /**
   * The promise which when resolved starts the next handler in the middleware chain.
   * @member
   * @private
   * @memberof Ima
   */
  _nextPromise: ?DeferredPromise;
  /**
   * The current playing ad.
   * @member
   * @private
   * @memberof Ima
   */
  _currentAd: any;
  /**
   * The content media duration.
   * @member
   * @private
   * @memberof Ima
   */
  _contentDuration: ?number;
  /**
   * The content media src.
   * @member
   * @private
   * @memberof Ima
   */
  _contentSrc: string;

  /**
   * Whether an initial user action happened.
   * @member
   * @private
   * @memberof Ima
   */
  _hasUserAction: boolean;
  /**
   * Whether the ads manager loaded.
   * @member
   * @private
   * @memberof Ima
   */
  _isAdsManagerLoaded: boolean;
  /**
   * The bounded handler of the ads container click.
   * @member
   * @private
   * @memberof Ima
   */
  _togglePlayPauseOnAdsContainerCallback: ?Function;
  /**
   * Whether the ads cover overlay is active.
   * @member
   * @private
   * @memberof Ima
   */
  _isAdsCoverActive: boolean;
  _selectedAudioTrack: ?AudioTrack;
  _selectedTextTrack: ?TextTrack;
  _selectedPlaybackRate: number;
  _textTracksHidden: Array<string>;

  /**
   * Whether the ima plugin is valid.
   * @static
   * @override
   * @public
   * @memberof Ima
   */
  static isValid() {
    return true;
  }

  constructor(name: string, player: Player, config: Object) {
    super(name, player, config);
    this._stateMachine = new ImaStateMachine(this);
    this._initMembers();
    this._init();
  }

  /**
   * Gets the engine decorator.
   * @param {IEngine} engine - The engine to decorate.
   * @public
   * @returns {IEngineDecorator} - The ads api.
   * @instance
   * @memberof Ima
   */
  getEngineDecorator(engine: IEngine): IEngineDecorator {
    return new ImaEngineDecorator(engine, this);
  }

  /**
   * Gets the middleware.
   * @public
   * @returns {ImaMiddleware} - The middleware api.
   * @instance
   * @memberof Ima
   */
  getMiddlewareImpl(): BaseMiddleware {
    return new ImaMiddleware(this);
  }

  /**
   * Gets the ads controller.
   * @public
   * @returns {IAdsPluginController} - The ads api.
   * @instance
   * @memberof Ima
   */
  getAdsController(): IAdsPluginController {
    return new ImaAdsController(this);
  }

  /**
   * TODO: Rethink on design and implementation.
   * Plays ad on demand.
   * @param {string} adTagUrl - The ad tag url to play.
   * @returns {void}
   * @private
   * @instance
   * @memberof Ima
   */
  playAdNow(adTagUrl: string): void {
    this.logger.warn('playAdNow API is not implemented yet', adTagUrl);
  }

  /**
   * Skips on an ad.
   * @returns {void}
   * @instance
   * @memberof Ima
   */
  skipAd(): void {
    this.logger.debug('Skip ad');
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
   * @instance
   * @memberof Ima
   */
  resumeAd(): ?DeferredPromise {
    this.logger.debug('Resume ad');
    this._nextPromise = Utils.Object.defer();
    this._adsManager.resume();
    return this._nextPromise;
  }

  /**
   * Pausing the ad.
   * @public
   * @returns {DeferredPromise} - The promise which when resolved starts the next handler in the middleware chain.
   * @instance
   * @memberof Ima
   */
  pauseAd(): ?DeferredPromise {
    this.logger.debug('Pause ad');
    this._adsManager.pause();
  }

  /**
   * Gets the state machine.
   * @public
   * @returns {any} - The state machine.
   * @instance
   * @memberof Ima
   */
  getStateMachine(): any {
    return this._stateMachine;
  }

  /**
   * Gets the indicator if ads playing on the main video tag
   * @public
   * @returns {boolean} - if ads playing on the main video tag.
   * @instance
   * @memberof Ima
   */
  playOnMainVideoTag() {
    return !!this._adsManager && !!this._adsManager.isCustomPlaybackUsed();
  }

  /**
   * Gets the indicator if ads still playing.
   * @public
   * @returns {boolean} - if ads still playing.
   * @instance
   * @memberof Ima
   */
  isAdPlaying(): boolean {
    return this._stateMachine.is(State.PLAYING) || this._stateMachine.is(State.PENDING) || this._stateMachine.is(State.PAUSED);
  }

  getContentTime(): number {
    let currentTime = 0;
    //current time exist for mid-roll otherwise it's pre-roll(start of video - 0) - post-roll(end of video)
    if (this._videoLastCurrentTime) {
      currentTime = this._videoLastCurrentTime;
    } else if (this._contentComplete) {
      currentTime = this.getContentDuration();
    }
    return currentTime;
  }

  getContentDuration(): number {
    return this._contentDuration || this.player.config.sources.duration || 0;
  }

  getContentSrc(): string {
    return this._contentSrc || '';
  }
  getContentEnded(): boolean {
    return this._contentComplete;
  }
  /**
   * Prepare the plugin before media is loaded.
   * @override
   * @public
   * @returns {void}
   * @instance
   * @memberof Ima
   */
  loadMedia(): void {
    this._addBindings();
    this.loadPromise.then(() => this._requestAds());
  }

  /**
   * Resets the plugin.
   * @override
   * @public
   * @returns {void}
   * @instance
   * @memberof Ima
   */
  reset(): void {
    this.logger.debug('reset');
    this.eventManager.removeAll();
    this._hideAdsContainer();
    if (!this._isImaSDKLibLoaded()) {
      return;
    }
    if (this._adsManager) {
      this._adsManager.destroy();
    }
    if (this._adsLoader && !this._contentComplete) {
      this._adsLoader.contentComplete();
    }
    this._stateMachine.goto(State.DONE);
    this._initMembers();
  }

  /**
   * Destroys the plugin.
   * @override
   * @public
   * @returns {void}
   * @instance
   * @memberof Ima
   */
  destroy(): void {
    this.logger.debug('destroy');
    this.eventManager.destroy();
    this._hideAdsContainer();
    if (this._adsManager) {
      this._adsManager.destroy();
    }
    if (this._adsLoader && !this._contentComplete) {
      this._adsLoader.contentComplete();
    }
    this._adsLoader = null;
  }

  /**
   * Initialize the ads for the first time.
   * @public
   * @returns {?DeferredPromise} - The promise which when resolved starts the next handler in the middleware chain.
   * @instance
   * @memberof Ima
   */
  initialUserAction(): ?DeferredPromise {
    try {
      this.logger.debug('Initial user action');
      this._nextPromise = Utils.Object.defer();
      this._adDisplayContainer.initialize();
      this._hasUserAction = true;
      if (!this.config.adTagUrl && !this.config.adsResponse) {
        this._resolveNextPromise();
        return this._nextPromise;
      }
      if (this._isAdsManagerLoaded) {
        this.logger.debug('User action occurred after ads manager loaded');
        this._startAdsManager();
      }
    } catch (adError) {
      this.logger.error(adError);
      this.reset();
    }
    return this._nextPromise;
  }

  /**
   * Starts the ads manager.
   * @private
   * @returns {void}
   * @instance
   * @memberof Ima
   */
  _startAdsManager(): void {
    this.logger.debug('Start ads manager');
    const readyPromise = this.playOnMainVideoTag() && !this.config.disableMediaPreload ? this.player.ready() : Promise.resolve();
    readyPromise.then(() => {
      this._adsManager.init(this.player.dimensions.width, this.player.dimensions.height, this._sdk.ViewMode.NORMAL);
      this._adsManager.start();
    });
  }

  /**
   * Adding bindings.
   * @private
   * @returns {void}
   * @instance
   * @memberof Ima
   */
  _addBindings(): void {
    FULL_SCREEN_EVENTS.forEach(fullScreenEvent => this.eventManager.listen(document, fullScreenEvent, () => this._resizeAd()));
    this.eventManager.listen(this.player, 'resize', () => this._resizeAd());
    this.eventManager.listen(this.player, this.player.Event.MUTE_CHANGE, () => this._syncPlayerVolume());
    this.eventManager.listen(this.player, this.player.Event.VOLUME_CHANGE, () => this._syncPlayerVolume());
    this.eventManager.listen(this.player, this.player.Event.SOURCE_SELECTED, event => {
      let selectedSource = event.payload.selectedSource;
      if (selectedSource && selectedSource.length > 0) {
        this._contentSrc = selectedSource[0].url;
      }
    });
    this.eventManager.listenOnce(this.player, this.player.Event.DURATION_CHANGE, () => {
      this._contentDuration = this.player.duration;
    });
    this.eventManager.listen(this.player, this.player.Event.ERROR, event => {
      if (event.payload && event.payload.severity === Error.Severity.CRITICAL) {
        this.reset();
      }
    });
    this.eventManager.listen(this.player, this.player.Event.FIRST_PLAY, () => {
      if (this._currentAd && !this._currentAd.isLinear()) {
        this._showAdsContainer();
      }
    });
    this.eventManager.listen(this.player, this.player.Event.MEDIA_LOADED, () => {
      this._adsManager.updateAdsRenderingSettings({
        restoreCustomPlaybackStateOnAdBreakComplete: !this.player.config.playback.playAdsWithMSE
      });
    });
    this.eventManager.listen(this.player, this.player.Event.ENDED, () => this._onMediaEnded());
    this.eventManager.listen(this.player, this.player.Event.LOADED_METADATA, () => this._onLoadedMetadata());
    this.eventManager.listen(this.player, this.player.Event.TIME_UPDATE, () => this._onMediaTimeUpdate());
    this.eventManager.listen(this.player, this.player.Event.SEEKING, () => this._onMediaSeeking());
    this.eventManager.listen(this.player, this.player.Event.SEEKED, () => this._onMediaSeeked());
  }

  /**
   * Init the members of the plugin.
   * @private
   * @returns {void}
   * @instance
   * @memberof Ima
   */
  _initMembers(): void {
    this._nextPromise = null;
    this._currentAd = null;
    this._adsManager = null;
    this._contentComplete = false;
    this._isAdsManagerLoaded = false;
    this._videoLastCurrentTime = null;
    this._contentPlayheadTracker = {currentTime: 0, previousTime: 0, seeking: false, duration: 0};
    this._hasUserAction = false;
    this._togglePlayPauseOnAdsContainerCallback = null;
    this._contentDuration = null;
    this._selectedAudioTrack = null;
    this._selectedTextTrack = null;
    this._selectedPlaybackRate = 1;
    this._textTracksHidden = [];
  }

  /**
   * Initializing the plugin.
   * @private
   * @returns {void}
   * @instance
   * @memberof Ima
   */
  _init(): void {
    this.loadPromise = Utils.Object.defer();
    this._maybeDelayInitUntilSourceSelected()
      .then(() => this._loadImaSDKLib())
      .then(() => {
        this._sdk = window.google.ima;
        this.logger.debug('IMA SDK version: ' + this._sdk.VERSION);
        this._initImaSettings();
        this._initAdsContainer();
        this._initAdsLoader();
        this.loadPromise.resolve();
      })
      .catch(e => {
        this.loadPromise.reject(e);
      });
  }

  /**
   * If configured, wait until source selected before will continue the initialization of the plugin.
   * @returns {Promise<*>} -
   * @private
   * @instance
   * @memberof Ima
   */
  _maybeDelayInitUntilSourceSelected(): Promise<*> {
    if (this.config.delayInitUntilSourceSelected) {
      return new Promise((resolve, reject) => {
        if (this._contentSrc) {
          // Source selected event already dispatched
          resolve();
        } else {
          this.eventManager.listenOnce(this.player, this.player.Event.SOURCE_SELECTED, resolve);
          this.eventManager.listenOnce(this.player, this.player.Event.ERROR, reject);
        }
      });
    } else {
      return Promise.resolve();
    }
  }

  /**
   * Loads the ima sdk lib.
   * @returns {Promise<*>} - The promise result for the load operation.
   * @private
   * @instance
   * @memberof Ima
   */
  _loadImaSDKLib(): Promise<*> {
    const imaSdkUrl = Utils.Http.protocol + (this.config.debug ? Ima.IMA_SDK_DEBUG_LIB_URL : Ima.IMA_SDK_LIB_URL);
    return this._isImaSDKLibLoaded() ? Promise.resolve() : Utils.Dom.loadScriptAsync(imaSdkUrl);
  }

  /**
   * Checks for ima sdk lib availability.
   * @returns {boolean} - Whether ima sdk lib is loaded.
   * @private
   * @instance
   * @memberof Ima
   */
  _isImaSDKLibLoaded(): boolean {
    return window.google && window.google.ima && window.google.ima.VERSION;
  }

  /**
   * Init ima settings.
   * @private
   * @returns {void}
   * @instance
   * @memberof Ima
   */
  _initImaSettings(): void {
    this._sdk.settings.setPlayerType(this.config.playerName);
    this._sdk.settings.setPlayerVersion(this.config.playerVersion);
    this._sdk.settings.setVpaidAllowed(true);
    this._sdk.settings.setVpaidMode(this._getVpaidMode());
    if (this.config.hasOwnProperty('locale')) {
      this._sdk.settings.setLocale(this.config.locale);
    }
    if (typeof this.config.setDisableCustomPlaybackForIOS10Plus === 'boolean') {
      this._sdk.settings.setDisableCustomPlaybackForIOS10Plus(this.config.setDisableCustomPlaybackForIOS10Plus);
    } else {
      this._sdk.settings.setDisableCustomPlaybackForIOS10Plus(this.player.config.playback.playsinline);
    }
    if (typeof this.config.numRedirects === 'number') {
      this._sdk.settings.setNumRedirects(this.config.numRedirects);
    }
  }

  /**
   * Gets the vpaid mode.
   * @private
   * @returns {number} - The vpaid mode.
   * @instance
   * @memberof Ima
   */
  _getVpaidMode(): number {
    const vpaidmode = this._sdk.ImaSdkSettings.VpaidMode[this.config.vpaidMode];
    if (this.config.vpaidMode && typeof vpaidmode === 'number') {
      this.logger.debug('VpaidMode: set to ' + this.config.vpaidMode);
      return vpaidmode;
    } else {
      this.logger.warn('VpaidMode is not set, setting to ENABLED');
      return this._sdk.ImaSdkSettings.VpaidMode.ENABLED;
    }
  }

  /**
   * Initializing the ad container.
   * @private
   * @returns {void}
   * @instance
   * @memberof Ima
   */
  _initAdsContainer(): void {
    this.logger.debug('Init ads container');
    const playerView = this.player.getView();
    // Create ads container
    this._adsContainerDiv = Utils.Dom.createElement('div');
    this._adsContainerDiv.id = ADS_CONTAINER_CLASS + playerView.id;
    this._adsContainerDiv.className = ADS_CONTAINER_CLASS;

    // Create ads cover
    this._adsCoverDiv = Utils.Dom.createElement('div');
    this._adsCoverDiv.id = ADS_COVER_CLASS + playerView.id;
    this._adsCoverDiv.className = ADS_COVER_CLASS;
    this._adsCoverDiv.onclick = () => this._onAdsCoverClicked();
    // Append the ads container to the dom
    Utils.Dom.appendChild(playerView, this._adsContainerDiv);
    this._adDisplayContainer = new this._sdk.AdDisplayContainer(this._adsContainerDiv, this.player.getVideoElement());
  }

  /**
   * Initializing the ads loader.
   * @private
   * @returns {void}
   * @instance
   * @memberof Ima
   */
  _initAdsLoader(): void {
    this.logger.debug('Init ads loader');
    this._adsLoader = new this._sdk.AdsLoader(this._adDisplayContainer);
    this._adsLoader.addEventListener(this._sdk.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, adsManagerLoadedEvent =>
      this._onAdsManagerLoaded(adsManagerLoadedEvent)
    );
    this._adsLoader.addEventListener(this._sdk.AdErrorEvent.Type.AD_ERROR, adEvent => this._stateMachine.aderror(adEvent));
  }

  /**
   * Requests the ads from the ads loader.
   * @private
   * @returns {void}
   * @instance
   * @memberof Ima
   */
  _requestAds(): void {
    if (this.config.adTagUrl || this.config.adsResponse) {
      this.logger.debug('Request ads');
      // Request video ads
      let adsRequest = new this._sdk.AdsRequest();
      if (this.config.adTagUrl) {
        adsRequest.adTagUrl = this.config.adTagUrl;
      } else {
        adsRequest.adsResponse = this.config.adsResponse;
      }
      if (typeof this.config.vastLoadTimeout === 'number') {
        adsRequest.vastLoadTimeout = this.config.vastLoadTimeout;
      }
      adsRequest.linearAdSlotWidth = this.player.dimensions.width;
      adsRequest.linearAdSlotHeight = this.player.dimensions.height;
      adsRequest.nonLinearAdSlotWidth = this.player.dimensions.width;
      adsRequest.nonLinearAdSlotHeight = this.player.dimensions.height / 3;

      const muted = this.player.muted || this.player.volume === 0;
      adsRequest.setAdWillPlayMuted(muted);

      const adWillAutoPlay = this.config.adWillAutoPlay;
      const playerWillAutoPlay = this.player.config.playback.autoplay;
      const allowMutedAutoPlay = this.player.config.playback.allowMutedAutoPlay;

      // Pass signal to IMA SDK if ad will autoplay with sound
      // First let application config this, otherwise if player is configured
      // to autoplay then try to autodetect if unmuted autoplay is supported
      if (typeof adWillAutoPlay === 'boolean') {
        adsRequest.setAdWillAutoPlay(adWillAutoPlay);
        this._adsLoader.requestAds(adsRequest);
      } else if (playerWillAutoPlay) {
        getCapabilities(EngineType.HTML5).then(capabilities => {
          // If the plugin has been destroyed while calling this promise
          // the adsLoader will no longer exists
          if (!this._adsLoader) return;

          if (capabilities.autoplay) {
            adsRequest.setAdWillAutoPlay(true);
          } else if (allowMutedAutoPlay && capabilities.mutedAutoPlay) {
            adsRequest.setAdWillAutoPlay(true);
            adsRequest.setAdWillPlayMuted(true);
          } else {
            adsRequest.setAdWillAutoPlay(false);
          }
          this._adsLoader.requestAds(adsRequest);
        });
      } else {
        adsRequest.setAdWillAutoPlay(false);
        this._adsLoader.requestAds(adsRequest);
      }
      this._stateMachine.loaded();
    } else {
      this._stateMachine.goto(State.DONE);
      this.logger.warn('Missing ad tag url: create plugin without requesting ads');
    }
  }

  /**
   * Resize event handler.
   * @private
   * @returns {void}
   * @instance
   * @memberof Ima
   */
  _resizeAd() {
    if (this._sdk && this._adsManager && this._currentAd) {
      let viewMode = this.player.isFullscreen() ? this._sdk.ViewMode.FULLSCREEN : this._sdk.ViewMode.NORMAL;
      if (this._currentAd.isLinear()) {
        this._adsManager.resize(this.player.dimensions.width, this.player.dimensions.height, viewMode);
      } else {
        this._alignAdsContainerSizeForOverlayAd();
        this._adsManager.resize(this._currentAd.getWidth() + OVERLAY_AD_MARGIN, this._currentAd.getHeight() + OVERLAY_AD_MARGIN, viewMode);
      }
    }
  }

  /**
   * Align the size for the ads container when overlay ad is displaying.
   * @private
   * @returns {void}
   * @instance
   * @memberof Ima
   */
  _alignAdsContainerSizeForOverlayAd(): void {
    this._adsContainerDiv.style.bottom = this._currentAd.getHeight() + OVERLAY_AD_MARGIN + 'px';
    this._adsContainerDiv.style.left = (this.player.dimensions.width - this._currentAd.getWidth()) / 2 + 'px';
  }

  /**
   * Loadedmetada event handler.
   * @private
   * @returns {void}
   * @instance
   * @memberof Ima
   * @instance
   * @memberof Ima
   */
  _onLoadedMetadata(): void {
    this._contentPlayheadTracker.duration = this.player.duration;
  }

  /**
   * Timeupdate event handler.
   * @private
   * @returns {void}
   * @instance
   * @memberof Ima
   */
  _onMediaTimeUpdate(): void {
    if (!this._contentPlayheadTracker.seeking && this.player.currentTime > 0) {
      this._contentPlayheadTracker.previousTime = this._contentPlayheadTracker.currentTime;
      this._contentPlayheadTracker.currentTime = this.player.currentTime;
    }
  }

  /**
   * Seeking event handler.
   * @private
   * @returns {void}
   * @instance
   * @memberof Ima
   */
  _onMediaSeeking(): void {
    this._contentPlayheadTracker.seeking = true;
  }

  /**
   * Seeked event handler.
   * @private
   * @returns {void}
   * @instance
   * @memberof Ima
   */
  _onMediaSeeked(): void {
    this._contentPlayheadTracker.seeking = false;
  }

  /**
   * Maybe save the video current time before ads starts (on ios this is necessary).
   * @private
   * @return {void}
   * @instance
   * @memberof Ima
   */
  _maybeSaveVideoCurrentTime(): void {
    if ((this.playOnMainVideoTag() || this.config.forceReloadMediaAfterAds) && this.player.currentTime && this.player.currentTime > 0) {
      this.logger.debug('Custom playback used: save current time before ads', this.player.currentTime);
      this._videoLastCurrentTime = this.player.currentTime;
    }
  }

  /**
   * Maybe sets the video current time after ads finished (on ios this is necessary).
   * @private
   * @return {void}
   * @instance
   * @memberof Ima
   */
  _maybeSetVideoCurrentTime(): void {
    if (this._videoLastCurrentTime) {
      this.logger.debug('Custom playback used: set current time after ads', this._videoLastCurrentTime);
      this.player.currentTime = this._videoLastCurrentTime;
      this._videoLastCurrentTime = null;
    }
  }

  /**
   * Ended event handler.
   * @private
   * @returns {void}
   * @instance
   * @memberof Ima
   */
  _onMediaEnded(): void {
    this.logger.debug('Media ended');
    this._contentComplete = true;
    if (this._currentAd && !this._currentAd.isLinear()) {
      this.reset();
    }
  }

  /**
   * Ended event handler.
   * @public
   * @returns {Promise<void>} - complete promise
   * @instance
   * @memberof Ima
   */
  onPlaybackEnded(): Promise<void> {
    this.logger.debug('Playback ended');
    this._adsLoader.contentComplete();
    if (this._adsManager && this._adsManager.getCuePoints().includes(-1)) {
      return new Promise(resolve => {
        this.eventManager.listenOnce(this._adsManager, this._sdk.AdEvent.Type.ALL_ADS_COMPLETED, () => {
          resolve();
        });
      });
    }
    return Promise.resolve();
  }

  /**
   * Shows the ads container.
   * @private
   * @returns {void}
   * @instance
   * @memberof Ima
   */
  _showAdsContainer(): void {
    if (this._adsContainerDiv) {
      this._adsContainerDiv.style.visibility = 'visible';
    }
  }

  /**
   * Hides the ads container.
   * @private
   * @returns {void}
   * @instance
   * @memberof Ima
   */
  _hideAdsContainer(): void {
    if (this._adsContainerDiv) {
      this._adsContainerDiv.style.visibility = 'hidden';
    }
  }

  /**
   * The ads manager loaded handler.
   * @param {any} adsManagerLoadedEvent - The event data.
   * @private
   * @returns {void}
   * @instance
   * @memberof Ima
   */
  _onAdsManagerLoaded(adsManagerLoadedEvent: any): void {
    this.logger.debug('Ads manager loaded');
    const adsRenderingSettings = this._getAdsRenderingSetting();
    this._adsManager = adsManagerLoadedEvent.getAdsManager(this._contentPlayheadTracker, adsRenderingSettings);
    this.config.forceReloadMediaAfterAds = this.playOnMainVideoTag() ? false : this.config.forceReloadMediaAfterAds;
    const cuePoints = this._adsManager.getCuePoints();
    if (!cuePoints.length) {
      cuePoints.push(0);
    }
    this.dispatchEvent(this.player.Event.AD_MANIFEST_LOADED, {adBreaksPosition: cuePoints});
    this._isAdsManagerLoaded = true;
    this._attachAdsManagerListeners();
    this._syncPlayerVolume();
    if (this._hasUserAction) {
      this.logger.debug('User action occurred before ads manager loaded');
      this._startAdsManager();
    }
  }

  /**
   * returns the ads rendering settings configuration for IMA with plugin config applied
   * @returns {Object} - IMA AdsRenderingSettings object
   * @private
   * @instance
   * @memberof Ima
   */
  _getAdsRenderingSetting(): Object {
    let adsRenderingSettings = new this._sdk.AdsRenderingSettings();
    Object.keys(this.config.adsRenderingSettings).forEach(setting => {
      if (adsRenderingSettings[setting] !== undefined) {
        adsRenderingSettings[setting] = this.config.adsRenderingSettings[setting];
      } else {
        this.logger.warn('unsupported adsRenderingSettings was set:', setting);
      }
    });
    adsRenderingSettings.restoreCustomPlaybackStateOnAdBreakComplete = false;
    if (typeof this.config.adsRenderingSettings.playAdsAfterTime !== 'number') {
      adsRenderingSettings.playAdsAfterTime = this.player.config.playback.startTime;
    }
    return adsRenderingSettings;
  }

  /**
   * Attach the ads manager listeners.
   * @private
   * @returns {void}
   * @instance
   * @memberof Ima
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
    this._adsManager.addEventListener(this._sdk.AdEvent.Type.ALL_ADS_COMPLETED, adEvent => this._stateMachine.adscompleted(adEvent));
    this._adsManager.addEventListener(this._sdk.AdEvent.Type.USER_CLOSE, adEvent => this._stateMachine.userclosedad(adEvent));
    this._adsManager.addEventListener(this._sdk.AdEvent.Type.VOLUME_CHANGED, adEvent => this._stateMachine.advolumechanged(adEvent));
    this._adsManager.addEventListener(this._sdk.AdEvent.Type.VOLUME_MUTED, adEvent => this._stateMachine.admuted(adEvent));
    this._adsManager.addEventListener(this._sdk.AdEvent.Type.AD_PROGRESS, adEvent => this._stateMachine.adprogress(adEvent));
    this._adsManager.addEventListener(this._sdk.AdEvent.Type.AD_BUFFERING, adEvent => this._stateMachine.adbuffering(adEvent));
    this._adsManager.addEventListener(this._sdk.AdEvent.Type.LOG, adEvent => this._stateMachine.aderror(adEvent));
    this._adsManager.addEventListener(this._sdk.AdEvent.Type.SKIPPABLE_STATE_CHANGED, adEvent => this._stateMachine.adcanskip(adEvent));
    this._adsManager.addEventListener(this._sdk.AdErrorEvent.Type.AD_ERROR, adEvent => this._stateMachine.aderror(adEvent));
  }
  /**
   * Syncs the player volume.
   * @private
   * @returns {void}
   * @instance
   * @memberof Ima
   */
  _syncPlayerVolume(): void {
    if (this._adsManager) {
      if (this.player.muted) {
        this._adsManager.setVolume(0);
      } else {
        if (this._adsManager && typeof this.player.volume === 'number' && this.player.volume !== this._adsManager.getVolume()) {
          this._adsManager.setVolume(this.player.volume);
        }
      }
    }
  }

  /**
   * Resolves the next promise to let the next handler in the middleware chain start.
   * @private
   * @returns {void}
   * @instance
   * @memberof Ima
   */
  _resolveNextPromise(): void {
    if (this._nextPromise) {
      this._nextPromise.resolve();
      this._nextPromise = null;
    }
  }

  /**
   * Toggle the ads cover div.
   * @param {boolean} enable - Whether to add or remove the ads cover.
   * @private
   * @returns {void}
   * @instance
   * @memberof Ima
   */
  _setToggleAdsCover(enable: boolean): void {
    if (enable) {
      if (!this.playOnMainVideoTag()) {
        if (this._adsContainerDiv.parentNode) {
          this._adsContainerDiv.parentNode.insertBefore(this._adsCoverDiv, this._adsContainerDiv.nextSibling);
          this._isAdsCoverActive = true;
        }
      }
    } else {
      if (this._isAdsCoverActive) {
        if (this._adsContainerDiv.parentNode) {
          this._adsContainerDiv.parentNode.removeChild(this._adsCoverDiv);
          this._isAdsCoverActive = false;
        }
      }
    }
  }

  /**
   * On ads cover click handler.
   * @private
   * @returns {void}
   * @instance
   * @memberof Ima
   */
  _onAdsCoverClicked(): void {
    if (this._adsManager) {
      switch (this._stateMachine.state) {
        case State.PAUSED:
          this._adsManager.resume();
          break;
        case State.PLAYING:
          this._adsManager.pause();
          break;
        default:
          break;
      }
    }
  }

  /**
   * Displays companion ads using the Ad API.
   * @private
   * @returns {void}
   * @instance
   * @memberof Ima
   */
  _maybeDisplayCompanionAds(): void {
    if (this.config.companions && this.config.companions.ads && !window.googletag) {
      const selectionCriteria = new this._sdk.CompanionAdSelectionSettings();
      selectionCriteria.resourceType = this._sdk.CompanionAdSelectionSettings.ResourceType.ALL;
      selectionCriteria.creativeType = this._sdk.CompanionAdSelectionSettings.CreativeType.ALL;
      const sizeCriteria = this.config.companions.sizeCriteria;
      selectionCriteria.sizeCriteria =
        this._sdk.CompanionAdSelectionSettings.SizeCriteria[sizeCriteria] || this._sdk.CompanionAdSelectionSettings.SizeCriteria.SELECT_EXACT_MATCH;
      const companionsIds = Object.keys(this.config.companions.ads);
      for (let i = 0; i < companionsIds.length; i++) {
        const id = companionsIds[i];
        const ad = this.config.companions.ads[id];
        const width = ad.width;
        const height = ad.height;
        try {
          const companionAds = this._currentAd.getCompanionAds(width, height, selectionCriteria);
          if (companionAds.length > 0) {
            const companionAd = companionAds[0];
            const content = companionAd.getContent();
            const el = Utils.Dom.getElementById(id);
            if (el) {
              el.innerHTML = content;
            }
          }
        } catch (e) {
          this.logger.error('Error occurred while extracting companion ad', e);
        }
      }
    }
  }

  /**
   * On Chrome-Android we're ignoring LearnMore click to enable
   * video element manipulation only on user gesture.
   * @private
   * @returns {void}
   * @instance
   * @memberof Ima
   */
  _maybeIgnoreClickOnAd(): void {
    const isAndroid = () => this.player.env.os.name === 'Android';
    const isChrome = () => this.player.env.browser.name === 'Chrome';
    if (isAndroid() && isChrome()) {
      this.eventManager.listenOnce(this.player.getView(), 'click', e => e.stopPropagation());
    }
  }

  /**
   * On iOS AVPlayer caption stack on video tag, should re-position to hide
   * @private
   * @returns {void}
   * @instance
   * @memberof Ima
   */
  _hideActiveTextTracksOnAVPlayer(): void {
    const isIOS = this.player.env.os.name === 'iOS';
    if (isIOS && this.playOnMainVideoTag()) {
      let tracks = this.player.getVideoElement().textTracks;
      Array.from(tracks).forEach(track => {
        if (track.mode === 'showing') {
          Array.from(track.activeCues).forEach(cue => {
            this._textTracksHidden.push(cue.text);
            cue.text = '';
          });
        }
      });
    }
  }

  _setActiveTextTracksOnAVPlayer(): void {
    const isIOS = this.player.env.os.name === 'iOS';
    if (this._textTracksHidden && isIOS && this.playOnMainVideoTag()) {
      let tracks = this.player.getVideoElement().textTracks;
      Array.from(tracks).forEach(track => {
        if (track === 'showing') {
          Array.from(track.activeCues).forEach(cue => {
            if (this._textTracksHidden.length > 0) {
              cue.text = this._textTracksHidden.shift();
            }
          });
        }
      });
    }
    this._textTracksHidden = [];
  }
  /**
   * When playing with different video tags on iOS ads are not
   * supported in native full screen, so need to exist full screen before ads started.
   * @private
   * @returns {void}
   * @instance
   * @memberof Ima
   */
  _maybeForceExitFullScreen(): void {
    const isIOS = this.player.env.os.name === 'iOS';
    //check if inBrowserFullscreen not set, just in case of inline true and not inBrowserFullscreen we will exit otherwise
    if (
      isIOS &&
      !this.playOnMainVideoTag() &&
      (this.player.isFullscreen() && !this.player.config.playback.inBrowserFullscreen) &&
      this.player.config.playback.playsinline
    ) {
      this.player.exitFullscreen();
    }
  }
}

export {Ima};
