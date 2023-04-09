function getAppFeatures({
  zipFilesystem,
  dialogDisplayed,
  entriesHeight,
  entriesDeltaHeight,
  selectedFolderInit,
  setPreviousHighlight,
  setToggleNavigationDirection,
  setSelectedFolder,
  setHighlightedIds,
  setClipboardData,
  setHistory,
  setHistoryIndex,
  setAccentColor,
  setEntriesHeight,
  setEntriesDeltaHeight,
  setSelectedFolderInit,
  getEntriesElementHeight,
  setOptionsDialog,
  getOptions,
  goIntoFolder,
  openPromptExtract,
  addFiles,
  importZipFile,
  refreshSelectedFolder,
  storageService,
  util,
  constants
}) {
  function initApplication() {
    const accentColor = restoreAccentColor();
    setAccentColor(accentColor);
    saveAccentColor(accentColor);
  }

  function restoreAccentColor() {
    return (
      storageService.get(constants.ACCENT_COLOR_KEY_NAME) ||
      constants.DEFAULT_ACCENT_COLOR
    );
  }

  function initSelectedFolder() {
    async function initSelectedFolder() {
      const locationSearch = util.getLocationSearch();
      if (locationSearch) {
        util.resetLocationSearch();
        if (locationSearch === constants.SHARED_FILES_PARAMETER) {
          const response = await util.fetch("." + constants.SHARED_FILES_PATH);
          const formData = await response.formData();
          addFiles(formData.getAll(constants.SHARED_FILES_FIELD_NAME));
        }
      }
    }

    if (!selectedFolderInit) {
      util.setLaunchQueueConsumer((launchParams) => {
        async function handleLaunchParams() {
          if (launchParams.files.length) {
            await Promise.all(
              launchParams.files.map(async (handle) =>
                importZipFile(await handle.getFile())
              )
            );
          }
        }

        handleLaunchParams();
      });
      setSelectedFolderInit(true);
    }
    initSelectedFolder();
  }

  function initZipFilesystem() {
    const { root } = zipFilesystem;
    setSelectedFolder(root);
    setHighlightedIds([]);
    setPreviousHighlight(null);
    setToggleNavigationDirection(0);
    setClipboardData(null);
    setHistory([root]);
    setHistoryIndex(0);
    refreshSelectedFolder(root);
  }

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
    const options = { ...constants.DEFAULT_OPTIONS };
    options.maxWorkers = util.getDefaultMaxWorkers();
    setOptionsDialog(options);
  }

  return {
    initApplication,
    initZipFilesystem,
    initSelectedFolder,
    enter,
    openOptions,
    closeOptions,
    resetOptions,
    saveAccentColor,
    moveBottomBar,
    resizeEntries,
    stopResizeEntries
  };
}

export default getAppFeatures;
