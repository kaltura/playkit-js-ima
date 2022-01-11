// @flow

declare type AccessMode = 'FULL' | 'CREATIVE' | 'DOMAIN' | 'LIMITED';

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
