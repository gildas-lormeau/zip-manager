function getOptionsFeatures({
  appStyleElement,
  setOptionsDialog,
  zipService,
  storageService,
  util,
  constants
}) {
  function initOptionsFeatures() {
    const options = getOptions();
    configureZipService(options);
    configureZoomFactor(options);
  }

  function openOptions() {
    setOptionsDialog(getOptions());
  }

  function closeOptions() {
    setOptionsDialog(null);
  }

  function resetOptions() {
    const options = { ...constants.DEFAULT_OPTIONS };
    options.maxWorkers = util.getDefaultMaxWorkers();
    setOptionsDialog(options);
  }

  function setOptions(options) {
    const previousOptions = getOptions();
    options = { ...previousOptions, ...options };
    configureZipService(options);
    configureZoomFactor(options);
    storageService.set(constants.OPTIONS_KEY_NAME, options);
  }

  function getOptions() {
    const { DEFAULT_OPTIONS, OPTIONS_KEY_NAME } = constants;
    let options = storageService.get(OPTIONS_KEY_NAME);
    if (!options) {
      options = { ...DEFAULT_OPTIONS };
      options.maxWorkers = util.getDefaultMaxWorkers();
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
    return options;
  }

  function configureZipService(options) {
    const { maxWorkers, chunkSize } = options;
    zipService.configure({
      maxWorkers,
      chunkSize
    });
  }

  function configureZoomFactor(options) {
    const { zoomFactor } = options;
    util.setStyle(
      appStyleElement,
      constants.FONT_SIZE_CUSTOM_PROPERTY_NAME,
      zoomFactor / 100 + "em"
    );
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
