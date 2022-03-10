// @flow
import {core} from 'kaltura-player-js';
import {Ima} from './ima';
import {State} from './state';

const {BaseMiddleware, AdBreak, Ad} = core;

/**
 * Middleware implementation for ima plugin.
 * @class ImaMiddleware
 * @param {Ima} context - The ima plugin context.
 * @private
 */
class ImaMiddleware extends BaseMiddleware {
  /**
   * The id of the ima middleware.
   * @type {string}
   * @public
   * @memberof ImaMiddleware
   */
  id: string = 'ImaMiddleware';
  /**
   * Whether the play request is the first.
   * @member
   * @private
   * @memberof ImaMiddleware
   */
  _isFirstPlay: boolean;
  /**
   * The plugin context.
   * @member
   * @private
   * @memberof ImaMiddleware
   */
  _context: Ima;
  /**
   * The next load function.
   * @member
   * @private
   * @memberof ImaMiddleware
   */
  _nextLoad: ?Function;
  /**
   * Current ad break.
   * @member
   * @private
   * @memberof ImaMiddleware
   */
  _adBreak: AdBreak;
  /**
   * Current ad.
   * @member
   * @private
   * @memberof ImaMiddleware
   */
  _ad: Ad;

  constructor(context: Ima) {
    super();
    this._context = context;
    context.player.addEventListener(context.player.Event.CHANGE_SOURCE_STARTED, () => {
      this._isFirstPlay = true;
      this._nextLoad = null;
    });
  }

  /**
   * Load middleware handler.
   * @param {Function} next - The load play handler in the middleware chain.
   * @returns {void}
   * @memberof ImaMiddleware
   */
  load(next: Function): void {
    this._nextLoad = next;
    this._context.loadPromise.catch(() => this._callNextLoad());
    const sm = this._context.getStateMachine();
    if (sm.state !== State.IDLE && (this._context.config.adTagUrl || this._context.config.adsResponse)) {
      this._context.player.addEventListener(this._context.player.Event.AD_BREAK_START, (event: FakeEvent) => (this._adBreak = event.payload.adBreak));
      this._context.player.addEventListener(this._context.player.Event.AD_BREAK_END, () => {
        this._adBreak = null;
        this._ad = null;
      });
      this._context.player.addEventListener(this._context.player.Event.AD_LOADED, (event: FakeEvent) => {
        this._ad = event.payload.ad;
        if (!this._ad.linear) {
          this._callNextLoad();
        }
      });
      this._context.player.addEventListener(this._context.player.Event.AD_ERROR, () => {
        this._context.logger.debug('Ad error listener on middleware', this._adBreak, this._ad);
        // checking if the error raised for the last ad before playback:
        // ad error raised before ad break start
        // or there's only one ad in the pod
        // or it's the last ad in the pod
        if (!(this._ad && this._adBreak) || this._ad.position === this._adBreak.numAds) {
          this._context.logger.debug('Call next load after ad error on middleware');
          this._callNextLoad();
        }
      });
      this._context.player.addEventListener(this._context.player.Event.AD_MANIFEST_LOADED, event => {
        if (!event.payload.adBreaksPosition.includes(0)) {
          this._callNextLoad();
        }
      });
    } else {
      this._callNextLoad();
    }
  }

  /**
   * Play middleware handler.
   * @param {Function} next - The next play handler in the middleware chain.
   * @returns {void}
   * @memberof ImaMiddleware
   */
  play(next: Function): void {
    if (this._isFirstPlay) {
      this._isFirstPlay = false;
      if (this._context.config.disableMediaPreload || this._context.playOnMainVideoTag()) {
        this._context.player.addEventListener(this._context.player.Event.AD_BREAK_END, () => this._callNextLoad());
        if (!(this._context.playOnMainVideoTag() || this._context.player.getVideoElement().src)) {
          this._context.player.getVideoElement().load();
        }
      } else {
        this._callNextLoad();
      }
    }
    this._context.loadPromise
      .then(() => {
        let sm = this._context.getStateMachine();
        switch (sm.state) {
          case State.PLAYING:
            break;
          case State.LOADED: {
            const initialUserAction = this._context.initialUserAction();
            if (initialUserAction) {
              return initialUserAction.then(() => {
                this.callNext(next);
              });
            } else {
              this.callNext(next);
            }
            break;
          }
          case State.PAUSED: {
            const resumeAd = this._context.resumeAd();
            if (resumeAd) {
              return resumeAd.then(() => {
                this.callNext(next);
              });
            } else {
              this.callNext(next);
            }
            break;
          }
          default: {
            this.callNext(next);
            break;
          }
        }
      })
      .catch(e => {
        this._context.reset();
        this._context.logger.error(e);
        this.callNext(next);
      });
  }

  /**
   * Pause middleware handler.
   * @param {Function} next - The next pause handler in the middleware chain.
   * @returns {void}
   * @memberof ImaMiddleware
   */
  pause(next: Function): void {
    let sm = this._context.getStateMachine();
    switch (sm.state) {
      case State.PAUSED:
        break;
      case State.PLAYING: {
        this._context.pauseAd();
        break;
      }
      default: {
        this.callNext(next);
        break;
      }
    }
  }

  _callNextLoad(): void {
    if (this._nextLoad) {
      this.callNext(this._nextLoad);
    }
    this._nextLoad = null;
  }
}

export {ImaMiddleware};
