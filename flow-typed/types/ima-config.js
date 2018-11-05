// @flow
/**
 * @external google.ima.AdsRenderingSettings
 * @description {@link https://developers.google.com/interactive-media-ads/docs/sdks/html5/v3/apis#ima.AdsRenderingSettings|google.ima.AdsRenderingSettings}
 */

/**
 * @typedef {Object} ImaConfigObject
 * @property {string} adTagUrl - Specifies the ad tag url that is requested from the ad server.
 * @property {string} [adsResponse] - Specifies a VAST 2.0 document to be used as the ads response instead of making a request via an ad tag url (if `adTagUrl` is not set).
 * @property {boolean} [debug] - If set to true, loads IMA SDK in debug mode.
 * @property {number} [disableMediaPreload] - Whether to disable media pre loading while ad is playing. If set to `true`, the player will start loading the content media just after the ad break will end (incase of preroll ad). This will also overrides `config.adsRenderingSettings.restoreCustomPlaybackStateOnAdBreakComplete` no matters its value and sets it to `false`.
 * @property {google.ima.AdsRenderingSettings} [adsRenderingSettings] - Defines parameters that control the rendering of ads.
 * @property {boolean} [adsRenderingSettings.useStyledLinearAds] - See usage also in {@link https://github.com/kaltura/playkit-js-ima/blob/FEC-8486/docs/vpaid.md|Handling VPAID Ads}
 * @property {CompanionsConfigObject} [companions] - Defines the companion ads.
 * @example
 * // Default config
 * {
 *  debug: false,
 *  disableMediaPreload: false,
 *  adsRenderingSettings: {
 *    restoreCustomPlaybackStateOnAdBreakComplete: true,
 *    enablePreloading: false,
 *    useStyledLinearAds: false,
 *    useStyledNonLinearAds: true
 *    bitrate: -1,
 *    autoAlign: true
 *  },
 *   companions: {
 *     sizeCriteria: 'SELECT_EXACT_MATCH'
 *   }
 * }
 */
type _ImaConfigObject = {
  debug: boolean,
  adTagUrl: string,
  adsResponse: string,
  disableMediaPreload: boolean,
  setDisableCustomPlaybackForIOS10Plus: boolean,
  adsRenderingSettings: Object,
  companions: Object
};

declare type ImaConfigObject = _ImaConfigObject;
