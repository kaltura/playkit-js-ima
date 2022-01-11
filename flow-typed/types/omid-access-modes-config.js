// @flow

/**
*  {@link https://developers.google.com/interactive-media-ads/docs/sdks/html5/client-side/omsdk#access_modes different access modes for verification scripts}
 * @typedef AccessMode
 * @type { 'FULL' | 'CREATIVE' | 'DOMAIN' | 'LIMITED'}
 */
declare type AccessMode = 'FULL' | 'CREATIVE' | 'DOMAIN' | 'LIMITED';

/**
 * {@link https://developers.google.com/interactive-media-ads/docs/sdks/html5/client-side/reference/js/google.ima#.OmidVerificationVendor different verification script providers}
 * @typedef OmidAccessModesConfig
 * @example
 * {
 *   MOAT: 'FULL'
 *   PIXELATE: 'CREATIVE'
 *   OTHER: 'DOMAIN'
 * }
 */
declare type OmidAccessModesConfig = {
  OTHER?: AccessMode,
  MOAT?: AccessMode,
  DOUBLEVERIFY?: AccessMode,
  INTEGRAL_AD_SCIENCE?: AccessMode,
  PIXELATE?: AccessMode,
  NIELSEN?: AccessMode,
  COMSCORE?: AccessMode,
  MEETRICS?: AccessMode,
  GOOGLE?: AccessMode
};
