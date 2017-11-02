// @flow
import StateMachine from 'javascript-state-machine'
import StateMachineHistory from 'javascript-state-machine/lib/history'
import State from './state'

/**
 * Finite state machine for ima plugin.
 * @classdesc
 */
export default class ImaStateMachine {
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
          from: [State.LOADED, State.IDLE, State.PAUSED],
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
          from: State.PLAYING,
          to: State.IDLE
        },
        {
          name: context.player.Event.ALL_ADS_COMPLETED,
          from: State.IDLE,
          to: State.DONE
        },
        {
          name: context.player.Event.AD_BREAK_END,
          from: [State.IDLE, State.LOADED],
          to: State.IDLE
        },
        {
          name: context.player.Event.AD_ERROR,
          from: [State.LOADED, State.PLAYING, State.PAUSED, State.LOADING],
          to: State.IDLE
        },
        {
          name: context.player.Event.AD_LOADED,
          from: [State.IDLE, State.LOADED]
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
          name: 'goto', from: '*', to: s => s
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
        onAdbreakstart: onAdBreakStart.bind(context),
        onAdbreakend: onAdBreakEnd.bind(context),
        onAdfirstquartile: onAdEvent.bind(context),
        onAdmidpoint: onAdEvent.bind(context),
        onAdthirdquartile: onAdEvent.bind(context),
        onAderror: onAdError.bind(context),
        onUserclosedad: onAdEvent.bind(context),
        onAdvolumechanged: onAdEvent.bind(context),
        onAdmuted: onAdEvent.bind(context),
        onEnterState: onEnterState.bind(context),
      },
      plugins: [
        new StateMachineHistory()
      ]
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
  // When we are using the same video tag on iOS, native captions still
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
function onAdStarted(options: Object, adEvent: any): void {
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
function onAdClicked(options: Object, adEvent: any): void {
  this.logger.debug(adEvent.type.toUpperCase());
  if (this._currentAd.isLinear()) {
    if (this._stateMachine.is(State.PLAYING)) {
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
function onAdBreakStart(options: Object, adEvent: any): void {
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
  if (adEvent.type === "adError") {
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
    this.logger.debug("Change state: " + options.from + " => " + options.to);
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
 * Normalize the ima ad event object.
 * @param {any} adEvent - The ima ad error object.
 * @returns {Object} - The normalized ad event object.
 */
function normalizeAdEvent(adEvent: any): Object {
  return {
    ad: adEvent.getAd(),
    extraAdData: adEvent.getAdData()
  };
}

