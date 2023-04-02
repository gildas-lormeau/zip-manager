function getAppFeatures({
  storageService,
  dialogDisplayed,
  entriesHeight,
  entriesDeltaHeight,
  setEntriesHeight,
  setEntriesDeltaHeight,
  getEntriesElementHeight,
  setOptionsDialog,
  getOptions,
  goIntoFolder,
  openPromptExtract,
  util,
  constants
}) {
  function enter(entry) {
    if (entry.directory) {
      goIntoFolder(entry);
    } else {
      openPromptExtract(entry);
    }
  }

  function saveAccentColor(color) {
    util.setStyleProperty(constants.ACCENT_COLOR_CUSTOM_PROPERTY_NAME, color);
    storageService.set(constants.ACCENT_COLOR_KEY_NAME, color);
  }

  function restoreAccentColor() {
    return (
      storageService.get(constants.ACCENT_COLOR_KEY_NAME) ||
      constants.DEFAULT_ACCENT_COLOR
    );
  }

  function moveBottomBar(deltaY) {
    setEntriesDeltaHeight(deltaY);
  }

  function resizeEntries(height) {
    if (!dialogDisplayed) {
      setEntriesHeight(height);
    }
  }

  function stopResizeEntries() {
    const entriesElementHeight = getEntriesElementHeight();
    setEntriesHeight(
      Math.max(
        Math.min(entriesHeight + entriesDeltaHeight, entriesElementHeight),
        entriesElementHeight
      )
    );
    setEntriesDeltaHeight(0);
  }

  function openOptions() {
    setOptionsDialog(getOptions());
  }

  function closeOptions() {
    setOptionsDialog(null);
  }

  function resetOptions() {
    const options = constants.DEFAULT_OPTIONS;
    options.maxWorkers = util.getDefaultMaxWorkers();
    setOptionsDialog(options);
  }

  return {
    enter,
    openOptions,
    closeOptions,
    resetOptions,
    saveAccentColor,
    restoreAccentColor,
    moveBottomBar,
    resizeEntries,
    stopResizeEntries
  };
}

export default getAppFeatures;
