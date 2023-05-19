function getMiscFeatures({
  accentColor,
  setOptions,
  setAccentColor,
  setMusicData,
  setPlayerActive,
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
    setPlayerActive(true);
    musicService.play({
      onSetFrequencyData: (frequencyData) =>
        setMusicData(() => ({
          frequencyData
        }))
    });
  }

  function stopMusic() {
    setPlayerActive(false);
    musicService.stop();
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
