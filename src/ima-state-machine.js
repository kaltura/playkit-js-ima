// @flow
import StateMachine from 'javascript-state-machine';
import StateMachineHistory from 'javascript-state-machine/lib/history';
import {State} from './state';
import {Ad, AdBreak, AdBreakType, Utils} from 'playkit-js';

/**
 * Finite state machine for ima plugin.
 * @classdesc
 */
class ImaStateMachine {
  /**
   * @constructor
   * @param {any} context - The plugin context.
   */
  constructor(context: any) {
    return new StateMachine({
      init: State.LOADING,
      transitions: [
        {
          name: 'loaded',
          from: [State.LOADING, State.LOADED, State.IDLE, State.PAUSED, State.PLAYING, State.DONE],
          to: State.LOADED
        },
        {
          name: context.player.Event.AD_STARTED,
          from: [State.LOADED, State.IDLE, State.PAUSED, State.PLAYING],
          to: (adEvent: any): string => {
            let ad = adEvent.getAd();
            if (!ad.isLinear()) {
              return State.IDLE;
            }
            return State.PLAYING;
          }
        },
        {
          name: context.player.Event.AD_RESUMED,
          from: State.PAUSED,
          to: State.PLAYING
        },
        {
          name: context.player.Event.AD_PAUSED,
          from: State.PLAYING,
          to: State.PAUSED
        },
        {
          name: context.player.Event.AD_SKIPPED,
          from: [State.PLAYING, State.PAUSED],
          to: State.IDLE
        },
        {
          name: context.player.Event.AD_COMPLETED,
          from: State.PLAYING
        },
        {
          name: context.player.Event.ALL_ADS_COMPLETED,
          from: State.IDLE,
          to: State.DONE
        },
        {
          name: context.player.Event.AD_BREAK_END,
          from: [State.IDLE, State.PLAYING, State.LOADED],
          to: State.IDLE
        },
        {
          name: context.player.Event.AD_ERROR,
          from: [State.IDLE, State.LOADED, State.PLAYING, State.PAUSED, State.LOADING],
          to: State.IDLE
        },
        {
          name: context.player.Event.AD_LOADED,
          from: [State.IDLE, State.LOADED, State.PLAYING]
        },
        {
          name: context.player.Event.AD_FIRST_QUARTILE,
          from: State.PLAYING
        },
        {
          name: context.player.Event.AD_BREAK_START,
          from: [State.IDLE, State.LOADED]
        },
        {
          name: context.player.Event.AD_MIDPOINT,
          from: State.PLAYING
        },
        {
          name: context.player.Event.AD_THIRD_QUARTILE,
          from: State.PLAYING
        },
        {
          name: context.player.Event.USER_CLOSED_AD,
          from: [State.IDLE, State.PLAYING, State.PAUSED]
        },
        {
          name: context.player.Event.AD_VOLUME_CHANGED,
          from: [State.PLAYING, State.PAUSED, State.LOADED]
        },
        {
          name: context.player.Event.AD_MUTED,
          from: [State.PLAYING, State.PAUSED, State.LOADED]
        },
        {
          name: context.player.Event.AD_CLICKED,
          from: [State.PLAYING, State.PAUSED, State.IDLE]
        },
        {
          name: context.player.Event.AD_CAN_SKIP,
          from: [State.PLAYING, State.PAUSED]
        },
        {
          name: 'goto',
          from: '*',
          to: s => s
        }
      ],
      methods: {
        onAdloaded: onAdLoaded.bind(context),
        onAdstarted: onAdStarted.bind(context),
        onAdpaused: onAdEvent.bind(context),
        onAdresumed: onAdResumed.bind(context),
        onAdclicked: onAdClicked.bind(context),
        onAdskipped: onAdSkipped.bind(context),
        onAdcompleted: onAdCompleted.bind(context),
        onAlladscompleted: onAllAdsCompleted.bind(context),
        onAdcanskip: onAdCanSkip.bind(context),
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
      plugins: [new StateMachineHistory()]
    });
  }
}

/**
 * LOADED event handler.
 * @param {Object} options - fsm event data.
 * @param {any} adEvent - ima event data.
 * @returns {void}
 */
function onAdLoaded(options: Object, adEvent: any): void {
  this.logger.debug(adEvent.type.toUpperCase());
  Utils.Dom.setAttribute(this._adsContainerDiv, 'data-adtype', getAdBreakType(adEvent));
  // When we are using the same video element on iOS, native captions still
  // appearing on the video element, so need to hide them before ad start.
  if (this._adsManager.isCustomPlaybackUsed()) {
    this.player.hideTextTrack();
  }
  const adOptions = getAdOptions(adEvent);
  const ad = new Ad(adOptions);
  this.dispatchEvent(options.transition, {ad: ad});
}

/**
 * STARTED event handler.
 * @param {Object} options - fsm event data.
 * @param {any} adEvent - ima event data.
 * @returns {void}
 */
function onAdStarted(options: Object, adEvent: any): void {
  this.logger.debug(adEvent.type.toUpperCase());
  this._currentAd = adEvent.getAd();
  this._resizeAd();
  this._showAdsContainer();
  this._maybeDisplayCompanionAds();
  if (!this._currentAd.isLinear()) {
    this._setContentPlayheadTrackerEventsEnabled(true);
    this._setVideoEndedCallbackEnabled(true);
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
function onAdClicked(options: Object, adEvent: any): void {
  this.logger.debug(adEvent.type.toUpperCase());
  if (this._currentAd.isLinear()) {
    this._maybeIgnoreClickOnAd();
    if (this._stateMachine.is(State.PLAYING)) {
      this._adsManager.pause();
    }
    this._setToggleAdsCover(true);
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
function onAdResumed(options: Object, adEvent: any): void {
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
function onAdCompleted(options: Object, adEvent: any): void {
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
function onAllAdsCompleted(options: Object, adEvent: any): void {
  this.logger.debug(adEvent.type.toUpperCase());
  if (this._adsManager.isCustomPlaybackUsed() && this._contentComplete) {
    this.player.getVideoElement().src = this._contentSrc;
  }
  onAdBreakEnd.call(this, options, adEvent);
}

/**
 * CONTENT_PAUSED_REQUESTED event handler.
 * @param {Object} options - fsm event data.
 * @param {any} adEvent - ima event data.
 * @returns {void}
 */
function onAdBreakStart(options: Object, adEvent: any): void {
  this.logger.debug(adEvent.type.toUpperCase());
  this.player.pause();
  const adBreakOptions = getAdBreakOptions(adEvent);
  const adBreak = new AdBreak(adBreakOptions);
  this._setVideoEndedCallbackEnabled(false);
  this._maybeForceExitFullScreen();
  this._maybeSaveVideoCurrentTime();
  this.dispatchEvent(options.transition, {adBreak: adBreak});
}

/**
 * CONTENT_RESUMED_REQUESTED event handler.
 * @param {Object} options - fsm event data.
 * @param {any} adEvent - ima event data.
 * @returns {void}
 */
function onAdBreakEnd(options: Object, adEvent: any): void {
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
function onAdError(options: Object, adEvent: any): void {
  if (adEvent.type === 'adError') {
    this.logger.debug(adEvent.type.toUpperCase());
    let adError = adEvent.getError();
    if (this.loadPromise) {
      this.loadPromise.reject(adError);
    }
    if (this._nextPromise) {
      this._nextPromise.reject(adError);
    }
    this.dispatchEvent(options.transition, normalizeAdError(adError, true));
  } else {
    this.logger.debug(adEvent.type.toUpperCase());
    let adData = adEvent.getAdData();
    let adError = adData.adError;
    if (adData.adError) {
      this.logger.error('Non-fatal error occurred: ' + adError.getMessage());
      this.dispatchEvent(this.player.Event.AD_ERROR, normalizeAdError(adError, false));
    }
  }
}

/**
 * SKIPPED event handler.
 * @param {Object} options - fsm event data.
 * @param {any} adEvent - ima event data.
 * @returns {void}
 */
function onAdSkipped(options: Object, adEvent: any): void {
  this.logger.debug(adEvent.type.toUpperCase());
  this._stopAdInterval();
  this.dispatchEvent(options.transition);
}

/**
 * SKIPPABLE_STATE_CHANGED event handler.
 * @param {Object} options - fsm event data.
 * @param {any} adEvent - ima event data.
 * @returns {void}
 */
function onAdCanSkip(options: Object, adEvent: any): void {
  this.logger.debug(adEvent.type.toUpperCase());
  if (this._adsManager.getAdSkippableState()) {
    this.dispatchEvent(options.transition);
  }
}

/**
 * General event handler.
 * @param {Object} options - fsm event data.
 * @param {any} adEvent - ima event data.
 * @returns {void}
 */
function onAdEvent(options: Object, adEvent: any): void {
  this.logger.debug(adEvent.type.toUpperCase());
  this.dispatchEvent(options.transition);
}

/**
 * Enter state handler.
 * @param {Object} options - fsm event data.
 * @returns {void}
 */
function onEnterState(options: Object): void {
  if (options.from !== options.to) {
    this.logger.debug('Change state: ' + options.from + ' => ' + options.to);
  }
}

/**
 * Normalize the ima ad error object.
 * @param {any} adError - The ima ad error object.
 * @param {boolean} fatal - Whether the error is fatal.
 * @returns {Object} - The normalized ad error object.
 */
function normalizeAdError(adError: any, fatal: boolean): Object {
  return {
    fatal: fatal,
    error: {
      code: adError.getErrorCode(),
      message: adError.getMessage()
    }
  };
}

/**
 * Gets the ad options.
 * @param {any} adEvent - The ima ad event object.
 * @returns {string} - The ad options.
 */
function getAdOptions(adEvent: any): Object {
  const adOptions = {};
  const ad = adEvent.getAd();
  const adData = adEvent.getAdData();
  const podInfo = ad.getAdPodInfo();
  adOptions.url = ad.getMediaUrl();
  adOptions.clickThroughUrl = adData.clickThroughUrl;
  adOptions.contentType = ad.getContentType();
  adOptions.duration = ad.getDuration();
  adOptions.position = podInfo.getAdPosition();
  adOptions.title = ad.getTitle();
  adOptions.linear = ad.isLinear();
  adOptions.skipOffset = ad.getSkipTimeOffset();
  return adOptions;
}

/**
 * Gets the ad break options.
 * @param {any} adEvent - The ima ad event object.
 * @returns {string} - The ad break options.
 */
function getAdBreakOptions(adEvent: any): Object {
  const adBreakOptions = {};
  adBreakOptions.numAds = adEvent
    .getAds()
    .getAdPodInfo()
    .getTotalAds();
  adBreakOptions.position = this.player.currentTime === this.player.duration ? -1 : this.player.currentTime;
  adBreakOptions.type = getAdBreakType(adEvent);
  return adBreakOptions;
}

/**
 * Gets the ad break type.
 * @param {any} adEvent - The ima ad event object.
 * @returns {string} - The ad break type.
 */
function getAdBreakType(adEvent: any): string {
  const ad = adEvent.getAd();
  const podInfo = ad.getAdPodInfo();
  const podIndex = podInfo.getPodIndex();
  if (!ad.isLinear()) {
    return AdBreakType.OVERLAY;
  }
  switch (podIndex) {
    case 0:
      return AdBreakType.PRE;
    case -1:
      return AdBreakType.POST;
    default:
      return AdBreakType.MID;
  }
}

export {ImaStateMachine};
