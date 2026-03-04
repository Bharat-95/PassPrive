import { Image } from 'react-native';

export const PASSPRIVE_LOGO_IMAGE = require('../assets/passprrive.png');
export const GOOGLE_ICON_IMAGE = require('../assets/google.png');

let authAssetsReady = false;
let authAssetsPromise = null;

export const isAuthAssetsReady = () => authAssetsReady;

export const preloadAuthAssets = async () => {
  if (authAssetsReady) return true;
  if (authAssetsPromise) return authAssetsPromise;

  authAssetsPromise = (async () => {
    const logoUri = Image.resolveAssetSource(PASSPRIVE_LOGO_IMAGE)?.uri;
    const googleUri = Image.resolveAssetSource(GOOGLE_ICON_IMAGE)?.uri;

    await Promise.allSettled([
      logoUri ? Image.prefetch(logoUri) : Promise.resolve(true),
      googleUri ? Image.prefetch(googleUri) : Promise.resolve(true),
    ]);

    authAssetsReady = true;
    return true;
  })();

  try {
    return await authAssetsPromise;
  } finally {
    authAssetsPromise = null;
  }
};
