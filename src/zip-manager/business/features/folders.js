function getFoldersFeatures({
  history,
  historyIndex,
  selectedFolder,
  setSelectedFolder,
  setHistory,
  setHistoryIndex,
  setHighlightedIds,
  refreshSelectedFolder
}) {
  function goIntoFolder(entry) {
    const newHistory = [...history];
    const newHistoryIndex = historyIndex + 1;
    if (entry.isDescendantOf(selectedFolder)) {
      newHistory.length = newHistoryIndex + 1;
    }
    newHistory[newHistoryIndex] = entry;
    setHistory(newHistory);
    setHistoryIndex(newHistoryIndex);
    highlightEntry(selectedFolder, entry);
    setSelectedFolder(entry);
    refreshSelectedFolder(entry);
  }

  function navigateBack() {
    navigateHistory(-1);
  }

  function navigateForward() {
    navigateHistory(1);
  }

  function navigateHistory(offset) {
    const newHistoryIndex = historyIndex + offset;
    setHistoryIndex(newHistoryIndex);
    const entry = history[newHistoryIndex];
    highlightEntry(selectedFolder, entry);
    setSelectedFolder(entry);
    refreshSelectedFolder(entry);
  }

  function highlightEntry(selectedFolder, entry) {
    if (
      selectedFolder.children.includes(entry) ||
      entry.children.includes(selectedFolder)
    ) {
      setHighlightedIds([selectedFolder.id]);
    } else {
      const highlightedEntry = entry.children.find((child) =>
        selectedFolder.isDescendantOf(child)
      );
      setHighlightedIds(
        highlightedEntry ? [highlightedEntry.id] : [entry.parent.id]
      );
    }
  }

  return {
    goIntoFolder,
    navigateBack,
    navigateForward
  };
}

export default getFoldersFeatures;
