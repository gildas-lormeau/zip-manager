function getUIState({
  entries,
  highlightedEntry,
  selectedFolder,
  clipboardData,
  historyIndex,
  history,
  util,
  constants
}) {
  const entriesEmpty = !entries.length;
  const actionDisabled =
    !highlightedEntry || highlightedEntry === selectedFolder.parent;
  const clipboardDataEmpty = !clipboardData;
  const disabledExportZip = entriesEmpty;
  const disabledReset = entriesEmpty;
  const disabledBack = !historyIndex;
  const disabledForward = historyIndex === history.length - 1;
  const disabledCopy = actionDisabled;
  const disabledCut = actionDisabled;
  const disabledPaste = clipboardDataEmpty;
  const disabledResetClipboardData = clipboardDataEmpty;
  const disabledRename = actionDisabled;
  const disabledDelete = actionDisabled;
  const disabledGoIntoParentFolder = !selectedFolder || !selectedFolder.parent;
  const disabledGoIntoChildFolder =
    !highlightedEntry ||
    !highlightedEntry.directory ||
    highlightedEntry === selectedFolder.parent;
  const disabledEnter = !highlightedEntry;
  const accentColor = util.getAccentColor(constants.DEFAULT_ACCENT_COLOR);

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
    disabledGoIntoParentFolder,
    disabledGoIntoChildFolder,
    disabledEnter,
    accentColor
  };
}

export { getUIState };
