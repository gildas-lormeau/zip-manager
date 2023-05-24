function getMiscFeatures({
  theme,
  setOptions,
  setTheme,
  setMusicData,
  setPlayerActive,
  getOptions,
  stylesheetService,
  themeService,
  musicService,
  constants
}) {
  const { ACCENT_COLOR_CUSTOM_PROPERTY_NAME } = themeService;

  function initMiscFeatures() {
    const options = getOptions();
    const { accentColor, skin } = options;
    setTheme({ accentColor, skin });
  }

  function playMusic() {
    setPlayerActive(true);
    updateSkin();
    musicService.play({
      onSetFrequencyData: (frequencyData) => {
        setMusicData(() => ({
          frequencyData
        }));
      }
    });
  }

  function updateSkin() {
    if (theme.skin) {
      musicService.setFftSize(constants.FFT_RESOLUTIONS[theme.skin]);
    }
  }

  function stopMusic() {
    setPlayerActive(false);
    musicService.stop();
  }

  function updateAccentColor() {
    const { accentColor, skin } = theme;
    if (accentColor) {
      stylesheetService.setStyle(
        ACCENT_COLOR_CUSTOM_PROPERTY_NAME,
        theme.accentColor
      );
      themeService.setTheme({ accentColor, skin });
      const options = getOptions();
      setOptions({ ...options, accentColor });
    }
  }

  return {
    playMusic,
    stopMusic,
    updateAccentColor,
    updateSkin,
    initMiscFeatures
  };
}

export default getMiscFeatures;
