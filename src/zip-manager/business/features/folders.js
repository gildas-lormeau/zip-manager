function getFoldersFeatures({
  history,
  historyIndex,
  selectedFolder,
  setSelectedFolder,
  setHistory,
  setHistoryIndex,
  setHighlightedIds,
  updateSelectedFolder
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
    setHighlightedIds([selectedFolder.id]);
    setSelectedFolder(entry);
    updateSelectedFolder(entry);
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
    setHighlightedIds([selectedFolder.id]);
    setSelectedFolder(entry);
    updateSelectedFolder(entry);
  }

  return {
    goIntoFolder,
    navigateBack,
    navigateForward
  };
}

export default getFoldersFeatures;
