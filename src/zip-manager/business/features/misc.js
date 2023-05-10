function getMiscFeatures({
  accentColor,
  musicTrackIndex,
  appStyleElement,
  setOptions,
  setAccentColor,
  setMusicFrequencyData,
  setMusicTrackIndex,
  setMusicPlayerActive,
  getOptions,
  musicService,
  util,
  constants
}) {
  function initMiscFeatures() {
    const options = getOptions();
    const { accentColor } = options;
    setAccentColor(accentColor);
  }

  function playMusic() {
    async function playMusic() {
      const response = await util.fetch(
        constants.MUSIC_TRACK_RELATIVE_PATH_PREFIX + (musicTrackIndex + 1)
      );
      const blob = await response.blob();
      const contentType = blob.type;
      const data = await blob.arrayBuffer();
      const masterVolume = constants.MUSIC_TRACKS_VOLUMES[musicTrackIndex];
      await musicService.play({
        data,
        masterVolume,
        contentType,
        onSetFrequencyData: setMusicFrequencyData
      });
      setMusicPlayerActive(true);
    }

    playMusic();
  }

  function stopMusic() {
    musicService.stop();
    setMusicTrackIndex(
      (musicTrackIndex + 1) % constants.MUSIC_TRACKS_VOLUMES.length
    );
    setMusicPlayerActive(false);
  }

  function updateAccentColor() {
    if (accentColor) {
      const brightNessAccentColor = getBrightNess(accentColor);
      if (brightNessAccentColor > 192) {
        util.setDocumentClass("dark");
      } else if (brightNessAccentColor < 64) {
        util.setDocumentClass("light");
      } else {
        util.setDocumentClass("");
      }
      util.setStyle(
        appStyleElement,
        constants.ACCENT_COLOR_CUSTOM_PROPERTY_NAME,
        accentColor
      );
      const options = getOptions();
      setOptions({ ...options, accentColor: accentColor });
    }
  }

  function getBrightNess(color) {
    const red = parseInt(color.substring(1, 3), 16);
    const green = parseInt(color.substring(3, 5), 16);
    const blue = parseInt(color.substring(5, 7), 16);
    // cf. https://www.w3.org/TR/AERT/#color-contrast
    return Math.round((red * 299 + green * 587 + blue * 114) / 1000);
  }

  return {
    playMusic,
    stopMusic,
    updateAccentColor,
    initMiscFeatures
  };
}

export default getMiscFeatures;
