// @flow
import {BaseMiddleware} from 'playkit-js'
import Ima from './ima'
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
   * Whether the player has been loaded.
   * @member
   * @private
   */
  _isPlayerLoaded: boolean;
  /**
   * The plugin context.
   * @member
   * @private
   */
  _context: Ima;

  /**
   * @constructor
   * @param {Ima} context - The ima plugin context.
   */
  constructor(context: Ima) {
    super();
    this._context = context;
    context.player.addEventListener(context.player.Event.CHANGE_SOURCE_STARTED, () => this._isPlayerLoaded = false);
  }

  /**
   * Play middleware handler.
   * @param {Function} next - The next play handler in the middleware chain.
   * @returns {void}
   */
  play(next: Function): void {
    if (!this._isPlayerLoaded) {
      this._loadPlayer();
    }
    this._context.loadPromise.then(() => {
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

  /**
   * Load the player.
   * @returns {void}
   * @private
   */
  _loadPlayer(): void {
    const loadPlayer = () => {
      this._context.logger.debug("Load player by ima middleware");
      this._context.player.load();
      this._isPlayerLoaded = true;
    };
    if (this._context.player.engineType) { // player has source to play
      loadPlayer();
    } else {
      this._context.player.addEventListener(this._context.player.Event.SOURCE_SELECTED, () => loadPlayer());
    }
  }
}
