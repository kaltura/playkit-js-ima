// @flow
import {Ima} from './ima';

/**
 * Controller for ima plugin.
 * @classdesc
 */
class AdsController implements IAdsController {
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
    this._context = context;
  }

  /**
   * Skip on an ad.
   * @public
   * @returns {void}
   */
  skipAd(): void {
    this._context.skipAd();
  }

  /**
   * Play an ad on demand.
   * @param {string} adTagUrl - The ad tag url to play.
   * @public
   * @returns {void}
   */
  playAdNow(adTagUrl: string): void {
    this._context.playAdNow(adTagUrl);
  }
}

export {AdsController};
