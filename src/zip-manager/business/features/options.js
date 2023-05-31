function getOptionsFeatures({
  dialogs,
  setDialogs,
  setTheme,
  zipService,
  storageService,
  stylesheetService,
  environmentService,
  themeService,
  constants
}) {
  const { DEFAULT_OPTIONS, OPTIONS_KEY_NAME, FONT_SIZE_PROPERTY_NAME } =
    constants;

  function initOptionsFeatures() {
    applyOptions(getOptions());
  }

  function applyOptions(options) {
    configureZipService(options);
    configureZoomFactor(options);
    configureTheme(options);
  }

  function openOptions() {
    setDialogs({
      ...dialogs,
      options: getOptions()
    });
  }

  function closeOptions() {
    setDialogs({
      ...dialogs,
      options: null
    });
  }

  function resetOptions() {
    const options = { ...DEFAULT_OPTIONS };
    options.maxWorkers = environmentService.getMaximumWorkers();
    setDialogs({
      ...dialogs,
      options
    });
  }

  function setOptions(options) {
    const previousOptions = getOptions();
    options = { ...previousOptions, ...options };
    applyOptions(options);
    storageService.set(OPTIONS_KEY_NAME, options);
  }

  function getOptions() {
    let options = storageService.get(OPTIONS_KEY_NAME);
    if (!options) {
      options = { ...DEFAULT_OPTIONS };
      options.maxWorkers = environmentService.getMaximumWorkers();
    }
    if (options.hideNavigationBar === undefined) {
      options.hideNavigationBar = DEFAULT_OPTIONS.hideNavigationBar;
    }
    if (options.hideDownloadManager === undefined) {
      options.hideDownloadManager = DEFAULT_OPTIONS.hideDownloadManager;
    }
    if (options.hideInfobar === undefined) {
      options.hideInfobar = DEFAULT_OPTIONS.hideInfobar;
    }
    if (options.promptForExportPassword === undefined) {
      options.promptForExportPassword = DEFAULT_OPTIONS.promptForExportPassword;
    }
    if (options.defaultExportPassword === undefined) {
      options.defaultExportPassword = DEFAULT_OPTIONS.defaultExportPassword;
    }
    if (options.checkSignature === undefined) {
      options.checkSignature = DEFAULT_OPTIONS.checkSignature;
    }
    if (options.accentColor === undefined) {
      options.accentColor = DEFAULT_OPTIONS.accentColor;
    }
    if (options.zoomFactor === undefined) {
      options.zoomFactor = DEFAULT_OPTIONS.zoomFactor;
    }
    if (options.skin === undefined) {
      options.skin = DEFAULT_OPTIONS.skin;
    }
    return options;
  }

  function configureZipService(options) {
    const { maxWorkers, chunkSize } = options;
    zipService.configure({
      maxWorkers,
      chunkSize
    });
  }

  function configureZoomFactor({ zoomFactor }) {
    stylesheetService.setStyle(
      FONT_SIZE_PROPERTY_NAME,
      zoomFactor / 100 + "rem"
    );
  }

  function configureTheme({ accentColor, skin }) {
    setTheme({ accentColor, skin });
    themeService.setTheme({ accentColor, skin });
  }

  return {
    initOptionsFeatures,
    getOptions,
    setOptions,
    openOptions,
    closeOptions,
    resetOptions
  };
}

export default getOptionsFeatures;
