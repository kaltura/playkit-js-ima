// @flow
import {BaseMiddleware} from '@playkit-js/playkit-js';
import {Ima} from './ima';
import {State} from './state';

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

  constructor(context: Ima) {
    super();
    this._context = context;
    context.player.addEventListener(context.player.Event.CHANGE_SOURCE_STARTED, () => (this._isFirstPlay = true));
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
      this._context.player.config.playback.disableMediaPreloadWhileAd && this._context.player.getVideoElement().load();
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
}

export {ImaMiddleware};
