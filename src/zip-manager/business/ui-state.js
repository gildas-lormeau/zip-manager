function getUIState({
  entries,
  highlightedIds,
  selectedFolder,
  clipboardData,
  history,
  dialogs,
  getOptions,
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
  const disabledBack = !history.index;
  const disabledForward = history.index === history.path.length - 1;
  const disabledCopy = parentFolderHighlighted;
  const disabledCut = parentFolderHighlighted;
  const disabledPaste =
    clipboardDataEmpty ||
    (clipboardData.cut &&
      clipboardData.entries.find(
        (entry) =>
          selectedFolder == entry || selectedFolder.isDescendantOf(entry)
      ));
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
  const disabledEnterEntry = highlightedIds.length !== 1;
  const dialogDisplayed =
    dialogs.exportZip ||
    dialogs.extract ||
    dialogs.rename ||
    dialogs.createFolder ||
    dialogs.deleteEntries ||
    dialogs.reset ||
    dialogs.displayError ||
    dialogs.enterImportPassword ||
    dialogs.chooseAction ||
    dialogs.options;
  const options = getOptions();
  const hiddenNavigationBar = options.hideNavigationBar;
  const hiddenDownloadManager = options.hideDownloadManager;
  const hiddenInfobar = options.hideInfobar;
  const hiddenExportPassword = !options.promptForExportPassword;
  const highlightedEntries =
    (selectedFolder &&
      selectedFolder.children.filter((entry) =>
        highlightedIds.includes(entry.id)
      )) ||
    [];
  const highlightedEntry =
    highlightedIds.length === 1 &&
    selectedFolder &&
    selectedFolder.children.find((entry) => entry.id === highlightedIds[0]);
  const ancestorFolders = getAncestors(selectedFolder);

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
    disabledEnterEntry,
    dialogDisplayed,
    hiddenNavigationBar,
    hiddenDownloadManager,
    hiddenInfobar,
    hiddenExportPassword,
    highlightedEntries,
    highlightedEntry,
    selectedFolderEntries,
    ancestorFolders
  };
}

function getAncestors(folder) {
  const ancestors = [];
  while (folder && folder.parent) {
    ancestors.unshift(folder);
    folder = folder.parent;
  }
  if (folder) {
    ancestors.unshift(folder);
  }
  return ancestors;
}

export default getUIState;
