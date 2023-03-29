function getUIState({
  entries,
  highlightedIds,
  selectedFolder,
  clipboardData,
  historyIndex,
  history,
  exportZipDialog,
  extractDialog,
  renameDialog,
  createFolderDialog,
  deleteEntryDialog,
  resetDialog,
  errorMessageDialog,
  importPasswordDialog
}) {
  const entriesEmpty = !entries.length;
  const parentFolderHighlighted =
    !highlightedIds.length ||
    (selectedFolder.parent &&
      highlightedIds.includes(selectedFolder.parent.id));
  const clipboardDataEmpty = !clipboardData;
  const disabledExportZip = entriesEmpty;
  const disabledReset = entriesEmpty;
  const disabledBack = !historyIndex;
  const disabledForward = historyIndex === history.length - 1;
  const disabledCopy = parentFolderHighlighted;
  const disabledCut = parentFolderHighlighted;
  const disabledPaste = clipboardDataEmpty;
  const disabledResetClipboardData = clipboardDataEmpty;
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
    importPasswordDialog;

  return {
    disabledExportZip,
    disabledReset,
    disabledBack,
    disabledForward,
    disabledCopy,
    disabledCut,
    disabledPaste,
    disabledResetClipboardData,
    disabledRename,
    disabledDelete,
    disabledEnter,
    dialogDisplayed
  };
}

export default getUIState;
