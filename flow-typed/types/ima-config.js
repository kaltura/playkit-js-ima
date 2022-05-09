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
 * @param {boolean} [disableMediaPreload=false] - Whether to disable media pre loading while ad is playing. If set to `true`, the player will start loading the content media just after the ad break will end (incase of preroll ad). This will also overrides `config.adsRenderingSettings.restoreCustomPlaybackStateOnAdBreakComplete` no matters its value and sets it to `false`.
 * @param {boolean} [forceReloadMediaAfterAds=false] - force reload our media after ads finish.
 * @param {boolean} [delayInitUntilSourceSelected=false] - wait until the video tag loaded and then load Ima.
 * @param {google.ima.ImaSdkSettings.VpaidMode} [vpaidMode='ENABLED'] - Sets VPAID playback mode See usage also in {@link https://github.com/kaltura/playkit-js-ima/blob/master/docs/vpaid.md#handling-vpaid-modes|Handling VPAID Modes}.
 * @param {google.ima.ImaSdkSettings.numRedirects} [numRedirects=4] - Specifies the maximum number of redirects before the subsequent redirects will be denied, and the ad load aborted. This applies to all VAST wrapper ads.
 * @param {google.ima.AdsRequest.vastLoadTimeout} [vastLoadTimeout: 5000] - Override for default VAST load timeout in milliseconds for a single wrapper. The default timeout is 5000ms.
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
 * @param {string} [locale] - Sets the publisher provided locale. The locale specifies the language in which to display UI elements and can be any two-letter {@link https://www.loc.gov/standards/iso639-2/php/English_list.php|ISO 639-1} code.
 * @param {boolean} [showAdBreakCuePoint] - Whether to show the ad breaks cue points.
 * @param {Object} [adBreakCuePointStyle] - Style options for the ad breaks cue points - See the options {@link https://github.com/kaltura/playkit-js-timeline/blob/main/docs/types.md#cuepointoptionsobject|Here}.
 * @param {string} [sessionId] - a temporary random ID. It is used exclusively for frequency capping. A session ID must be a UUID.
 * @param {OmidAccessModesConfig} [omidAccessModes] - A dictionary that maps each {@link https://developers.google.com/interactive-media-ads/docs/sdks/html5/client-side/reference/js/google.ima#.OmidVerificationVendor OmidVerificationVendor} to one of the {@link https://developers.google.com/interactive-media-ads/docs/sdks/html5/client-side/omsdk#access_modes access modes}

 * @example
 */
type _ImaConfigObject = {
  debug: boolean,
  adTagUrl: string,
  adsResponse: string,
  vpaidMode: string,
  vastLoadTimeout: number,
  disableMediaPreload: boolean,
  forceReloadMediaAfterAds: boolean,
  delayInitUntilSourceSelected: boolean,
  setDisableCustomPlaybackForIOS10Plus: boolean,
  numRedirects: number,
  adsRenderingSettings: Object,
  companions: Object,
  locale: string,
  showAdBreakCuePoint: boolean,
  adBreakCuePointStyle: Object,
  sessionId: string,
  omidAccessModes: OmidAccessModesConfig
};

declare type ImaConfigObject = _ImaConfigObject;
