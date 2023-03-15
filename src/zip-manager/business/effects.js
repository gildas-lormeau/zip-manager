function getEffects({
  zipFilesystem,
  setPassword,
  setPreviousHighlightedEntry,
  setToggleNavigationDirection,
  setSelectedFolder,
  setHighlightedIds,
  setClipboardData,
  setHistory,
  setHistoryIndex,
  getHighlightedEntryElement,
  updateSelectedFolder,
  util
}) {
  function updateZipFilesystem() {
    const { root } = zipFilesystem;
    setSelectedFolder(root);
    setHighlightedIds([]);
    setPreviousHighlightedEntry(null);
    setToggleNavigationDirection(0);
    setClipboardData(null);
    setHistory([root]);
    setHistoryIndex(0);
    setPassword("");
    updateSelectedFolder(root);
  }

  function updateHighlightedEntries() {
    const highlightedEntryElement = getHighlightedEntryElement();
    if (highlightedEntryElement) {
      util.highlight(highlightedEntryElement);
    }
  }

  return {
    updateZipFilesystem,
    updateHighlightedEntries
  };
}

export default getEffects;
