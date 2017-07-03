// @flow
import StateMachine from 'fsm-as-promised/lib/index'
import State from './state'

export default class FiniteStateMachine {
  constructor(context: any) {
    return StateMachine({
      initial: State.STARTING,
      final: State.DONE,
      events: [
        {name: 'loading', from: State.STARTING, to: State.LOADING},
        {name: 'loaded', from: State.LOADING, to: State.LOADED},
        {name: context.player.Event.ADS_LOADED, from: [State.IDLE, State.LOADED]},
        {name: context.player.Event.AD_PLAYING, from: [State.LOADED, State.IDLE, State.PAUSED], to: State.PLAYING},
        {name: context.player.Event.AD_RESUMED, from: State.PAUSED, to: State.PLAYING},
        {name: context.player.Event.AD_PAUSED, from: State.PLAYING, to: State.PAUSED},
        {name: context.player.Event.AD_CLICKED, from: [State.PLAYING, State.PAUSED]},
        {name: context.player.Event.AD_SKIPPED, from: [State.PLAYING, State.PAUSED], to: State.IDLE},
        {name: context.player.Event.AD_COMPLETED, from: State.PLAYING, to: State.IDLE},
        {name: context.player.Event.ALL_ADS_COMPLETED, from: State.IDLE, to: State.DONE},
        {name: context.player.Event.AD_BREAK_START, from: [State.IDLE, State.LOADED]},
        {name: context.player.Event.AD_BREAK_END, from: State.IDLE},
        {name: context.player.Event.AD_FIRST_QUARTILE, from: State.PLAYING},
        {name: context.player.Event.AD_MIDPOINT, from: State.PLAYING},
        {name: context.player.Event.AD_THIRD_QUARTILE, from: State.PLAYING},
        {name: context.player.Event.AD_ERROR, from: [State.LOADED, State.PLAYING, State.PAUSED], to: State.IDLE},
      ],
      callbacks: {
        // LOADED
        onadsloaded: function (options) {
          let adEvent = options.args[0];
          this.logger.debug("onAdEvent: " + adEvent.type.toUpperCase());
          this.dispatchEvent(options.name, adEvent);
        }.bind(context),
        // STARTED
        onadplaying: function (options) {
          let adEvent = options.args[0];
          this.logger.debug("onAdEvent: " + adEvent.type.toUpperCase());
          if (this.config.mediaPreloading && !this._playerLoaded) {
            this.logger.debug("Preloading media");
            this.player.load();
            this._playerLoaded = true;
          }
          context.dispatchEvent(options.name, adEvent);
        }.bind(context),
        // PAUSED
        onadpaused: function (options) {
          let adEvent = options.args[0];
          this.logger.debug("onAdEvent: " + adEvent.type.toUpperCase());
          this.dispatchEvent(options.name, adEvent);
        }.bind(context),
        // RESUMED
        onadresumed: function (options) {
          let adEvent = options.args[0];
          this.logger.debug("onAdEvent: " + adEvent.type.toUpperCase());
          this.dispatchEvent(options.name, adEvent);
        }.bind(context),
        // CLICKED
        onadclicked: function (options) {
          let adEvent = options.args[0];
          this.logger.debug("onAdEvent: " + adEvent.type.toUpperCase());
          if (this._fsm.is(State.PLAYING)) {
            this._adsManager.pause();
          } else {
            this._adsManager.resume();
          }
        }.bind(context),
        // SKIPPED
        onadskipped: function (options) {
          let adEvent = options.args[0];
          this.logger.debug("onAdEvent: " + adEvent.type.toUpperCase());
          this.dispatchEvent(options.name, adEvent);
        }.bind(context),
        // COMPLETE
        onadcompleted: function (options) {
          let adEvent = options.args[0];
          this.logger.debug("onAdEvent: " + adEvent.type.toUpperCase());
          this.dispatchEvent(options.name, adEvent);
        }.bind(context),
        // ALL_ADS_COMPLETED
        onalladscompleted: function (options) {
          let adEvent = options.args[0];
          this.logger.debug("onAdEvent: " + adEvent.type.toUpperCase());
          this._hideAdsContainer();
          this.dispatchEvent(options.name, adEvent);
        }.bind(context),
        // CONTENT_PAUSE_REQUESTED
        onadbreakstart: function (options) {
          let adEvent = options.args[0];
          this.logger.debug("onAdEvent: " + adEvent.type.toUpperCase());
          this._showAdsContainer();
          this.player.pause();
          this.dispatchEvent(options.name, adEvent);
        }.bind(context),
        // CONTENT_RESUME_REQUESTED
        onadbreakend: function (options) {
          let adEvent = options.args[0];
          this.logger.debug("onAdEvent: " + adEvent.type.toUpperCase());
          if (!this._contentComplete) {
            this._hideAdsContainer();
            this.player.play();
          }
        }.bind(context),
        // FIRST_QUARTILE
        onadfirstquartile: function (options) {
          let adEvent = options.args[0];
          this.logger.debug("onAdEvent: " + adEvent.type.toUpperCase());
          this.dispatchEvent(options.name, adEvent);
        }.bind(context),
        // MIDPOINT
        onadmidpoint: function (options) {
          let adEvent = options.args[0];
          this.logger.debug("onAdEvent: " + adEvent.type.toUpperCase());
          this.dispatchEvent(options.name, adEvent);
        }.bind(context),
        // THIRD_QUARTILE
        onadthirdquartile: function (options) {
          let adEvent = options.args[0];
          this.logger.debug("onAdEvent: " + adEvent.type.toUpperCase());
          this.dispatchEvent(options.name, adEvent);
        }.bind(context),
        // AD_ERROR
        onaderror: function (options) {
          let adEvent = options.args[0];
          this.logger.debug("onAdEvent: " + adEvent.type.toUpperCase());
          let adError = adEvent.getError();
          this.logger.error(adError);
          this.destroy();
        }.bind(context),
        onenter: function (options) {
          this.logger.debug("Change state: " + options.from + " --> " + options.to);
        }.bind(context),
      }
    });
  }
}
