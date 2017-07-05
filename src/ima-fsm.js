// @flow
import StateMachine from 'fsm-as-promised/lib/index'
import State from './state'

/**
 * Finite state machine for ima plugin.
 * @classdesc
 */
export default class ImaFSM {
  /**
   * @constructor
   * @param {any} context - The plugin _context.
   */
  constructor(context: any) {
    return StateMachine({
      initial: State.LOADING,
      final: State.DONE,
      events: [
        {
          name: 'loaded',
          from: State.LOADING,
          to: State.LOADED
        },
        {
          name: context.player.Event.ADS_LOADED,
          from: [State.IDLE, State.LOADED]
        },
        {
          name: context.player.Event.AD_STARTED,
          from: [State.LOADED, State.IDLE, State.PAUSED],
          to: [State.PLAYING, State.IDLE],
          condition: function (options) {
            let adEvent = options.args[0];
            let ad = adEvent.getAd();
            if (!ad.isLinear()) {
              return State.IDLE;
            }
            return State.PLAYING;
          }
        },
        {
          name: context.player.Event.AD_RESUMED,
          from: State.PAUSED, to: State.PLAYING
        },
        {
          name: context.player.Event.AD_PAUSED,
          from: State.PLAYING, to: State.PAUSED
        },
        {
          name: context.player.Event.AD_CLICKED,
          from: [State.PLAYING, State.PAUSED]
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
          name: context.player.Event.AD_BREAK_START,
          from: [State.IDLE, State.LOADED]
        },
        {
          name: context.player.Event.AD_BREAK_END,
          from: [State.IDLE, State.LOADED],
          to: State.IDLE
        },
        {
          name: context.player.Event.AD_FIRST_QUARTILE,
          from: State.PLAYING
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
          name: context.player.Event.AD_ERROR,
          from: [State.LOADED, State.PLAYING, State.PAUSED, State.LOADING],
          to: State.IDLE
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
        }
      ],
      callbacks: {
        onadsloaded: onAdsLoaded.bind(context),
        onadstarted: onAdStarted.bind(context),
        onadpaused: onAdEvent.bind(context),
        onadresumed: onAdEvent.bind(context),
        onadclicked: onAdClicked.bind(context),
        onadskipped: onAdEvent.bind(context),
        onadcompleted: onAdCompleted.bind(context),
        onalladscompleted: onAllAdsCompleted.bind(context),
        onadbreakstart: onAdBreakStart.bind(context),
        onadbreakend: onAdBreakEnd.bind(context),
        onadfirstquartile: onAdEvent.bind(context),
        onadmidpoint: onAdEvent.bind(context),
        onadthirdquartile: onAdEvent.bind(context),
        onaderror: onAdError.bind(context),
        onenter: onEnterState.bind(context),
        onuserclosedad: onAdEvent.bind(context),
        onadvolumechanged: onAdEvent.bind(context),
        onadmuted: onAdEvent.bind(context)
      }
    });

    /**
     * LOADED event handler.
     * @param {Object} options - fsm event data.
     * @returns {void}
     */
    function onAdsLoaded(options: Object): void {
      let adEvent = options.args[0];
      this.logger.debug("onAdsLoaded: " + adEvent.type.toUpperCase());
      let playerViewSize = this._getPlayerViewSize();
      this._adsManager.resize(playerViewSize.width, playerViewSize.height, this._sdk.ViewMode.NORMAL);
      this._syncPlayerVolume();
      this.dispatchEvent(options.name, adEvent);
      this._maybePreloadContent();
    }

    /**
     * STARTED event handler.
     * @param {Object} options - fsm event data.
     * @returns {void}
     */
    function onAdStarted(options: Object): void {
      let adEvent = options.args[0];
      let ad = adEvent.getAd();
      this.logger.debug("onAdStarted: " + adEvent.type.toUpperCase());
      if (!ad.isLinear()) {
        this.player.play();
      } else {
        this._startAdInterval();
      }
      this.dispatchEvent(options.name, adEvent);
    }

    /**
     * CLICKED event handler.
     * @param {Object} options - fsm event data.
     * @returns {void}
     */
    function onAdClicked(options: Object): void {
      let adEvent = options.args[0];
      this.logger.debug("onAdClicked: " + adEvent.type.toUpperCase());
      if (this._fsm.is(State.PLAYING)) {
        this._adsManager.pause();
      } else {
        this._adsManager.resume();
      }
    }

    /**
     * COMPLETE event handler.
     * @param {Object} options - fsm event data.
     * @returns {void}
     */
    function onAdCompleted(options: Object): void {
      let adEvent = options.args[0];
      let ad = adEvent.getAd();
      this.logger.debug("onAdCompleted: " + adEvent.type.toUpperCase());
      if (ad.isLinear()) {
        clearInterval(this._intervalTimer);
        this._intervalTimer = null;
      }
      this.dispatchEvent(options.name, adEvent);
    }

    /**
     * ALL_ADS_COMPLETED event handler.
     * @param {Object} options - fsm event data.
     * @returns {void}
     */
    function onAllAdsCompleted(options: Object): void {
      let adEvent = options.args[0];
      this.logger.debug("onAllAdsCompleted: " + adEvent.type.toUpperCase());
      this._hideAdsContainer();
      this.dispatchEvent(options.name, adEvent);
    }

    /**
     * CONTENT_PAUSED_REQUESTED event handler.
     * @param {Object} options - fsm event data.
     * @returns {void}
     */
    function onAdBreakStart(options: Object): void {
      let adEvent = options.args[0];
      this.logger.debug("onAdBreakStart: " + adEvent.type.toUpperCase());
      this._showAdsContainer();
      this.player.pause();
      this.dispatchEvent(options.name, adEvent);
    }

    /**
     * CONTENT_RESUMED_REQUESTED event handler.
     * @param {Object} options - fsm event data.
     * @returns {void}
     */
    function onAdBreakEnd(options: Object): void {
      let adEvent = options.args[0];
      this.logger.debug("onAdBreakEnd: " + adEvent.type.toUpperCase());
      if (!this._contentComplete) {
        this._hideAdsContainer();
        this.player.play();
      }
    }

    /**
     * ERROR event handler.
     * @param {Object} options - fsm event data.
     * @returns {void}
     */
    function onAdError(options: Object): void {
      let adEvent = options.args[0];
      this.logger.debug("onAdError: " + adEvent.type.toUpperCase());
      let adError = adEvent.getError();
      this.logger.error(adError);
      this.destroy();
    }

    /**
     * General event handler.
     * @param {Object} options - fsm event data.
     * @returns {void}
     */
    function onAdEvent(options: Object): void {
      let adEvent = options.args[0];
      this.logger.debug("onAdEvent: " + adEvent.type.toUpperCase());
      this.dispatchEvent(options.name, adEvent);
    }

    /**
     * Enter state handler.
     * @param {Object} options - fsm event data.
     * @returns {void}
     */
    function onEnterState(options: Object): void {
      this.logger.debug("Change state: " + options.from + " --> " + options.to);
    }
  }
}
