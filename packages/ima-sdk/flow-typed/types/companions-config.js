// @flow

/**
 * @external google.ima.CompanionAdSelectionSettings.SizeCriteria
 * @description {@link https://developers.google.com/interactive-media-ads/docs/sdks/html5/v3/apis#ima.CompanionAdSelectionSettings.SizeCriteria|google.ima.CompanionAdSelectionSettings.SizeCriteria}
 */

/**
 * @typedef {Object} CompanionsConfigObject
 * @param {Object} ads - Companion ads. Represented as a key-value object where the key is the ad id ({@link string}) and the value is the companion ad object ({@link #companionadobject|CompanionAdObject}).
 * @param {google.ima.CompanionAdSelectionSettings.SizeCriteria} [sizeCriteria="SELECT_EXACT_MATCH"] - Available choices for size selection criteria. The user can specify any of these choices for selecting companion ads.
 * @example
 * {
 *   sizeCriteria: 'SELECT_EXACT_MATCH',
 *   ads: {
 *     testCompanionSquare: {
 *       width: 300,
 *       height: 250
 *     },
 *     testCompanionLong: {
 *       width: 728,
 *       height: 90
 *     }
 *   }
 * }
 */
type _CompanionsConfigObject = {
  ads: {[id: string]: CompanionAdObject},
  sizeCriteria: string
};

/**
 * @typedef {Object} CompanionAdObject
 * @param {number} width - Width of the companion ad.
 * @param {number} height - Height of the companion ad.
 */
type _CompanionAdObject = {
  width: number,
  height: number
};

declare type CompanionAdObject = _CompanionAdObject;
declare type CompanionsConfigObject = _CompanionsConfigObject;
