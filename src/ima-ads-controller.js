// @flow
import {Ima} from './ima';

/**
 * Controller for ima plugin.
 * @class ImaAdsController
 * @param {Ima} context - The ima plugin context.
 */
class ImaAdsController implements IAdsController {
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
   * @param {string} adTagUrl - The ad tag url to play.
   * @private
   * @returns {void}
   * @memberof ImaAdsController
   */
  playAdNow(adTagUrl: string): void {
    this._context.playAdNow(adTagUrl);
  }

  /**
   * Prepare an ad for playing.
   * @param {Object} config - ad config
   * @public
   * @returns {void}
   */
  prepareAd(config): void {
    this._context.prepareAd(config);
  }
}

export {ImaAdsController};
