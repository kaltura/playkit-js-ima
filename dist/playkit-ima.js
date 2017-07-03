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
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
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

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _playkitJs = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
// import {PlayerMiddlewareBase} from '../node_modules/playkit-js/src/playkit.js'


var context = void 0;

var ImaMiddleware = function (_PlayerMiddlewareBase) {
  _inherits(ImaMiddleware, _PlayerMiddlewareBase);

  function ImaMiddleware(pluginContext) {
    _classCallCheck(this, ImaMiddleware);

    var _this = _possibleConstructorReturn(this, (ImaMiddleware.__proto__ || Object.getPrototypeOf(ImaMiddleware)).call(this));

    context = pluginContext;
    return _this;
  }

  _createClass(ImaMiddleware, [{
    key: 'play',
    value: function play(next) {
      var _this2 = this;

      context.prepareIma.then(function () {
        // if (!context.initComplete) {
        //   context.initialUserAction();
        // } else {
        if (context.adsActive()) {
          context.resumeAd();
        } else {
          _get(ImaMiddleware.prototype.__proto__ || Object.getPrototypeOf(ImaMiddleware.prototype), 'play', _this2).call(_this2, next);
        }
        // }
      });
    }
  }, {
    key: 'pause',
    value: function pause(next) {
      if (context.adsActive()) {
        context.pauseAd();
      } else {
        _get(ImaMiddleware.prototype.__proto__ || Object.getPrototypeOf(ImaMiddleware.prototype), 'pause', this).call(this, next);
      }
    }
  }]);

  return ImaMiddleware;
}(_playkitJs.PlayerMiddlewareBase);

exports.default = ImaMiddleware;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _playkitJs = __webpack_require__(0);

var _imaMiddleware = __webpack_require__(1);

var _imaMiddleware2 = _interopRequireDefault(_imaMiddleware);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
// import {registerPlugin, BasePlugin} from '../node_modules/playkit-js/src/playkit.js'

// import {PlayerMiddlewareBase} from '../node_modules/playkit-js/src/playkit.js'


var pluginName = "ima";

var Ima = function (_BasePlugin) {
  _inherits(Ima, _BasePlugin);

  _createClass(Ima, null, [{
    key: 'isValid',
    value: function isValid() {
      return true;
    }
  }]);

  function Ima(name, player, config) {
    _classCallCheck(this, Ima);

    var _this = _possibleConstructorReturn(this, (Ima.__proto__ || Object.getPrototypeOf(Ima)).call(this, name, player, config));

    _this._adsManager = null;
    _this.initComplete = false;
    _this._adsActive = false;
    _this._contentComplete = false;
    _this._contentPlayheadTracker = {
      currentTime: 0,
      previousTime: 0,
      seeking: false,
      duration: 0
    };
    _this._addBindings();
    _this._init();
    return _this;
  }

  _createClass(Ima, [{
    key: 'getPlayerMiddleware',
    value: function getPlayerMiddleware() {
      return new _imaMiddleware2.default(this);
    }
  }, {
    key: 'initialUserAction',
    value: function initialUserAction() {
      this._adDisplayContainer.initialize();
      if (this._adsManager) {
        this._adsManager.start();
      }
      this.initComplete = true;
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.logger.debug("destroy");
      this._resetIma();
      this.eventManager.destroy();
    }
  }, {
    key: 'resumeAd',
    value: function resumeAd() {
      this._adsManager.resume();
    }
  }, {
    key: 'pauseAd',
    value: function pauseAd() {
      this._adsManager.pause();
    }
  }, {
    key: 'adsActive',
    value: function adsActive() {
      return this._adsActive;
    }
  }, {
    key: '_addBindings',
    value: function _addBindings() {
      this.eventManager.listen(this.player, this.player.Event.LOADED_METADATA, this._onLoadedMetadata.bind(this));
      this.eventManager.listen(this.player, this.player.Event.TIME_UPDATE, this._onMediaTimeUpdate.bind(this));
      this.eventManager.listen(this.player, this.player.Event.SEEKING, this._onMediaSeeking.bind(this));
      this.eventManager.listen(this.player, this.player.Event.SEEKED, this._onMediaSeeked.bind(this));
      this.eventManager.listen(this.player, this.player.Event.ENDED, this._onMediaEnded.bind(this));
    }
  }, {
    key: '_init',
    value: function _init() {
      var _this2 = this;

      this.prepareIma = new Promise(function (resolve, reject) {
        var loadPromise = window.google && window.google.ima ? Promise.resolve() : _this2._loadIma();
        loadPromise.then(function () {
          _this2._sdk = window.google.ima;
          if (_this2._initAdsContainer()) {
            _this2._initAdsLoader();
            _this2._requestAds();
            resolve();
          } else {
            reject();
          }
        });
      });
    }
  }, {
    key: '_initAdsContainer',
    value: function _initAdsContainer() {
      this.logger.debug("Init ads container");
      var adsContainerDiv = document.getElementById("adContainer");
      var videoElement = this.player.getVideoElement();
      if (videoElement) {
        if (!adsContainerDiv) {
          if (videoElement.parentNode) {
            this._adsContainerDiv = videoElement.parentNode.appendChild(document.createElement('div'));
            this._adsContainerDiv.id = "adContainer";
            this._adsContainerDiv.style.position = "absolute";
            this._adsContainerDiv.style.zIndex = "2000";
            this._adsContainerDiv.style.top = "0";
          } else {
            return false;
          }
        } else {
          this._adsContainerDiv = adsContainerDiv;
        }
        this._adDisplayContainer = new this._sdk.AdDisplayContainer(this._adsContainerDiv, videoElement);
        this._adDisplayContainer.initialize();
        return true;
      }
      return false;
    }
  }, {
    key: '_initAdsLoader',
    value: function _initAdsLoader() {
      this.logger.debug("Init ads loader");
      this._adsLoader = new this._sdk.AdsLoader(this._adDisplayContainer);
      this._adsLoader.addEventListener(this._sdk.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, this._onAdsManagerLoaded.bind(this));
      this._adsLoader.addEventListener(this._sdk.AdErrorEvent.Type.AD_ERROR, this._onAdError.bind(this));
    }
  }, {
    key: '_requestAds',
    value: function _requestAds() {
      this.logger.debug("Request ads");
      this._resetIma();
      var adsRequest = new this._sdk.AdsRequest();
      if (this.config.adTagUrl) {
        adsRequest.adTagUrl = this.config.adTagUrl;
      } else {
        adsRequest.adsResponse = this.config.adsResponse;
      }
      if (!adsRequest.adTagUrl && !adsRequest.adsResponse) {
        this.logger.error("missing config for ima plugin");
        return false;
      }
      //TODO: Handle non-linear
      this._adsLoader.requestAds(adsRequest);
      return true;
    }
  }, {
    key: '_onLoadedMetadata',
    value: function _onLoadedMetadata() {
      this._contentPlayheadTracker.duration = this.player.duration;
    }
  }, {
    key: '_onMediaTimeUpdate',
    value: function _onMediaTimeUpdate() {
      if (!this._contentPlayheadTracker.seeking) {
        this._contentPlayheadTracker.previousTime = this._contentPlayheadTracker.currentTime;
        this._contentPlayheadTracker.currentTime = this.player.currentTime;
      }
    }
  }, {
    key: '_onMediaSeeking',
    value: function _onMediaSeeking() {
      this._contentPlayheadTracker.seeking = true;
    }
  }, {
    key: '_onMediaSeeked',
    value: function _onMediaSeeked() {
      this._contentPlayheadTracker.seeking = false;
    }
  }, {
    key: '_onMediaEnded',
    value: function _onMediaEnded() {
      if (this._adsLoader && !this._contentComplete) {
        this._adsLoader.contentComplete();
        this._contentComplete = true;
      }
    }
  }, {
    key: '_showAdsContainer',
    value: function _showAdsContainer() {
      this._adsContainerDiv.style.display = "";
    }
  }, {
    key: '_hideAdsContainer',
    value: function _hideAdsContainer() {
      this._adsContainerDiv.style.display = "none";
    }
  }, {
    key: '_onAdsManagerLoaded',
    value: function _onAdsManagerLoaded(adsManagerLoadedEvent) {
      this.logger.debug('Ads manager loaded');
      var adsRenderingSettings = new this._sdk.AdsRenderingSettings();
      adsRenderingSettings.restoreCustomPlaybackStateOnAdBreakComplete = true;
      this._adsManager = adsManagerLoadedEvent.getAdsManager(this._contentPlayheadTracker, adsRenderingSettings);
      this._processAdsManager();
    }
  }, {
    key: '_processAdsManager',
    value: function _processAdsManager() {
      // Attach the pause/resume events
      this._adsManager.addEventListener(this._sdk.AdEvent.Type.CONTENT_PAUSE_REQUESTED, this._onContentPauseRequested.bind(this));
      this._adsManager.addEventListener(this._sdk.AdEvent.Type.CONTENT_RESUME_REQUESTED, this._onContentResumeRequested.bind(this));
      // Handle errors
      this._adsManager.addEventListener(this._sdk.AdErrorEvent.Type.AD_ERROR, this._onAdError.bind(this));
      var events = [this._sdk.AdEvent.Type.ALL_ADS_COMPLETED, this._sdk.AdEvent.Type.CLICK, this._sdk.AdEvent.Type.COMPLETE, this._sdk.AdEvent.Type.FIRST_QUARTILE, this._sdk.AdEvent.Type.LOADED, this._sdk.AdEvent.Type.MIDPOINT, this._sdk.AdEvent.Type.PAUSED, this._sdk.AdEvent.Type.STARTED, this._sdk.AdEvent.Type.THIRD_QUARTILE];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = events[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var index = _step.value;

          this._adsManager.addEventListener(index, this._onAdEvent.bind(this));
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      var playerElement = this.player.getVideoElement();
      if (playerElement) {
        var initWidth = parseInt(getComputedStyle(playerElement).width, 10);
        var initHeight = parseInt(getComputedStyle(playerElement).height, 10);
        // TODO: Handle full screen
        this._adsManager.init(initWidth, initHeight, this._sdk.ViewMode.NORMAL);
        this._adsManager.start();
      }
    }
  }, {
    key: '_onContentPauseRequested',
    value: function _onContentPauseRequested(adEvent) {
      this.logger.debug("onAdEvent: " + adEvent.type.toUpperCase());
      this._showAdsContainer();
      this.player.pause();
      this._adsActive = true;
    }
  }, {
    key: '_onContentResumeRequested',
    value: function _onContentResumeRequested(adEvent) {
      this.logger.debug("onAdEvent: " + adEvent.type.toUpperCase());
      if (!this._contentComplete) {
        this._hideAdsContainer();
        this.player.play();
        this._adsActive = false;
      }
    }
  }, {
    key: '_onAdError',
    value: function _onAdError(params) {
      this.logger.error(params);
    }
  }, {
    key: '_onAdEvent',
    value: function _onAdEvent(adEvent) {
      this.logger.debug("onAdEvent: " + adEvent.type.toUpperCase());
      switch (adEvent.type) {
        case this._sdk.AdEvent.Type.ALL_ADS_COMPLETED:
          this._onAllAdsCompleted(adEvent);
          break;
        case this._sdk.AdEvent.Type.CLICK:
          this._onAdClick(adEvent);
          break;
        default:
          break;
      }
    }
  }, {
    key: '_onAllAdsCompleted',
    value: function _onAllAdsComplete(adEvent) {
      this.logger.debug("onAllAdsComplete", adEvent);
      this._hideAdsContainer();
      this._allAdsCompleted = true;
    }
  }, {
    key: '_onAdClick',
    value: function _onAdClicked(adEvent) {
      this._adsManager.pause();
    }
  }, {
    key: '_resetIma',
    value: function _resetIma() {
      this._adsActive = false;
      this._hideAdsContainer();
      if (this._adsManager) {
        this._adsManager.destroy();
        this._adsManager = null;
      }
      if (this._adsLoader && !this._contentComplete) {
        this._adsLoader.contentComplete();
      }
      this._contentComplete = false;
      this._allAdsCompleted = false;
    }
  }, {
    key: '_loadIma',
    value: function _loadIma() {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        var r = false,
            t = document.getElementsByTagName("script")[0],
            s = document.createElement("script");
        s.type = "text/javascript";
        s.src = _this3.config.debug ? Ima.IMA_SDK_DEBUG_LIB_URL : Ima.IMA_SDK_LIB_URL;
        s.async = true;
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
  }]);

  return Ima;
}(_playkitJs.BasePlugin);

Ima.defaultConfig = {
  debug: false,
  timeout: 5000,
  prerollTimeout: 100,
  adLabel: 'Advertisement',
  showControlsForJSAds: true
};
Ima.IMA_SDK_LIB_URL = "//imasdk.googleapis.com/js/sdkloader/ima3.js";
Ima.IMA_SDK_DEBUG_LIB_URL = "//imasdk.googleapis.com/js/sdkloader/ima3_debug.js";


(0, _playkitJs.registerPlugin)(pluginName, Ima);

/***/ })
/******/ ]);
});
//# sourceMappingURL=playkit-ima.js.map
