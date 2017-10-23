// @flow
import {BaseMiddleware} from 'playkit-js'
import Ima from './ima'
import State from './state'

/**
 * The plugin context.
 */
let ctx: Ima;

/**
 * Middleware implementation for ima plugin.
 * @classdesc
 */
export default class ImaMiddleware extends BaseMiddleware {
  /**
   * The id of the ima middleware.
   * @type {string}
   * @public
   */
  id: string = "ImaMiddleware";
  /**
   * Whether the player has been loaded.
   * @member
   * @private
   */
  _isPlayerLoaded: boolean;

  /**
   * @constructor
   * @param {Ima} context - The ima plugin context.
   */
  constructor(context: Ima) {
    super();
    ctx = context;
    ctx.player.addEventListener(ctx.player.Event.CHANGE_SOURCE_STARTED, () => this._isPlayerLoaded = false);
  }

  /**
   * Play middleware handler.
   * @param {Function} next - The next play handler in the middleware chain.
   * @returns {void}
   */
  play(next: Function): void {
    if (!this._isPlayerLoaded) {
      ctx.player.load();
      this._isPlayerLoaded = true;
      ctx.logger.debug("Player loaded");
    }
    ctx.loadPromise.then(() => {
      let sm = ctx.getStateMachine();
      switch (sm.state) {
        case State.LOADED: {
          const initialUserAction = ctx.initialUserAction();
          if (initialUserAction) {
            initialUserAction.then(() => {
              this.callNext(next);
            });
          } else {
            this.callNext(next);
          }
          break;
        }
        case State.PAUSED: {
          const resumeAd = ctx.resumeAd();
          if (resumeAd) {
            resumeAd.then(() => {
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
    }).catch((e) => {
      ctx.destroy();
      ctx.logger.error(e);
      this.callNext(next);
    });
  }

  /**
   * Pause middleware handler.
   * @param {Function} next - The next pause handler in the middleware chain.
   * @returns {void}
   */
  pause(next: Function): void {
    let sm = ctx.getStateMachine();
    switch (sm.state) {
      case State.PLAYING: {
        ctx.pauseAd();
        break;
      }
      default: {
        this.callNext(next);
        break;
      }
    }
  }
}
