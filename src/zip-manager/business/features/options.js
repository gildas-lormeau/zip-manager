function getOptionsFeatures({
  setOptionsDialog,
  zipService,
  storageService,
  util,
  constants
}) {
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
    storageService.set(constants.OPTIONS_KEY_NAME, options);
  }

  function getOptions() {
    const { DEFAULT_OPTIONS, OPTIONS_KEY_NAME } = constants;
    let previousOptions = storageService.get(OPTIONS_KEY_NAME);
    if (!previousOptions) {
      previousOptions = { ...DEFAULT_OPTIONS };
      previousOptions.maxWorkers = util.getDefaultMaxWorkers();
    }
    if (previousOptions.hideNavigationBar === undefined) {
      previousOptions.hideNavigationBar = DEFAULT_OPTIONS.hideNavigationBar;
    }
    if (previousOptions.hideDownloadManager === undefined) {
      previousOptions.hideDownloadManager = DEFAULT_OPTIONS.hideDownloadManager;
    }
    if (previousOptions.hideInfobar === undefined) {
      previousOptions.hideInfobar = DEFAULT_OPTIONS.hideInfobar;
    }
    if (previousOptions.promptForExportPassword === undefined) {
      previousOptions.promptForExportPassword =
        DEFAULT_OPTIONS.promptForExportPassword;
    }
    if (previousOptions.defaultExportPassword === undefined) {
      previousOptions.defaultExportPassword =
        DEFAULT_OPTIONS.defaultExportPassword;
    }
    if (previousOptions.checkSignature === undefined) {
      previousOptions.checkSignature = DEFAULT_OPTIONS.checkSignature;
    }
    if (previousOptions.accentColor === undefined) {
      previousOptions.accentColor = DEFAULT_OPTIONS.accentColor;
    }
    configureZipService(previousOptions);
    return previousOptions;
  }

  function configureZipService(options) {
    const { maxWorkers, chunkSize } = options;
    zipService.configure({
      maxWorkers,
      chunkSize
    });
  }

  return {
    getOptions,
    setOptions,
    openOptions,
    closeOptions,
    resetOptions
  };
}

export default getOptionsFeatures;
