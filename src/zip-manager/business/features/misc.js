function getMiscFeatures({
  accentColor,
  musicTrackIndex,
  setOptions,
  setAccentColor,
  setMusicFrequencyData,
  setMusicTrackIndex,
  setMusicPlayerActive,
  getOptions,
  stylesheetService,
  themeService,
  musicService
}) {
  const { ACCENT_COLOR_CUSTOM_PROPERTY_NAME } = themeService;

  function initMiscFeatures() {
    const options = getOptions();
    const { accentColor } = options;
    setAccentColor(accentColor);
  }

  function playMusic() {
    setMusicPlayerActive(true);
    musicService.play({
      musicTrackIndex,
      onSetFrequencyData: setMusicFrequencyData
    });
  }

  function stopMusic() {
    setMusicPlayerActive(false);
    musicService.stop();
    setMusicTrackIndex(musicService.getNextTrackIndex(musicTrackIndex));
  }

  function updateAccentColor() {
    if (accentColor) {
      stylesheetService.setStyle(
        ACCENT_COLOR_CUSTOM_PROPERTY_NAME,
        accentColor
      );
      themeService.setAccentColor(accentColor);
      const options = getOptions();
      setOptions({ ...options, accentColor: accentColor });
    }
  }

  return {
    playMusic,
    stopMusic,
    updateAccentColor,
    initMiscFeatures
  };
}

export default getMiscFeatures;
