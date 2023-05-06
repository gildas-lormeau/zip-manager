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
  filesystemService
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
  const selectedFolderEntries = entries.filter(
    (entry) => entry !== selectedFolder.parent
  );
  const disabledExportZip = entriesEmpty || !selectedFolderEntries.length;
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
    (!filesystemService.savePickersSupported() && subFolderHighlighted);
  const disabledHighlightAll =
    !selectedFolder ||
    !selectedFolderEntries.length ||
    (selectedFolderEntries.length === highlightedIds.length &&
      selectedFolderEntries.every((entry) =>
        highlightedIds.includes(entry.id)
      ));
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
  const hiddenNavigationBar = options.hideNavigationBar;
  const hiddenDownloadManager = options.hideDownloadManager;
  const hiddenInfobar = options.hideInfobar;
  const hiddenExportPassword = !options.promptForExportPassword;
  const highlightedEntries = selectedFolder
    ? selectedFolder.children.filter((entry) => highlightedIds.includes(entry.id))
    : [];
  const highlightedEntry =
    highlightedIds.length === 1 &&
    selectedFolder &&
    selectedFolder.children.find((entry) => entry.id === highlightedIds[0]);

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
    hiddenNavigationBar,
    hiddenDownloadManager,
    hiddenInfobar,
    hiddenExportPassword,
    highlightedEntries,
    highlightedEntry,
    selectedFolderEntries
  };
}

export default getUIState;
