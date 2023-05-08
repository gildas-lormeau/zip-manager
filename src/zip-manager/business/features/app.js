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
  function initAppFeatures() {
    util.setStyle(
      appStyleElement,
      constants.NO_ENTRIES_CUSTOM_PROPERTY_NAME,
      JSON.stringify(messages.NO_ENTRIES_LABEL)
    );
    util.setStyle(
      appStyleElement,
      constants.FOLDER_SEPARATOR_CUSTOM_PROPERTY_NAME,
      JSON.stringify(constants.FOLDER_SEPARATOR)
    );
    util.removeDocumentAttribute(constants.APP_LOADING_ATTRIBUTE_NAME);
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
    const classes = [constants.APP_CLASSNAME];
    if (hiddenInfobar) {
      classes.push(constants.INFOBAR_HIDDEN_CLASSNAME);
    }
    if (hiddenDownloadManager) {
      classes.push(constants.DOWNLOAD_MANAGER_HIDDEN_CLASSNAME);
    }
    return classes.join(" ");
  }

  function onAppKeyUp(event) {
    if (!event.altKey && !modifierKeyPressed(event) && !event.shiftKey) {
      if (event.key === constants.ACTION_KEY && !disabledEnterEntry) {
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
