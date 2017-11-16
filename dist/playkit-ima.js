(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("playkit-js"));
	else if(typeof define === 'function' && define.amd)
		define(["playkit-js"], factory);
	else if(typeof exports === 'object')
		exports["PlaykitJsIma"] = factory(require("playkit-js"));
	else
		root["PlaykitJsIma"] = factory(root["Playkit"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_0__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_0__;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var State = {
  LOADING: "loading",
  LOADED: "loaded",
  PLAYING: "playing",
  PAUSED: "paused",
  IDLE: "idle",
  DONE: "done"
};

exports.default = State;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _imaMiddleware = __webpack_require__(4);

var _imaMiddleware2 = _interopRequireDefault(_imaMiddleware);

var _imaStateMachine = __webpack_require__(5);

var _imaStateMachine2 = _interopRequireDefault(_imaStateMachine);

var _state = __webpack_require__(1);

var _state2 = _interopRequireDefault(_state);

var _playkitJs = __webpack_require__(0);

__webpack_require__(8);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * The ads container class.
 * @type {string}
 * @const
 */
var ADS_CONTAINER_CLASS = "playkit-ads-container";
/**
 * The ads cover class.
 * @type {string}
 * @const
 */
var ADS_COVER_CLASS = "playkit-ads-cover";

/**
 * The ima plugin.
 * @classdesc
 */

var Ima = function (_BasePlugin) {
  _inherits(Ima, _BasePlugin);

  _createClass(Ima, null, [{
    key: 'isValid',


    /**
     * Whether the ima plugin is valid.
     * @static
     * @override
     * @public
     */

    /**
     * Promise for loading the plugin.
     * Will be resolved after:
     * 1) Ima script has been loaded in the page.
     * 2) The ads manager has been loaded and ready to start.
     * @type {Promise<*>}
     * @member
     * @public
     */

    /**
     * The finite state machine of the plugin.
     * @member
     * @private
     */

    /**
     * The sdk api.
     * @member
     * @private
     */

    /**
     * The ads container dom element.
     * @member
     * @private
     */

    /**
     * The ads cover dom element.
     * @member
     * @private
     */

    /**
     * The ima ads container object.
     */

    /**
     * The ima ads manager.
     * @member
     * @private
     */

    /**
     * The ima ads loader.
     * @member
     * @private
     */

    /**
     * The content tracker.
     * @member
     * @private
     */

    /**
     * Flag to know when content complete.
     * @member
     * @private
     */

    /**
     * The ad interval timer.
     * @member
     * @private
     */

    /**
     * Video current time before ads.
     * On custom playback when only one video tag playing, save the video current time.
     * @member
     * @private
     */

    /**
     * The promise which when resolved starts the next handler in the middleware chain.
     * @member
     * @private
     */

    /**
     * The current playing ad.
     * @member
     * @private
     */

    /**
     * The content media src.
     * @member
     * @private
     */

    /**
     * Whether an initial user action happened.
     * @member
     * @private
     */

    /**
     * Whether the ads manager loaded.
     * @member
     * @private
     */

    /**
     * The bounded handler of the ads container click.
     * @member
     * @private
     */

    /**
     * Whether the ads cover overlay is active.
     * @member
     * @private
     */


    /**
     * The sdk lib url.
     * @type {string}
     * @static
     */
    value: function isValid() {
      return true;
    }

    /**
     * @constructor
     * @param {string} name - The plugin name.
     * @param {Player} player - The player instance.
     * @param {Object} config - The plugin config.
     */

    /**
     * The debug sdk lib url.
     * @type {string}
     * @static
     */


    /**
     * The default configuration of the plugin.
     * @type {Object}
     * @static
     */

  }]);

  function Ima(name, player, config) {
    _classCallCheck(this, Ima);

    var _this = _possibleConstructorReturn(this, (Ima.__proto__ || Object.getPrototypeOf(Ima)).call(this, name, player, config));

    _this._stateMachine = new _imaStateMachine2.default(_this);
    _this._initMembers();
    _this._addBindings();
    _this._init();
    return _this;
  }

  /**
   * TODO: Rethink on design and implementation.
   * Plays ad on demand.
   * @param {string} adTagUrl - The ad tag url to play.
   * @returns {void}
   */


  _createClass(Ima, [{
    key: 'playAdNow',
    value: function playAdNow(adTagUrl) {
      this.logger.warn("playAdNow API is not implemented yet", adTagUrl);
    }

    /**
     * Skips on an ad.
     * @returns {void}
     */

  }, {
    key: 'skipAd',
    value: function skipAd() {
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

  }, {
    key: 'resumeAd',
    value: function resumeAd() {
      this.logger.debug("Resume ad");
      this._nextPromise = _playkitJs.Utils.Object.defer();
      this._adsManager.resume();
      return this._nextPromise;
    }

    /**
     * Pausing the ad.
     * @public
     * @returns {DeferredPromise} - The promise which when resolved starts the next handler in the middleware chain.
     */

  }, {
    key: 'pauseAd',
    value: function pauseAd() {
      this.logger.debug("Pause ad");
      this._nextPromise = _playkitJs.Utils.Object.defer();
      this._adsManager.pause();
      return this._nextPromise;
    }

    /**
     * Gets the state machine.
     * @public
     * @returns {any} - The state machine.
     */

  }, {
    key: 'getStateMachine',
    value: function getStateMachine() {
      return this._stateMachine;
    }

    /**
     * Gets the middleware.
     * @public
     * @returns {ImaMiddleware} - The middleware api.
     */

  }, {
    key: 'getMiddlewareImpl',
    value: function getMiddlewareImpl() {
      return new _imaMiddleware2.default(this);
    }

    /**
     * Resets the plugin.
     * @override
     * @public
     * @returns {void}
     */

  }, {
    key: 'reset',
    value: function reset() {
      this.logger.debug("reset");
      this.eventManager.removeAll();
      this._stopAdInterval();
      this._hideAdsContainer();
      if (this._adsManager) {
        this._adsManager.destroy();
      }
      if (this._adsLoader && !this._contentComplete) {
        this._adsLoader.contentComplete();
      }
      this._initMembers();
      this._addBindings();
      if (!this._adsLoader) {
        this._initAdsLoader();
      }
      this._requestAds();
      if (this.config.adTagUrl) {
        this._stateMachine.loaded();
      } else {
        this._stateMachine.goto(_state2.default.DONE);
      }
    }

    /**
     * Destroys the plugin.
     * @override
     * @public
     * @returns {void}
     */

  }, {
    key: 'destroy',
    value: function destroy() {
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
      this._adsLoader = null;
      this._initMembers();
    }

    /**
     * Initialize the ads for the first time.
     * @public
     * @returns {?DeferredPromise} - The promise which when resolved starts the next handler in the middleware chain.
     */

  }, {
    key: 'initialUserAction',
    value: function initialUserAction() {
      try {
        this.logger.debug("Initial user action");
        this._nextPromise = _playkitJs.Utils.Object.defer();
        this._adDisplayContainer.initialize();
        this._hasUserAction = true;
        if (this._isAdsManagerLoaded) {
          this.logger.debug("User action occurred after ads manager loaded");
          this._startAdsManager();
        }
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

  }, {
    key: '_startAdsManager',
    value: function _startAdsManager() {
      var _this2 = this;

      this.logger.debug("Start ads manager");
      var readyPromise = this._adsManager.isCustomPlaybackUsed() ? this.player.ready() : Promise.resolve();
      readyPromise.then(function () {
        _this2._adsManager.init(_this2.player.dimensions.width, _this2.player.dimensions.height, _this2._sdk.ViewMode.NORMAL);
        _this2._adsManager.start();
      });
    }

    /**
     * Adding bindings.
     * @private_addBindings
     * @returns {void}
     */

  }, {
    key: '_addBindings',
    value: function _addBindings() {
      var _this3 = this;

      ['fullscreenchange', 'mozfullscreenchange', 'webkitfullscreenchange'].forEach(function (fullScreenEvent) {
        return _this3.eventManager.listen(document, fullScreenEvent, _this3._resizeAd.bind(_this3));
      });
      this.eventManager.listen(window, 'resize', this._resizeAd.bind(this));
      this.eventManager.listen(this.player, this.player.Event.MUTE_CHANGE, this._syncPlayerVolume.bind(this));
      this.eventManager.listen(this.player, this.player.Event.VOLUME_CHANGE, this._syncPlayerVolume.bind(this));
      this.eventManager.listen(this.player, this.player.Event.SOURCE_SELECTED, function (event) {
        var selectedSource = event.payload.selectedSource;
        if (selectedSource && selectedSource.length > 0) {
          _this3._contentSrc = selectedSource[0].url;
        }
      });
    }

    /**
     * Init the members of the plugin.
     * @private
     * @returns {void}
     */

  }, {
    key: '_initMembers',
    value: function _initMembers() {
      this._setTogglePlayPauseOnAdsContainerEnabled(false);
      this._setContentPlayheadTrackerEventsEnabled(false);
      this._setVideoEndedCallbackEnabled(false);
      this._nextPromise = null;
      this._currentAd = null;
      this._adsManager = null;
      this._contentComplete = false;
      this._isAdsManagerLoaded = false;
      this._intervalTimer = null;
      this._videoLastCurrentTime = null;
      this._contentPlayheadTracker = { currentTime: 0, previousTime: 0, seeking: false, duration: 0 };
      this._hasUserAction = false;
      this._togglePlayPauseOnAdsContainerCallback = null;
    }

    /**
     * Initializing the plugin.
     * @private
     * @returns {void}
     */

  }, {
    key: '_init',
    value: function _init() {
      var _this4 = this;

      this.loadPromise = _playkitJs.Utils.Object.defer();
      (this._isImaSDKLibLoaded() ? Promise.resolve() : _playkitJs.Utils.Dom.loadScriptAsync(this.config.debug ? Ima.IMA_SDK_DEBUG_LIB_URL : Ima.IMA_SDK_LIB_URL)).then(function () {
        _this4._sdk = window.google.ima;
        _this4.logger.debug("IMA SDK version: " + _this4._sdk.VERSION);
        _this4._initImaSettings();
        _this4._initAdsContainer();
        _this4._initAdsLoader();
        _this4._requestAds();
        _this4._stateMachine.loaded();
        _this4.loadPromise.resolve();
      }).catch(function (e) {
        _this4.loadPromise.reject(e);
      });
    }

    /**
     * Checks for ima sdk lib availability.
     * @returns {boolean} - Whether ima sdk lib is loaded.
     * @private
     */

  }, {
    key: '_isImaSDKLibLoaded',
    value: function _isImaSDKLibLoaded() {
      return window.google && window.google.ima && window.google.ima.VERSION;
    }

    /**
     * Init ima settings.
     * @private
     * @returns {void}
     */

  }, {
    key: '_initImaSettings',
    value: function _initImaSettings() {
      this._sdk.settings.setPlayerType(this.config.playerName);
      this._sdk.settings.setPlayerVersion(this.config.playerVersion);
      this._sdk.settings.setVpaidAllowed(true);
      this._sdk.settings.setVpaidMode(this._sdk.ImaSdkSettings.VpaidMode.ENABLED);
      if (this.config.setDisableCustomPlaybackForIOS10Plus === 'boolean') {
        this._sdk.settings.setDisableCustomPlaybackForIOS10Plus(this.config.setDisableCustomPlaybackForIOS10Plus);
      } else {
        this._sdk.settings.setDisableCustomPlaybackForIOS10Plus(this.player.config.playback.playsinline);
      }
    }

    /**
     * Initializing the ad container.
     * @private
     * @returns {void}
     */

  }, {
    key: '_initAdsContainer',
    value: function _initAdsContainer() {
      var _this5 = this;

      this.logger.debug("Init ads container");
      var playerView = this.player.getView();
      // Create ads container
      this._adsContainerDiv = _playkitJs.Utils.Dom.createElement('div');
      this._adsContainerDiv.id = ADS_CONTAINER_CLASS + playerView.id;
      this._adsContainerDiv.className = ADS_CONTAINER_CLASS;
      // Create ads cover
      this._adsCoverDiv = _playkitJs.Utils.Dom.createElement('div');
      this._adsCoverDiv.id = ADS_COVER_CLASS + playerView.id;
      this._adsCoverDiv.className = ADS_COVER_CLASS;
      this._adsCoverDiv.onclick = function () {
        return _this5.resumeAd();
      };
      // Append the ads container to the dom
      _playkitJs.Utils.Dom.appendChild(playerView, this._adsContainerDiv);
      this._adDisplayContainer = new this._sdk.AdDisplayContainer(this._adsContainerDiv, this.player.getVideoElement());
    }

    /**
     * Initializing the ads loader.
     * @private
     * @returns {void}
     */

  }, {
    key: '_initAdsLoader',
    value: function _initAdsLoader() {
      var _this6 = this;

      this.logger.debug("Init ads loader");
      this._adsLoader = new this._sdk.AdsLoader(this._adDisplayContainer);
      this._adsLoader.addEventListener(this._sdk.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, this._onAdsManagerLoaded.bind(this));
      this._adsLoader.addEventListener(this._sdk.AdErrorEvent.Type.AD_ERROR, function (adEvent) {
        return _this6._stateMachine.aderror(adEvent);
      });
    }

    /**
     * Requests the ads from the ads loader.
     * @private
     * @returns {void}
     */

  }, {
    key: '_requestAds',
    value: function _requestAds() {
      if (this.config.adTagUrl || this.config.adsResponse) {
        this.logger.debug("Request ads");
        // Request video ads
        var adsRequest = new this._sdk.AdsRequest();
        if (this.config.adTagUrl) {
          adsRequest.adTagUrl = this.config.adTagUrl;
        } else {
          adsRequest.adsResponse = this.config.adsResponse;
        }
        adsRequest.linearAdSlotWidth = this.player.dimensions.width;
        adsRequest.linearAdSlotHeight = this.player.dimensions.height;
        adsRequest.nonLinearAdSlotWidth = this.player.dimensions.width;
        adsRequest.nonLinearAdSlotHeight = this.player.dimensions.height / 3;
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

  }, {
    key: '_resizeAd',
    value: function _resizeAd() {
      if (this._sdk && this._adsManager) {
        var viewMode = this.player.isFullscreen() ? this._sdk.ViewMode.FULLSCREEN : this._sdk.ViewMode.NORMAL;
        this._adsManager.resize(this.player.dimensions.width, this.player.dimensions.height, viewMode);
      }
    }

    /**
     * Loadedmetada event handler.
     * @private
     * @returns {void}
     */

  }, {
    key: '_onLoadedMetadata',
    value: function _onLoadedMetadata() {
      this._contentPlayheadTracker.duration = this.player.duration;
    }

    /**
     * Timeupdate event handler.
     * @private
     * @returns {void}
     */

  }, {
    key: '_onMediaTimeUpdate',
    value: function _onMediaTimeUpdate() {
      if (!this._contentPlayheadTracker.seeking) {
        this._contentPlayheadTracker.previousTime = this._contentPlayheadTracker.currentTime;
        this._contentPlayheadTracker.currentTime = this.player.currentTime;
      }
    }

    /**
     * Sets the content playhead tracker events enabled/disabled.
     * @param {boolean} enabled - Whether do enabled the events.
     * @private
     * @returns {void}
     */

  }, {
    key: '_setContentPlayheadTrackerEventsEnabled',
    value: function _setContentPlayheadTrackerEventsEnabled(enabled) {
      if (enabled) {
        this.eventManager.listen(this.player, this.player.Event.LOADED_METADATA, this._onLoadedMetadata.bind(this));
        this.eventManager.listen(this.player, this.player.Event.TIME_UPDATE, this._onMediaTimeUpdate.bind(this));
        this.eventManager.listen(this.player, this.player.Event.SEEKING, this._onMediaSeeking.bind(this));
        this.eventManager.listen(this.player, this.player.Event.SEEKED, this._onMediaSeeked.bind(this));
      } else {
        this.eventManager.unlisten(this.player, this.player.Event.LOADED_METADATA);
        this.eventManager.unlisten(this.player, this.player.Event.TIME_UPDATE);
        this.eventManager.unlisten(this.player, this.player.Event.SEEKING);
        this.eventManager.unlisten(this.player, this.player.Event.SEEKED);
      }
    }

    /**
     * Seeking event handler.
     * @private
     * @returns {void}
     */

  }, {
    key: '_onMediaSeeking',
    value: function _onMediaSeeking() {
      this._contentPlayheadTracker.seeking = true;
    }

    /**
     * Seeked event handler.
     * @private
     * @returns {void}
     */

  }, {
    key: '_onMediaSeeked',
    value: function _onMediaSeeked() {
      this._contentPlayheadTracker.seeking = false;
    }

    /**
     * Removes or adds the listener for ended event.
     * @param {boolean} enable - Whether to enable the event listener or not.
     * @private
     * @return {void}
     */

  }, {
    key: '_setVideoEndedCallbackEnabled',
    value: function _setVideoEndedCallbackEnabled(enable) {
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

  }, {
    key: '_maybeSaveVideoCurrentTime',
    value: function _maybeSaveVideoCurrentTime() {
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

  }, {
    key: '_maybeSetVideoCurrentTime',
    value: function _maybeSetVideoCurrentTime() {
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

  }, {
    key: '_onMediaEnded',
    value: function _onMediaEnded() {
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

  }, {
    key: '_showAdsContainer',
    value: function _showAdsContainer() {
      if (this._adsContainerDiv) {
        this._adsContainerDiv.style.display = "";
      }
    }

    /**
     * Hides the ads container.
     * @private
     * @returns {void}
     */

  }, {
    key: '_hideAdsContainer',
    value: function _hideAdsContainer() {
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

  }, {
    key: '_onAdsManagerLoaded',
    value: function _onAdsManagerLoaded(adsManagerLoadedEvent) {
      var _this7 = this;

      this.logger.debug('Ads manager loaded');
      var adsRenderingSettings = new this._sdk.AdsRenderingSettings();
      Object.keys(this.config.adsRenderingSettings).forEach(function (setting) {
        if (adsRenderingSettings[setting] != null) {
          adsRenderingSettings[setting] = _this7.config.adsRenderingSettings[setting];
        }
      });
      this._adsManager = adsManagerLoadedEvent.getAdsManager(this._contentPlayheadTracker, adsRenderingSettings);
      this._isAdsManagerLoaded = true;
      this._attachAdsManagerListeners();
      this._syncPlayerVolume();
      if (this._hasUserAction) {
        this.logger.debug("User action occurred before ads manager loaded");
        this._startAdsManager();
      }
    }

    /**
     * Attach the ads manager listeners.
     * @private
     * @returns {void}
     */

  }, {
    key: '_attachAdsManagerListeners',
    value: function _attachAdsManagerListeners() {
      var _this8 = this;

      this._adsManager.addEventListener(this._sdk.AdEvent.Type.CONTENT_PAUSE_REQUESTED, function (adEvent) {
        return _this8._stateMachine.adbreakstart(adEvent);
      });
      this._adsManager.addEventListener(this._sdk.AdEvent.Type.LOADED, function (adEvent) {
        return _this8._stateMachine.adloaded(adEvent);
      });
      this._adsManager.addEventListener(this._sdk.AdEvent.Type.STARTED, function (adEvent) {
        return _this8._stateMachine.adstarted(adEvent);
      });
      this._adsManager.addEventListener(this._sdk.AdEvent.Type.PAUSED, function (adEvent) {
        return _this8._stateMachine.adpaused(adEvent);
      });
      this._adsManager.addEventListener(this._sdk.AdEvent.Type.RESUMED, function (adEvent) {
        return _this8._stateMachine.adresumed(adEvent);
      });
      this._adsManager.addEventListener(this._sdk.AdEvent.Type.FIRST_QUARTILE, function (adEvent) {
        return _this8._stateMachine.adfirstquartile(adEvent);
      });
      this._adsManager.addEventListener(this._sdk.AdEvent.Type.MIDPOINT, function (adEvent) {
        return _this8._stateMachine.admidpoint(adEvent);
      });
      this._adsManager.addEventListener(this._sdk.AdEvent.Type.THIRD_QUARTILE, function (adEvent) {
        return _this8._stateMachine.adthirdquartile(adEvent);
      });
      this._adsManager.addEventListener(this._sdk.AdEvent.Type.CLICK, function (adEvent) {
        return _this8._stateMachine.adclicked(adEvent);
      });
      this._adsManager.addEventListener(this._sdk.AdEvent.Type.SKIPPED, function (adEvent) {
        return _this8._stateMachine.adskipped(adEvent);
      });
      this._adsManager.addEventListener(this._sdk.AdEvent.Type.COMPLETE, function (adEvent) {
        return _this8._stateMachine.adcompleted(adEvent);
      });
      this._adsManager.addEventListener(this._sdk.AdEvent.Type.CONTENT_RESUME_REQUESTED, function (adEvent) {
        return _this8._stateMachine.adbreakend(adEvent);
      });
      this._adsManager.addEventListener(this._sdk.AdEvent.Type.ALL_ADS_COMPLETED, function (adEvent) {
        return _this8._stateMachine.alladscompleted(adEvent);
      });
      this._adsManager.addEventListener(this._sdk.AdEvent.Type.USER_CLOSE, function (adEvent) {
        return _this8._stateMachine.userclosedad(adEvent);
      });
      this._adsManager.addEventListener(this._sdk.AdEvent.Type.VOLUME_CHANGED, function (adEvent) {
        return _this8._stateMachine.advolumechanged(adEvent);
      });
      this._adsManager.addEventListener(this._sdk.AdEvent.Type.VOLUME_MUTED, function (adEvent) {
        return _this8._stateMachine.admuted(adEvent);
      });
      this._adsManager.addEventListener(this._sdk.AdEvent.Type.LOG, function (adEvent) {
        return _this8._stateMachine.aderror(adEvent);
      });
      this._adsManager.addEventListener(this._sdk.AdErrorEvent.Type.AD_ERROR, function (adEvent) {
        return _this8._stateMachine.aderror(adEvent);
      });
    }

    /**
     * Syncs the player volume.
     * @private
     * @returns {void}
     */

  }, {
    key: '_syncPlayerVolume',
    value: function _syncPlayerVolume() {
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
     * Starts ad interval timer.
     * @private
     * @returns {void}
     */

  }, {
    key: '_startAdInterval',
    value: function _startAdInterval() {
      var _this9 = this;

      this._stopAdInterval();
      this._intervalTimer = setInterval(function () {
        if (_this9._stateMachine.is(_state2.default.PLAYING)) {
          var remainingTime = _this9._adsManager.getRemainingTime();
          var duration = _this9._adsManager.getCurrentAd().getDuration();
          var currentTime = duration - remainingTime;
          if (_playkitJs.Utils.Number.isNumber(duration) && _playkitJs.Utils.Number.isNumber(currentTime)) {
            _this9.dispatchEvent(_this9.player.Event.AD_PROGRESS, {
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

  }, {
    key: '_stopAdInterval',
    value: function _stopAdInterval() {
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

  }, {
    key: '_resolveNextPromise',
    value: function _resolveNextPromise() {
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
     */

  }, {
    key: '_setToggleAdsCover',
    value: function _setToggleAdsCover(enable) {
      if (enable) {
        if (!this._adsManager.isCustomPlaybackUsed()) {
          this._adsContainerDiv.appendChild(this._adsCoverDiv);
          this._isAdsCoverActive = true;
        }
      } else {
        if (this._isAdsCoverActive) {
          this._adsContainerDiv.removeChild(this._adsCoverDiv);
          this._isAdsCoverActive = false;
        }
      }
    }

    /**
     * Toggle play/pause when click on the ads container.
     * Relevant only for overlay ads.
     * @param {boolean} enable - Whether to add or remove the listener.
     * @private
     * @returns {void}
     */

  }, {
    key: '_setTogglePlayPauseOnAdsContainerEnabled',
    value: function _setTogglePlayPauseOnAdsContainerEnabled(enable) {
      if (this._adsContainerDiv && this._togglePlayPauseOnAdsContainerCallback) {
        if (enable) {
          this._adsContainerDiv.addEventListener("click", this._togglePlayPauseOnAdsContainerCallback);
        } else {
          this._adsContainerDiv.removeEventListener("click", this._togglePlayPauseOnAdsContainerCallback);
        }
      }
    }

    /**
     * On ads container click handler.
     * @private
     * @returns {void}
     */

  }, {
    key: '_onAdsContainerClicked',
    value: function _onAdsContainerClicked() {
      this.player.paused ? this.player.play() : this.player.pause();
    }

    /**
     * Displays companion ads using the Ad API.
     * @private
     * @returns {void}
     */

  }, {
    key: '_maybeDisplayCompanionAds',
    value: function _maybeDisplayCompanionAds() {
      if (this.config.companions && !window.googletag) {
        var companionsIds = Object.keys(this.config.companions);
        for (var i = 0; i < companionsIds.length; i++) {
          var id = companionsIds[i];
          var width = this.config.companions[id].width;
          var height = this.config.companions[id].height;
          var sizeCriteria = this.config.companions[id].sizeCriteria || '';
          var companionAds = [];
          try {
            var selectionCriteria = new this._sdk.CompanionAdSelectionSettings();
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
              var companionAd = companionAds[0];
              var content = companionAd.getContent();
              var el = _playkitJs.Utils.Dom.getElementById(id);
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
  }]);

  return Ima;
}(_playkitJs.BasePlugin);

Ima.defaultConfig = {
  debug: false,
  companions: {},
  setDisableCustomPlaybackForIOS10Plus: null,
  adsRenderingSettings: {
    restoreCustomPlaybackStateOnAdBreakComplete: true,
    enablePreloading: false,
    useStyledLinearAds: false,
    useStyledNonLinearAds: true,
    bitrate: -1,
    autoAlign: true
  }
};
Ima.IMA_SDK_LIB_URL = "//imasdk.googleapis.com/js/sdkloader/ima3.js";
Ima.IMA_SDK_DEBUG_LIB_URL = "//imasdk.googleapis.com/js/sdkloader/ima3_debug.js";
exports.default = Ima;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NAME = exports.VERSION = undefined;

var _playkitJs = __webpack_require__(0);

var _ima = __webpack_require__(2);

var _ima2 = _interopRequireDefault(_ima);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _ima2.default;
exports.VERSION = "0.3.0";
exports.NAME = "playkit-js-ima";

/**
 * The plugin name.
 * @type {string}
 * @const
 */

var pluginName = "ima";

(0, _playkitJs.registerPlugin)(pluginName, _ima2.default);

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _playkitJs = __webpack_require__(0);

var _ima = __webpack_require__(2);

var _ima2 = _interopRequireDefault(_ima);

var _state = __webpack_require__(1);

var _state2 = _interopRequireDefault(_state);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Middleware implementation for ima plugin.
 * @classdesc
 */
var ImaMiddleware = function (_BaseMiddleware) {
  _inherits(ImaMiddleware, _BaseMiddleware);

  /**
   * @constructor
   * @param {Ima} context - The ima plugin context.
   */

  /**
   * Whether the player has been loaded.
   * @member
   * @private
   */

  /**
   * The plugin context.
   * @member
   * @private
   */
  function ImaMiddleware(context) {
    _classCallCheck(this, ImaMiddleware);

    var _this = _possibleConstructorReturn(this, (ImaMiddleware.__proto__ || Object.getPrototypeOf(ImaMiddleware)).call(this));

    _this.id = "ImaMiddleware";

    _this._context = context;
    context.player.addEventListener(context.player.Event.CHANGE_SOURCE_STARTED, function () {
      return _this._isPlayerLoaded = false;
    });
    return _this;
  }

  /**
   * Play middleware handler.
   * @param {Function} next - The next play handler in the middleware chain.
   * @returns {void}
   */

  /**
   * The id of the ima middleware.
   * @type {string}
   * @public
   */


  _createClass(ImaMiddleware, [{
    key: 'play',
    value: function play(next) {
      var _this2 = this;

      if (!this._isPlayerLoaded) {
        this._context.player.load();
        this._isPlayerLoaded = true;
        this._context.logger.debug("Player loaded");
      }
      this._context.loadPromise.then(function () {
        var sm = _this2._context.getStateMachine();
        switch (sm.state) {
          case _state2.default.LOADED:
            {
              var initialUserAction = _this2._context.initialUserAction();
              if (initialUserAction) {
                initialUserAction.then(function () {
                  _this2.callNext(next);
                });
              } else {
                _this2.callNext(next);
              }
              break;
            }
          case _state2.default.PAUSED:
            {
              var resumeAd = _this2._context.resumeAd();
              if (resumeAd) {
                resumeAd.then(function () {
                  _this2.callNext(next);
                });
              } else {
                _this2.callNext(next);
              }
              break;
            }
          default:
            {
              _this2.callNext(next);
              break;
            }
        }
      }).catch(function (e) {
        _this2._context.destroy();
        _this2._context.logger.error(e);
        _this2.callNext(next);
      });
    }

    /**
     * Pause middleware handler.
     * @param {Function} next - The next pause handler in the middleware chain.
     * @returns {void}
     */

  }, {
    key: 'pause',
    value: function pause(next) {
      var sm = this._context.getStateMachine();
      switch (sm.state) {
        case _state2.default.PLAYING:
          {
            this._context.pauseAd();
            break;
          }
        default:
          {
            this.callNext(next);
            break;
          }
      }
    }
  }]);

  return ImaMiddleware;
}(_playkitJs.BaseMiddleware);

exports.default = ImaMiddleware;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _javascriptStateMachine = __webpack_require__(6);

var _javascriptStateMachine2 = _interopRequireDefault(_javascriptStateMachine);

var _history = __webpack_require__(7);

var _history2 = _interopRequireDefault(_history);

var _state = __webpack_require__(1);

var _state2 = _interopRequireDefault(_state);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Finite state machine for ima plugin.
 * @classdesc
 */
var ImaStateMachine =
/**
 * @constructor
 * @param {any} context - The plugin context.
 */
function ImaStateMachine(context) {
  _classCallCheck(this, ImaStateMachine);

  return new _javascriptStateMachine2.default({
    init: _state2.default.LOADING,
    transitions: [{
      name: 'loaded',
      from: [_state2.default.LOADING, _state2.default.LOADED, _state2.default.IDLE, _state2.default.PAUSED, _state2.default.PLAYING, _state2.default.DONE],
      to: _state2.default.LOADED
    }, {
      name: context.player.Event.AD_STARTED,
      from: [_state2.default.LOADED, _state2.default.IDLE, _state2.default.PAUSED],
      to: function to(adEvent) {
        var ad = adEvent.getAd();
        if (!ad.isLinear()) {
          return _state2.default.IDLE;
        }
        return _state2.default.PLAYING;
      }
    }, {
      name: context.player.Event.AD_RESUMED,
      from: _state2.default.PAUSED,
      to: _state2.default.PLAYING
    }, {
      name: context.player.Event.AD_PAUSED,
      from: _state2.default.PLAYING,
      to: _state2.default.PAUSED
    }, {
      name: context.player.Event.AD_SKIPPED,
      from: [_state2.default.PLAYING, _state2.default.PAUSED],
      to: _state2.default.IDLE
    }, {
      name: context.player.Event.AD_COMPLETED,
      from: _state2.default.PLAYING,
      to: _state2.default.IDLE
    }, {
      name: context.player.Event.ALL_ADS_COMPLETED,
      from: _state2.default.IDLE,
      to: _state2.default.DONE
    }, {
      name: context.player.Event.AD_BREAK_END,
      from: [_state2.default.IDLE, _state2.default.LOADED],
      to: _state2.default.IDLE
    }, {
      name: context.player.Event.AD_ERROR,
      from: [_state2.default.LOADED, _state2.default.PLAYING, _state2.default.PAUSED, _state2.default.LOADING],
      to: _state2.default.IDLE
    }, {
      name: context.player.Event.AD_LOADED,
      from: [_state2.default.IDLE, _state2.default.LOADED]
    }, {
      name: context.player.Event.AD_FIRST_QUARTILE,
      from: _state2.default.PLAYING
    }, {
      name: context.player.Event.AD_BREAK_START,
      from: [_state2.default.IDLE, _state2.default.LOADED]
    }, {
      name: context.player.Event.AD_MIDPOINT,
      from: _state2.default.PLAYING
    }, {
      name: context.player.Event.AD_THIRD_QUARTILE,
      from: _state2.default.PLAYING
    }, {
      name: context.player.Event.USER_CLOSED_AD,
      from: [_state2.default.IDLE, _state2.default.PLAYING, _state2.default.PAUSED]
    }, {
      name: context.player.Event.AD_VOLUME_CHANGED,
      from: [_state2.default.PLAYING, _state2.default.PAUSED, _state2.default.LOADED]
    }, {
      name: context.player.Event.AD_MUTED,
      from: [_state2.default.PLAYING, _state2.default.PAUSED, _state2.default.LOADED]
    }, {
      name: context.player.Event.AD_CLICKED,
      from: [_state2.default.PLAYING, _state2.default.PAUSED, _state2.default.IDLE]
    }, {
      name: 'goto', from: '*', to: function to(s) {
        return s;
      }
    }],
    methods: {
      onAdloaded: onAdLoaded.bind(context),
      onAdstarted: onAdStarted.bind(context),
      onAdpaused: onAdEvent.bind(context),
      onAdresumed: onAdResumed.bind(context),
      onAdclicked: onAdClicked.bind(context),
      onAdskipped: onAdSkipped.bind(context),
      onAdcompleted: onAdCompleted.bind(context),
      onAlladscompleted: onAllAdsCompleted.bind(context),
      onAdbreakstart: onAdBreakStart.bind(context),
      onAdbreakend: onAdBreakEnd.bind(context),
      onAdfirstquartile: onAdEvent.bind(context),
      onAdmidpoint: onAdEvent.bind(context),
      onAdthirdquartile: onAdEvent.bind(context),
      onAderror: onAdError.bind(context),
      onUserclosedad: onAdEvent.bind(context),
      onAdvolumechanged: onAdEvent.bind(context),
      onAdmuted: onAdEvent.bind(context),
      onEnterState: onEnterState.bind(context)
    },
    plugins: [new _history2.default()]
  });
};

/**
 * LOADED event handler.
 * @param {Object} options - fsm event data.
 * @param {any} adEvent - ima event data.
 * @returns {void}
 */


exports.default = ImaStateMachine;
function onAdLoaded(options, adEvent) {
  this.logger.debug(adEvent.type.toUpperCase());
  // When we are using the same video element on iOS, native captions still
  // appearing on the video element, so need to hide them before ad start.
  if (this._adsManager.isCustomPlaybackUsed()) {
    this.player.hideTextTrack();
  }
  this.dispatchEvent(options.transition, normalizeAdEvent(adEvent));
}

/**
 * STARTED event handler.
 * @param {Object} options - fsm event data.
 * @param {any} adEvent - ima event data.
 * @returns {void}
 */
function onAdStarted(options, adEvent) {
  this.logger.debug(adEvent.type.toUpperCase());
  this._currentAd = adEvent.getAd();
  this._resizeAd();
  this._showAdsContainer();
  this._maybeDisplayCompanionAds();
  if (!this._currentAd.isLinear()) {
    this._setContentPlayheadTrackerEventsEnabled(true);
    this._setVideoEndedCallbackEnabled(true);
    this._togglePlayPauseOnAdsContainerCallback = this._onAdsContainerClicked.bind(this);
    this._setTogglePlayPauseOnAdsContainerEnabled(true);
    if (this._nextPromise) {
      this._resolveNextPromise();
    } else {
      this.player.play();
    }
  } else {
    this._setContentPlayheadTrackerEventsEnabled(false);
    this._startAdInterval();
  }
  this.dispatchEvent(options.transition);
}

/**
 * CLICKED event handler.
 * @param {Object} options - fsm event data.
 * @param {any} adEvent - ima event data.
 * @returns {void}
 */
function onAdClicked(options, adEvent) {
  this.logger.debug(adEvent.type.toUpperCase());
  if (this._currentAd.isLinear()) {
    if (this._stateMachine.is(_state2.default.PLAYING)) {
      this.pauseAd();
      this._setToggleAdsCover(true);
    }
  } else {
    if (!this.player.paused) {
      this.player.pause();
    }
  }
  this.dispatchEvent(options.transition);
}

/**
 * RESUMED event handler.
 * @param {Object} options - fsm event data.
 * @param {any} adEvent - ima event data.
 * @returns {void}
 */
function onAdResumed(options, adEvent) {
  this.logger.debug(adEvent.type.toUpperCase());
  this._setToggleAdsCover(false);
  this.dispatchEvent(options.transition);
}

/**
 * COMPLETE event handler.
 * @param {Object} options - fsm event data.
 * @param {any} adEvent - ima event data.
 * @returns {void}
 */
function onAdCompleted(options, adEvent) {
  this.logger.debug(adEvent.type.toUpperCase());
  if (this._currentAd.isLinear()) {
    this._stopAdInterval();
  }
  this._currentAd = null;
  this.dispatchEvent(options.transition);
}

/**
 * ALL_ADS_COMPLETED event handler.
 * @param {Object} options - fsm event data.
 * @param {any} adEvent - ima event data.
 * @returns {void}
 */
function onAllAdsCompleted(options, adEvent) {
  this.logger.debug(adEvent.type.toUpperCase());
  onAdBreakEnd.call(this, options, adEvent);
  if (this._adsManager.isCustomPlaybackUsed() && this._contentComplete) {
    this.player.getVideoElement().src = this._contentSrc;
  }
  this.destroy();
}

/**
 * CONTENT_PAUSED_REQUESTED event handler.
 * @param {Object} options - fsm event data.
 * @param {any} adEvent - ima event data.
 * @returns {void}
 */
function onAdBreakStart(options, adEvent) {
  this.logger.debug(adEvent.type.toUpperCase());
  this.player.pause();
  this._setVideoEndedCallbackEnabled(false);
  this._maybeSaveVideoCurrentTime();
  this.dispatchEvent(options.transition);
}

/**
 * CONTENT_RESUMED_REQUESTED event handler.
 * @param {Object} options - fsm event data.
 * @param {any} adEvent - ima event data.
 * @returns {void}
 */
function onAdBreakEnd(options, adEvent) {
  this.logger.debug(adEvent.type.toUpperCase());
  this._setVideoEndedCallbackEnabled(true);
  this._setContentPlayheadTrackerEventsEnabled(true);
  if (!this._contentComplete) {
    this._hideAdsContainer();
    this._maybeSetVideoCurrentTime();
    if (this._nextPromise) {
      this._resolveNextPromise();
    } else {
      this.player.play();
    }
  }
  this.dispatchEvent(options.transition);
}

/**
 * ERROR event handler.
 * @param {Object} options - fsm event data.
 * @param {any} adEvent - ima event data.
 * @returns {void}
 */
function onAdError(options, adEvent) {
  if (adEvent.type === "adError") {
    this.logger.debug(adEvent.type.toUpperCase());
    var adError = adEvent.getError();
    if (this.loadPromise) {
      this.loadPromise.reject(adError);
    }
    if (this._nextPromise) {
      this._nextPromise.reject(adError);
    }
    this.dispatchEvent(options.transition, normalizeAdError(adError, true));
  } else {
    this.logger.debug(adEvent.type.toUpperCase());
    var adData = adEvent.getAdData();
    var _adError = adData.adError;
    if (adData.adError) {
      this.logger.error('Non-fatal error occurred: ' + _adError.getMessage());
      this.dispatchEvent(this.player.Event.AD_ERROR, normalizeAdError(_adError, false));
    }
  }
}

/**
 * SKIPPED event handler.
 * @param {Object} options - fsm event data.
 * @param {any} adEvent - ima event data.
 * @returns {void}
 */
function onAdSkipped(options, adEvent) {
  this.logger.debug(adEvent.type.toUpperCase());
  this._stopAdInterval();
  this.dispatchEvent(options.transition);
}

/**
 * General event handler.
 * @param {Object} options - fsm event data.
 * @param {any} adEvent - ima event data.
 * @returns {void}
 */
function onAdEvent(options, adEvent) {
  this.logger.debug(adEvent.type.toUpperCase());
  this.dispatchEvent(options.transition);
}

/**
 * Enter state handler.
 * @param {Object} options - fsm event data.
 * @returns {void}
 */
function onEnterState(options) {
  if (options.from !== options.to) {
    this.logger.debug("Change state: " + options.from + " => " + options.to);
  }
}

/**
 * Normalize the ima ad error object.
 * @param {any} adError - The ima ad error object.
 * @param {boolean} fatal - Whether the error is fatal.
 * @returns {Object} - The normalized ad error object.
 */
function normalizeAdError(adError, fatal) {
  return {
    fatal: fatal,
    error: {
      code: adError.getErrorCode(),
      message: adError.getMessage()
    }
  };
}

/**
 * Normalize the ima ad event object.
 * @param {any} adEvent - The ima ad error object.
 * @returns {Object} - The normalized ad event object.
 */
function normalizeAdEvent(adEvent) {
  return {
    ad: adEvent.getAd(),
    extraAdData: adEvent.getAdData()
  };
}

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("StateMachine", [], factory);
	else if(typeof exports === 'object')
		exports["StateMachine"] = factory();
	else
		root["StateMachine"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function(target, sources) {
  var n, source, key;
  for(n = 1 ; n < arguments.length ; n++) {
    source = arguments[n];
    for(key in source) {
      if (source.hasOwnProperty(key))
        target[key] = source[key];
    }
  }
  return target;
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


//-------------------------------------------------------------------------------------------------

var mixin = __webpack_require__(0);

//-------------------------------------------------------------------------------------------------

module.exports = {

  build: function(target, config) {
    var n, max, plugin, plugins = config.plugins;
    for(n = 0, max = plugins.length ; n < max ; n++) {
      plugin = plugins[n];
      if (plugin.methods)
        mixin(target, plugin.methods);
      if (plugin.properties)
        Object.defineProperties(target, plugin.properties);
    }
  },

  hook: function(fsm, name, additional) {
    var n, max, method, plugin,
        plugins = fsm.config.plugins,
        args    = [fsm.context];

    if (additional)
      args = args.concat(additional)

    for(n = 0, max = plugins.length ; n < max ; n++) {
      plugin = plugins[n]
      method = plugins[n][name]
      if (method)
        method.apply(plugin, args);
    }
  }

}

//-------------------------------------------------------------------------------------------------


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


//-------------------------------------------------------------------------------------------------

function camelize(label) {

  if (label.length === 0)
    return label;

  var n, result, word, words = label.split(/[_-]/);

  // single word with first character already lowercase, return untouched
  if ((words.length === 1) && (words[0][0].toLowerCase() === words[0][0]))
    return label;

  result = words[0].toLowerCase();
  for(n = 1 ; n < words.length ; n++) {
    result = result + words[n].charAt(0).toUpperCase() + words[n].substring(1).toLowerCase();
  }

  return result;
}

//-------------------------------------------------------------------------------------------------

camelize.prepended = function(prepend, label) {
  label = camelize(label);
  return prepend + label[0].toUpperCase() + label.substring(1);
}

//-------------------------------------------------------------------------------------------------

module.exports = camelize;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


//-------------------------------------------------------------------------------------------------

var mixin    = __webpack_require__(0),
    camelize = __webpack_require__(2);

//-------------------------------------------------------------------------------------------------

function Config(options, StateMachine) {

  options = options || {};

  this.options     = options; // preserving original options can be useful (e.g visualize plugin)
  this.defaults    = StateMachine.defaults;
  this.states      = [];
  this.transitions = [];
  this.map         = {};
  this.lifecycle   = this.configureLifecycle();
  this.init        = this.configureInitTransition(options.init);
  this.data        = this.configureData(options.data);
  this.methods     = this.configureMethods(options.methods);

  this.map[this.defaults.wildcard] = {};

  this.configureTransitions(options.transitions || []);

  this.plugins = this.configurePlugins(options.plugins, StateMachine.plugin);

}

//-------------------------------------------------------------------------------------------------

mixin(Config.prototype, {

  addState: function(name) {
    if (!this.map[name]) {
      this.states.push(name);
      this.addStateLifecycleNames(name);
      this.map[name] = {};
    }
  },

  addStateLifecycleNames: function(name) {
    this.lifecycle.onEnter[name] = camelize.prepended('onEnter', name);
    this.lifecycle.onLeave[name] = camelize.prepended('onLeave', name);
    this.lifecycle.on[name]      = camelize.prepended('on',      name);
  },

  addTransition: function(name) {
    if (this.transitions.indexOf(name) < 0) {
      this.transitions.push(name);
      this.addTransitionLifecycleNames(name);
    }
  },

  addTransitionLifecycleNames: function(name) {
    this.lifecycle.onBefore[name] = camelize.prepended('onBefore', name);
    this.lifecycle.onAfter[name]  = camelize.prepended('onAfter',  name);
    this.lifecycle.on[name]       = camelize.prepended('on',       name);
  },

  mapTransition: function(transition) {
    var name = transition.name,
        from = transition.from,
        to   = transition.to;
    this.addState(from);
    if (typeof to !== 'function')
      this.addState(to);
    this.addTransition(name);
    this.map[from][name] = transition;
    return transition;
  },

  configureLifecycle: function() {
    return {
      onBefore: { transition: 'onBeforeTransition' },
      onAfter:  { transition: 'onAfterTransition'  },
      onEnter:  { state:      'onEnterState'       },
      onLeave:  { state:      'onLeaveState'       },
      on:       { transition: 'onTransition'       }
    };
  },

  configureInitTransition: function(init) {
    if (typeof init === 'string') {
      return this.mapTransition(mixin({}, this.defaults.init, { to: init, active: true }));
    }
    else if (typeof init === 'object') {
      return this.mapTransition(mixin({}, this.defaults.init, init, { active: true }));
    }
    else {
      this.addState(this.defaults.init.from);
      return this.defaults.init;
    }
  },

  configureData: function(data) {
    if (typeof data === 'function')
      return data;
    else if (typeof data === 'object')
      return function() { return data; }
    else
      return function() { return {};  }
  },

  configureMethods: function(methods) {
    return methods || {};
  },

  configurePlugins: function(plugins, builtin) {
    plugins = plugins || [];
    var n, max, plugin;
    for(n = 0, max = plugins.length ; n < max ; n++) {
      plugin = plugins[n];
      if (typeof plugin === 'function')
        plugins[n] = plugin = plugin()
      if (plugin.configure)
        plugin.configure(this);
    }
    return plugins
  },

  configureTransitions: function(transitions) {
    var i, n, transition, from, to, wildcard = this.defaults.wildcard;
    for(n = 0 ; n < transitions.length ; n++) {
      transition = transitions[n];
      from  = Array.isArray(transition.from) ? transition.from : [transition.from || wildcard]
      to    = transition.to || wildcard;
      for(i = 0 ; i < from.length ; i++) {
        this.mapTransition({ name: transition.name, from: from[i], to: to });
      }
    }
  },

  transitionFor: function(state, transition) {
    var wildcard = this.defaults.wildcard;
    return this.map[state][transition] ||
           this.map[wildcard][transition];
  },

  transitionsFor: function(state) {
    var wildcard = this.defaults.wildcard;
    return Object.keys(this.map[state]).concat(Object.keys(this.map[wildcard]));
  },

  allStates: function() {
    return this.states;
  },

  allTransitions: function() {
    return this.transitions;
  }

});

//-------------------------------------------------------------------------------------------------

module.exports = Config;

//-------------------------------------------------------------------------------------------------


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {


var mixin      = __webpack_require__(0),
    Exception  = __webpack_require__(6),
    plugin     = __webpack_require__(1),
    UNOBSERVED = [ null, [] ];

//-------------------------------------------------------------------------------------------------

function JSM(context, config) {
  this.context   = context;
  this.config    = config;
  this.state     = config.init.from;
  this.observers = [context];
}

//-------------------------------------------------------------------------------------------------

mixin(JSM.prototype, {

  init: function(args) {
    mixin(this.context, this.config.data.apply(this.context, args));
    plugin.hook(this, 'init');
    if (this.config.init.active)
      return this.fire(this.config.init.name, []);
  },

  is: function(state) {
    return Array.isArray(state) ? (state.indexOf(this.state) >= 0) : (this.state === state);
  },

  isPending: function() {
    return this.pending;
  },

  can: function(transition) {
    return !this.isPending() && !!this.seek(transition);
  },

  cannot: function(transition) {
    return !this.can(transition);
  },

  allStates: function() {
    return this.config.allStates();
  },

  allTransitions: function() {
    return this.config.allTransitions();
  },

  transitions: function() {
    return this.config.transitionsFor(this.state);
  },

  seek: function(transition, args) {
    var wildcard = this.config.defaults.wildcard,
        entry    = this.config.transitionFor(this.state, transition),
        to       = entry && entry.to;
    if (typeof to === 'function')
      return to.apply(this.context, args);
    else if (to === wildcard)
      return this.state
    else
      return to
  },

  fire: function(transition, args) {
    return this.transit(transition, this.state, this.seek(transition, args), args);
  },

  transit: function(transition, from, to, args) {

    var lifecycle = this.config.lifecycle,
        changed   = this.config.options.observeUnchangedState || (from !== to);

    if (!to)
      return this.context.onInvalidTransition(transition, from, to);

    if (this.isPending())
      return this.context.onPendingTransition(transition, from, to);

    this.config.addState(to);  // might need to add this state if it's unknown (e.g. conditional transition or goto)

    this.beginTransit();

    args.unshift({             // this context will be passed to each lifecycle event observer
      transition: transition,
      from:       from,
      to:         to,
      fsm:        this.context
    });

    return this.observeEvents([
                this.observersForEvent(lifecycle.onBefore.transition),
                this.observersForEvent(lifecycle.onBefore[transition]),
      changed ? this.observersForEvent(lifecycle.onLeave.state) : UNOBSERVED,
      changed ? this.observersForEvent(lifecycle.onLeave[from]) : UNOBSERVED,
                this.observersForEvent(lifecycle.on.transition),
      changed ? [ 'doTransit', [ this ] ]                       : UNOBSERVED,
      changed ? this.observersForEvent(lifecycle.onEnter.state) : UNOBSERVED,
      changed ? this.observersForEvent(lifecycle.onEnter[to])   : UNOBSERVED,
      changed ? this.observersForEvent(lifecycle.on[to])        : UNOBSERVED,
                this.observersForEvent(lifecycle.onAfter.transition),
                this.observersForEvent(lifecycle.onAfter[transition]),
                this.observersForEvent(lifecycle.on[transition])
    ], args);
  },

  beginTransit: function()          { this.pending = true;                 },
  endTransit:   function(result)    { this.pending = false; return result; },
  failTransit:  function(result)    { this.pending = false; throw result;  },
  doTransit:    function(lifecycle) { this.state = lifecycle.to;           },

  observe: function(args) {
    if (args.length === 2) {
      var observer = {};
      observer[args[0]] = args[1];
      this.observers.push(observer);
    }
    else {
      this.observers.push(args[0]);
    }
  },

  observersForEvent: function(event) { // TODO: this could be cached
    var n = 0, max = this.observers.length, observer, result = [];
    for( ; n < max ; n++) {
      observer = this.observers[n];
      if (observer[event])
        result.push(observer);
    }
    return [ event, result, true ]
  },

  observeEvents: function(events, args, previousEvent, previousResult) {
    if (events.length === 0) {
      return this.endTransit(previousResult === undefined ? true : previousResult);
    }

    var event     = events[0][0],
        observers = events[0][1],
        pluggable = events[0][2];

    args[0].event = event;
    if (event && pluggable && event !== previousEvent)
      plugin.hook(this, 'lifecycle', args);

    if (observers.length === 0) {
      events.shift();
      return this.observeEvents(events, args, event, previousResult);
    }
    else {
      var observer = observers.shift(),
          result = observer[event].apply(observer, args);
      if (result && typeof result.then === 'function') {
        return result.then(this.observeEvents.bind(this, events, args, event))
                     .catch(this.failTransit.bind(this))
      }
      else if (result === false) {
        return this.endTransit(false);
      }
      else {
        return this.observeEvents(events, args, event, result);
      }
    }
  },

  onInvalidTransition: function(transition, from, to) {
    throw new Exception("transition is invalid in current state", transition, from, to, this.state);
  },

  onPendingTransition: function(transition, from, to) {
    throw new Exception("transition is invalid while previous transition is still in progress", transition, from, to, this.state);
  }

});

//-------------------------------------------------------------------------------------------------

module.exports = JSM;

//-------------------------------------------------------------------------------------------------


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


//-----------------------------------------------------------------------------------------------

var mixin    = __webpack_require__(0),
    camelize = __webpack_require__(2),
    plugin   = __webpack_require__(1),
    Config   = __webpack_require__(3),
    JSM      = __webpack_require__(4);

//-----------------------------------------------------------------------------------------------

var PublicMethods = {
  is:                  function(state)       { return this._fsm.is(state)                                     },
  can:                 function(transition)  { return this._fsm.can(transition)                               },
  cannot:              function(transition)  { return this._fsm.cannot(transition)                            },
  observe:             function()            { return this._fsm.observe(arguments)                            },
  transitions:         function()            { return this._fsm.transitions()                                 },
  allTransitions:      function()            { return this._fsm.allTransitions()                              },
  allStates:           function()            { return this._fsm.allStates()                                   },
  onInvalidTransition: function(t, from, to) { return this._fsm.onInvalidTransition(t, from, to)              },
  onPendingTransition: function(t, from, to) { return this._fsm.onPendingTransition(t, from, to)              },
}

var PublicProperties = {
  state: {
    configurable: false,
    enumerable:   true,
    get: function() {
      return this._fsm.state;
    },
    set: function(state) {
      throw Error('use transitions to change state')
    }
  }
}

//-----------------------------------------------------------------------------------------------

function StateMachine(options) {
  return apply(this || {}, options);
}

function factory() {
  var cstor, options;
  if (typeof arguments[0] === 'function') {
    cstor   = arguments[0];
    options = arguments[1] || {};
  }
  else {
    cstor   = function() { this._fsm.apply(this, arguments) };
    options = arguments[0] || {};
  }
  var config = new Config(options, StateMachine);
  build(cstor.prototype, config);
  cstor.prototype._fsm.config = config; // convenience access to shared config without needing an instance
  return cstor;
}

//-------------------------------------------------------------------------------------------------

function apply(instance, options) {
  var config = new Config(options, StateMachine);
  build(instance, config);
  instance._fsm();
  return instance;
}

function build(target, config) {
  if ((typeof target !== 'object') || Array.isArray(target))
    throw Error('StateMachine can only be applied to objects');
  plugin.build(target, config);
  Object.defineProperties(target, PublicProperties);
  mixin(target, PublicMethods);
  mixin(target, config.methods);
  config.allTransitions().forEach(function(transition) {
    target[camelize(transition)] = function() {
      return this._fsm.fire(transition, [].slice.call(arguments))
    }
  });
  target._fsm = function() {
    this._fsm = new JSM(this, config);
    this._fsm.init(arguments);
  }
}

//-----------------------------------------------------------------------------------------------

StateMachine.version  = '3.0.1';
StateMachine.factory  = factory;
StateMachine.apply    = apply;
StateMachine.defaults = {
  wildcard: '*',
  init: {
    name: 'init',
    from: 'none'
  }
}

//===============================================================================================

module.exports = StateMachine;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function(message, transition, from, to, current) {
  this.message    = message;
  this.transition = transition;
  this.from       = from;
  this.to         = to;
  this.current    = current;
}


/***/ })
/******/ ]);
});

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("StateMachineHistory", [], factory);
	else if(typeof exports === 'object')
		exports["StateMachineHistory"] = factory();
	else
		root["StateMachineHistory"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


//-------------------------------------------------------------------------------------------------

function camelize(label) {

  if (label.length === 0)
    return label;

  var n, result, word, words = label.split(/[_-]/);

  // single word with first character already lowercase, return untouched
  if ((words.length === 1) && (words[0][0].toLowerCase() === words[0][0]))
    return label;

  result = words[0].toLowerCase();
  for(n = 1 ; n < words.length ; n++) {
    result = result + words[n].charAt(0).toUpperCase() + words[n].substring(1).toLowerCase();
  }

  return result;
}

//-------------------------------------------------------------------------------------------------

camelize.prepended = function(prepend, label) {
  label = camelize(label);
  return prepend + label[0].toUpperCase() + label.substring(1);
}

//-------------------------------------------------------------------------------------------------

module.exports = camelize;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


//-------------------------------------------------------------------------------------------------

var camelize = __webpack_require__(0);

//-------------------------------------------------------------------------------------------------

module.exports = function(options) { options = options || {};

  var past       = camelize(options.name || options.past   || 'history'),
      future     = camelize(                options.future || 'future'),
      clear      = camelize.prepended('clear', past),
      back       = camelize.prepended(past,   'back'),
      forward    = camelize.prepended(past,   'forward'),
      canBack    = camelize.prepended('can',   back),
      canForward = camelize.prepended('can',   forward),
      max        = options.max;

  var plugin = {

    configure: function(config) {
      config.addTransitionLifecycleNames(back);
      config.addTransitionLifecycleNames(forward);
    },

    init: function(instance) {
      instance[past]   = [];
      instance[future] = [];
    },

    lifecycle: function(instance, lifecycle) {
      if (lifecycle.event === 'onEnterState') {
        instance[past].push(lifecycle.to);
        if (max && instance[past].length > max)
          instance[past].shift();
        if (lifecycle.transition !== back && lifecycle.transition !== forward)
          instance[future].length = 0;
      }
    },

    methods:    {},
    properties: {}

  }

  plugin.methods[clear] = function() {
    this[past].length = 0
    this[future].length = 0
  }

  plugin.properties[canBack] = {
    get: function() {
      return this[past].length > 1
    }
  }

  plugin.properties[canForward] = {
    get: function() {
      return this[future].length > 0
    }
  }

  plugin.methods[back] = function() {
    if (!this[canBack])
      throw Error('no history');
    var from = this[past].pop(),
        to   = this[past].pop();
    this[future].push(from);
    this._fsm.transit(back, from, to, []);
  }

  plugin.methods[forward] = function() {
    if (!this[canForward])
      throw Error('no history');
    var from = this.state,
        to = this[future].pop();
    this._fsm.transit(forward, from, to, []);
  }

  return plugin;

}


/***/ })
/******/ ]);
});

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(9);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(11)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!./style.css", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!./style.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(10)(undefined);
// imports


// module
exports.push([module.i, ".playkit-ads-cover {\n  position: fixed;\n  cursor: pointer;\n  width: 100%;\n  height: 100%;\n  background-color: rgba(0, 0, 0, 0);\n}\n\n.playkit-ads-container {\n  position: absolute;\n  top: 0;\n}\n", ""]);

// exports


/***/ }),
/* 10 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			memo[selector] = fn.call(this, selector);
		}

		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(12);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton) options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 12 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ })
/******/ ]);
});
//# sourceMappingURL=playkit-ima.js.map