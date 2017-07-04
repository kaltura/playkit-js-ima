// @flow
import {PlayerMiddlewareBase} from '../node_modules/playkit-js/src/playkit.js'
// import {PlayerMiddlewareBase} from 'playkit-js'
import State from './state'

/**
 * Middleware implementation for ima plugin.
 * @classdesc
 */
export default class ImaMiddleware extends PlayerMiddlewareBase {
  /**
   * The plugin context.
   * @member
   * @private
   */
  _context: any;

  /**
   * @constructor
   * @param {any} context - The plugin context.
   */
  constructor(context: any) {
    super();
    this._context = context;
  }

  /**
   * Play middleware handler.
   * @param {Function} next - The next play handler in the middleware chain.
   * @returns {void}
   */
  play(next: Function): void {
    this._context.preparePromise.then(() => {
      let fsm = this._context.getStateMachine();
      if (fsm.is(State.LOADED)) {
        this._context.initialize();
      } else {
        if (fsm.is(State.PAUSED)) {
          this._context.resumeAd();
        } else {
          super.play(next);
        }
      }
    }).catch((e) => {
      this._context.destroy();
      this._context.logger.error(e);
    });
  }

  /**
   * Pause middleware handler.
   * @param {Function} next - The next pause handler in the middleware chain.
   * @returns {void}
   */
  pause(next: Function): void {
    let fsm = this._context.getStateMachine();
    if (fsm.is(State.PLAYING)) {
      this._context.pauseAd();
    } else {
      super.pause(next);
    }
  }
}

