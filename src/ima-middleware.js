// @flow
import {BaseMiddleware} from 'playkit-js'
import State from './state'

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
    this._context.loadPromise.then(() => {
      let sm = this._context.getStateMachine();
      switch (sm.state) {
        case State.LOADED:
          this._context.initialUserAction()
            .then(() => {
              this.callNext(next);
            });
          break;
        case State.PAUSED:
          this._context.resumeAd()
            .then(() => {
              this.callNext(next);
            });
          break;
        default:
          this.callNext(next);
          break;
      }
    }).catch((e) => {
      this._context.destroy();
      this._context.logger.error(e);
      this.callNext(next);
    });
  }

  /**
   * Pause middleware handler.
   * @param {Function} next - The next pause handler in the middleware chain.
   * @returns {void}
   */
  pause(next: Function): void {
    let sm = this._context.getStateMachine();
    switch (sm.state) {
      case State.PLAYING:
        this._context.pauseAd();
        break;
      default:
        this.callNext(next);
        break;
    }
  }
}
