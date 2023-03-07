function getUIState({
  entries,
  highlightedIds,
  selectedFolder,
  clipboardData,
  historyIndex,
  history,
  util,
  constants
}) {
  const entriesEmpty = !entries.length;
  const actionDisabled =
    !highlightedIds.length ||
    (selectedFolder.parent &&
      highlightedIds.includes(selectedFolder.parent.id));
  const clipboardDataEmpty = !clipboardData;
  const disabledExportZip = entriesEmpty;
  const disabledReset = entriesEmpty;
  const disabledBack = !historyIndex;
  const disabledForward = historyIndex === history.length - 1;
  const disabledCopy = actionDisabled;
  const disabledCut = actionDisabled;
  const disabledPaste = clipboardDataEmpty;
  const disabledResetClipboardData = clipboardDataEmpty;
  const disabledRename = highlightedIds.length !== 1 || actionDisabled;
  const disabledDelete = actionDisabled;
  const disabledEnter = highlightedIds.length !== 1;
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
    disabledEnter,
    accentColor
  };
}

export { getUIState };
