function getAppFeatures({
  zipFilesystem,
  appStyleElement,
  setPreviousHighlight,
  setToggleNavigationDirection,
  setSelectedFolder,
  setHighlightedIds,
  setHistory,
  setHistoryIndex,
  goIntoFolder,
  openPromptExtract,
  refreshSelectedFolder,
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

  return {
    enterEntry,
    initAppFeatures,
    updateZipFilesystem
  };
}

export default getAppFeatures;
