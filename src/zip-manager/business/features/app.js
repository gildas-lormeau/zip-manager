function getAppFeatures({
  disabledEnterEntry,
  zipFilesystem,
  highlightedEntry,
  selectedFolder,
  hiddenInfobar,
  hiddenDownloadManager,
  setNavigation,
  setSelectedFolder,
  setHighlightedIds,
  setHistory,
  setClickedButtonName,
  goIntoFolder,
  openPromptExtract,
  refreshSelectedFolder,
  modifierKeyPressed,
  stylesheetService,
  documentService,
  i18nService,
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
    stylesheetService.setStyle(
      NO_ENTRIES_CUSTOM_PROPERTY_NAME,
      JSON.stringify(messages.NO_ENTRIES_LABEL)
    );
    stylesheetService.setStyle(
      FOLDER_SEPARATOR_CUSTOM_PROPERTY_NAME,
      JSON.stringify(FOLDER_SEPARATOR)
    );
    documentService.setDocumentLanguage(i18nService.getLanguageId());
    documentService.removeDocumentAttribute(APP_LOADING_ATTRIBUTE_NAME);
  }

  function updateZipFilesystem() {
    const { root } = zipFilesystem;
    setSelectedFolder(root);
    setHighlightedIds([]);
    setNavigation({
      previousHighlight: null,
      direction: 0
    });
    setHistory({ path: [root], index: 0 });
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
