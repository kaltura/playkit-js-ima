// @flow
/**
 * @external google.ima.AdsRenderingSettings
 * @description {@link https://developers.google.com/interactive-media-ads/docs/sdks/html5/v3/apis#ima.AdsRenderingSettings|google.ima.AdsRenderingSettings}
 */

/**
 * @external google.ima.ImaSdkSettings.VpaidMode
 * @description {@link https://developers.google.com/interactive-media-ads/docs/sdks/html5/v3/apis#ima.ImaSdkSettings.VpaidMode|google.ima.ImaSdkSettings.VpaidMode}
 */

/**
 * @typedef {Object} ImaConfigObject
 * @param {string} adTagUrl - Specifies the ad tag url that is requested from the ad server.
 * @param {string} [adsResponse] - Specifies a VAST 2.0 document to be used as the ads response instead of making a request via an ad tag url (if `adTagUrl` is not set).
 * @param {boolean} [debug=false] - If set to true, loads IMA SDK in debug mode.
 * @param {number} [disableMediaPreload=false] - Whether to disable media pre loading while ad is playing. If set to `true`, the player will start loading the content media just after the ad break will end (incase of preroll ad). This will also overrides `config.adsRenderingSettings.restoreCustomPlaybackStateOnAdBreakComplete` no matters its value and sets it to `false`.
 * @param {google.ima.ImaSdkSettings.VpaidMode} [vpaidMode='ENABLED'] - Sets VPAID playback mode See usage also in {@link https://github.com/kaltura/playkit-js-ima/blob/master/docs/vpaid.md#handling-vpaid-modes|Handling VPAID Modes}.
 * @param {google.ima.AdsRenderingSettings} [adsRenderingSettings={
  restoreCustomPlaybackStateOnAdBreakComplete: true,
  enablePreloading: false,
  useStyledLinearAds: false,
  useStyledNonLinearAds: true
  bitrate: -1,
  autoAlign: true
}] - Defines parameters that control the rendering of ads.
 * @param {boolean} [adsRenderingSettings.useStyledLinearAds=false] - See usage also in {@link https://github.com/kaltura/playkit-js-ima/blob/master/docs/vpaid.md#handling-vpaid-ads|Handling VPAID Ads}
 * @param {CompanionsConfigObject} [companions] - Defines the companion ads.
 * @example
 */
type _ImaConfigObject = {
  debug: boolean,
  adTagUrl: string,
  adsResponse: string,
  vpaidMode: string,
  disableMediaPreload: boolean,
  setDisableCustomPlaybackForIOS10Plus: boolean,
  adsRenderingSettings: Object,
  companions: Object
};

declare type ImaConfigObject = _ImaConfigObject;
