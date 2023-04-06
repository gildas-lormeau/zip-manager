function getUIState({
  entries,
  highlightedIds,
  selectedFolder,
  clipboardData,
  historyIndex,
  history,
  getOptions,
  exportZipDialog,
  extractDialog,
  renameDialog,
  createFolderDialog,
  deleteEntryDialog,
  resetDialog,
  errorMessageDialog,
  importPasswordDialog,
  optionsDialog,
  util
}) {
  const entriesEmpty = !entries.length;
  const parentFolderHighlighted =
    !highlightedIds.length ||
    (selectedFolder.parent &&
      highlightedIds.includes(selectedFolder.parent.id));
  const subFolderHighlighted = highlightedIds.find((id) => {
    const entry = selectedFolder.children.find((entry) => entry.id === id);
    if (entry) {
      return entry.directory;
    }
    return false;
  });
  const clipboardDataEmpty = !clipboardData;
  const disabledExportZip = entriesEmpty;
  const disabledReset = entriesEmpty;
  const disabledNavigation = entriesEmpty;
  const disabledBack = !historyIndex;
  const disabledForward = historyIndex === history.length - 1;
  const disabledCopy = parentFolderHighlighted;
  const disabledCut = parentFolderHighlighted;
  const disabledPaste = clipboardDataEmpty;
  const disabledResetClipboardData = clipboardDataEmpty;
  const disabledExtract =
    parentFolderHighlighted ||
    !highlightedIds.length ||
    (!util.savePickersSupported() && subFolderHighlighted);
  const disabledHighlightAll = entriesEmpty || highlightedIds.length === entries.length;
  const disabledRename = highlightedIds.length !== 1 || parentFolderHighlighted;
  const disabledDelete = parentFolderHighlighted;
  const disabledEnter = highlightedIds.length !== 1;
  const dialogDisplayed =
    exportZipDialog ||
    extractDialog ||
    renameDialog ||
    createFolderDialog ||
    deleteEntryDialog ||
    resetDialog ||
    errorMessageDialog ||
    importPasswordDialog ||
    optionsDialog;
  const options = getOptions();
  const hideDownloadManager = options.hideDownloadManager;
  const hideInfobar = options.hideInfobar;

  return {
    disabledExportZip,
    disabledReset,
    disabledNavigation,
    disabledBack,
    disabledForward,
    disabledCopy,
    disabledCut,
    disabledPaste,
    disabledResetClipboardData,
    disabledExtract,
    disabledHighlightAll,
    disabledRename,
    disabledDelete,
    disabledEnter,
    dialogDisplayed,
    hideDownloadManager,
    hideInfobar
  };
}

export default getUIState;
