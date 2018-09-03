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
}

export {AdsController};
