/* global navigator */

const MACOS_PLATFORMS = ["Macintosh", "MacIntel", "MacPPC", "Mac68K"];

function getMaximumWorkers() {
  return navigator.hardwareConcurrency;
}

function isMacOSPlatform() {
  const { platform } = navigator;
  return platform !== undefined && MACOS_PLATFORMS.includes(platform);
}

export { getMaximumWorkers, isMacOSPlatform };
