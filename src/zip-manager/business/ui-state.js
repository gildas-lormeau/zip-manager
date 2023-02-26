function getUIState({
  entries,
  highlightedEntry,
  selectedFolder,
  clipboardData,
  historyIndex,
  history
}) {
  const entriesEmpty = !entries.length;
  const actionDisabled =
    !highlightedEntry || highlightedEntry === selectedFolder.parent;
  const clipboardDataEmpty = !clipboardData;
  const disabledExportZip = entriesEmpty;
  const disabledReset = entriesEmpty;
  const disabledHistoryBack = !historyIndex;
  const disabledHistoryForward = historyIndex === history.length - 1;
  const disabledCopyEntry = actionDisabled;
  const disabledCutEntry = actionDisabled;
  const disabledPasteEntry = clipboardDataEmpty;
  const disabledResetClipboardData = clipboardDataEmpty;
  const disabledRenameEntry = actionDisabled;
  const disabledDeleteEntry = actionDisabled;

  return {
    disabledExportZip,
    disabledReset,
    disabledHistoryBack,
    disabledHistoryForward,
    disabledCopyEntry,
    disabledCutEntry,
    disabledPasteEntry,
    disabledResetClipboardData,
    disabledRenameEntry,
    disabledDeleteEntry
  };
}

export { getUIState };
