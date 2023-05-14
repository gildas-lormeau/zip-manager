function getAppFeatures({
  disabledEnterEntry,
  zipFilesystem,
  highlightedEntry,
  selectedFolder,
  appStyleElement,
  hiddenInfobar,
  hiddenDownloadManager,
  setPreviousHighlight,
  setToggleNavigationDirection,
  setSelectedFolder,
  setHighlightedIds,
  setHistory,
  setHistoryIndex,
  setClickedButtonName,
  goIntoFolder,
  openPromptExtract,
  refreshSelectedFolder,
  modifierKeyPressed,
  util,
  constants,
  messages
}) {
  const {
    NO_ENTRIES_CUSTOM_PROPERTY_NAME,
    FOLDER_SEPARATOR_CUSTOM_PROPERTY_NAME,
    FOLDER_SEPARATOR,
    APP_LOADING_ATTRIBUTE_NAME,
    APP_CLASSNAME,
    INFOBAR_HIDDEN_CLASSNAME,
    DOWNLOAD_MANAGER_HIDDEN_CLASSNAME,
    ACTION_KEY
  } = constants;

  function initAppFeatures() {
    util.setStyle(
      appStyleElement,
      NO_ENTRIES_CUSTOM_PROPERTY_NAME,
      JSON.stringify(messages.NO_ENTRIES_LABEL)
    );
    util.setStyle(
      appStyleElement,
      FOLDER_SEPARATOR_CUSTOM_PROPERTY_NAME,
      JSON.stringify(FOLDER_SEPARATOR)
    );
    util.removeDocumentAttribute(APP_LOADING_ATTRIBUTE_NAME);
  }

  function updateZipFilesystem() {
    const { root } = zipFilesystem;
    setSelectedFolder(root);
    setHighlightedIds([]);
    setPreviousHighlight(null);
    setToggleNavigationDirection(0);
    setHistory([root]);
    setHistoryIndex(0);
    refreshSelectedFolder(root);
  }

  function enterEntry(entry) {
    if (entry.directory) {
      goIntoFolder(entry);
    } else {
      openPromptExtract(entry);
    }
  }

  function resetClickedButtonName() {
    setClickedButtonName(null);
  }

  function getAppClassName() {
    const classes = [APP_CLASSNAME];
    if (hiddenInfobar) {
      classes.push(INFOBAR_HIDDEN_CLASSNAME);
    }
    if (hiddenDownloadManager) {
      classes.push(DOWNLOAD_MANAGER_HIDDEN_CLASSNAME);
    }
    return classes.join(" ");
  }

  function onAppKeyUp(event) {
    if (!event.altKey && !modifierKeyPressed(event) && !event.shiftKey) {
      if (event.key === ACTION_KEY && !disabledEnterEntry) {
        enterEntry(highlightedEntry || selectedFolder.parent);
        event.preventDefault();
      }
    }
  }

  return {
    enterEntry,
    initAppFeatures,
    updateZipFilesystem,
    resetClickedButtonName,
    getAppClassName,
    onAppKeyUp
  };
}

export default getAppFeatures;
