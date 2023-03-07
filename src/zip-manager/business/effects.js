function getEffects({
  zipFilesystem,
  setPreviousHighlightedEntry,
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
    setClipboardData(null);
    setHistory([root]);
    setHistoryIndex(0);
    updateSelectedFolder(root);
  }

  function updateHighlightedEntry() {
    const highlightedEntryElement = getHighlightedEntryElement();
    if (highlightedEntryElement) {
      util.highlight(highlightedEntryElement);
    }
  }

  return {
    updateZipFilesystem,
    updateHighlightedEntry
  };
}

export { getEffects };
