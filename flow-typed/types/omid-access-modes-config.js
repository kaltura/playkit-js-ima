// @flow

/**
 * {@link https://developers.google.com/interactive-media-ads/docs/sdks/html5/client-side/omsdk#access_modes different access modes for verification scripts}
 * @typedef AccessMode
 * @type { 'FULL' | 'CREATIVE' | 'DOMAIN' | 'LIMITED'}
 */
declare type AccessMode = 'FULL' | 'CREATIVE' | 'DOMAIN' | 'LIMITED';

/**
 * A dictionary that maps each {@link https://developers.google.com/interactive-media-ads/docs/sdks/html5/client-side/reference/js/google.ima#.OmidVerificationVendor OmidVerificationVendor} to one of the {@link https://developers.google.com/interactive-media-ads/docs/sdks/html5/client-side/omsdk#access_modes available access modes}
 * @typedef OmidAccessModesConfig
 * @example
 * {
 *   MOAT: 'FULL'
 *   PIXELATE: 'CREATIVE'
 *   OTHER: 'DOMAIN'
 * }
 */
declare type OmidAccessModesConfig = {
  [string]: AccessMode
}
