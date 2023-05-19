function getMiscFeatures({
  accentColor,
  musicData,
  setOptions,
  setAccentColor,
  setMusicData,
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
      trackIndex: musicData.trackIndex,
      onSetFrequencyData: (frequencyData) =>
        setMusicData((musicData) => ({
          ...musicData,
          frequencyData
        }))
    });
  }

  function stopMusic() {
    setMusicPlayerActive(false);
    musicService.stop();
    setMusicData((musicData) => ({
      ...musicData,
      trackIndex: musicService.getNextTrackIndex(musicData.trackIndex)
    }));
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
