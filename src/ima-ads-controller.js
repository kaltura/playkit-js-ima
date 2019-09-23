// @flow
import {Ima} from './ima';
import {State} from './state';

/**
 * Controller for ima plugin.
 * @class ImaAdsController
 * @param {Ima} context - The ima plugin context.
 */
class ImaAdsController implements IAdsPluginController {
  /**
   * The plugin context.
   * @member
   * @private
   * @memberof ImaAdsController
   */
  _context: Ima;

  constructor(context: Ima) {
    this._context = context;
  }

  /**
   * Skip on an ad.
   * @public
   * @returns {void}
   * @memberof ImaAdsController
   */
  skipAd(): void {
    this._context.skipAd();
  }

  /**
   * Play an ad on demand.
   * @param {Array<Object>} adPod - The ad pod to play.
   * @public
   * @returns {void}
   * @memberof ImaAdsController
   */
  playAdNow(adPod: Array<Object>): void {
    this._context.playAdNow(adPod);
  }

  /**
   * On playback ended handler.
   * @public
   * @returns {Promise<void>} - complete promise
   * @memberof ImaAdsController
   */
  onPlaybackEnded(): Promise<void> {
    return this._context.onPlaybackEnded();
  }

  /**
   * Whether this ads controller is active
   * @public
   * @returns {boolean} - is active
   * @memberof ImaAdsController
   */
  get active(): boolean {
    return this._context.getStateMachine().state === State.PLAYING || this._context.getStateMachine().state === State.PAUSED;
  }

  /**
   * Whether this ads controller is done
   * @public
   * @returns {boolean} - is done
   * @memberof ImaAdsController
   */
  get done(): boolean {
    return this._context.getStateMachine().state === State.DONE;
  }

  /**
   * The controller name
   * @public
   * @returns {string} - The name
   * @memberof ImaAdsController
   */
  get name(): string {
    return this._context.name;
  }
}

export {ImaAdsController};
