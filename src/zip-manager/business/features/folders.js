function getFoldersFeatures({
  disabledBack,
  disabledForward,
  history,
  historyIndex,
  highlightedEntry,
  highlightedEntries,
  selectedFolder,
  setSelectedFolder,
  setEntries,
  setHistory,
  setHistoryIndex,
  setHighlightedIds,
  setClickedButtonName,
  modifierKeyPressed,
  constants
}) {
  const {
    LEFT_KEY,
    RIGHT_KEY,
    BACK_KEY,
    FORWARD_KEY,
    BACK_BUTTON_NAME,
    FORWARD_BUTTON_NAME
  } = constants;

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

  function updateHistoryData() {
    let offsetIndex = 0;
    let previousEntry;
    const newHistory = history.filter((entry, indexEntry) => {
      const entryRemoved =
        previousEntry === entry ||
        highlightedEntries.includes(entry) ||
        highlightedEntries.find((highlightedEntry) =>
          entry.isDescendantOf(highlightedEntry)
        );
      if (entryRemoved) {
        if (indexEntry <= historyIndex) {
          offsetIndex++;
        }
      } else {
        previousEntry = entry;
      }
      return !entryRemoved;
    });
    const newHistoryIndex = historyIndex - offsetIndex;
    setHistory(newHistory);
    setHistoryIndex(newHistoryIndex);
  }

  function refreshSelectedFolder(folder = selectedFolder) {
    if (folder) {
      const { parent, children } = folder;
      const folders = filterChildren(children, true);
      const files = filterChildren(children, false);
      const ancestors = [];
      if (parent) {
        ancestors.push(parent);
      }
      setEntries([...ancestors, ...folders, ...files]);
    }
  }

  function filterChildren(children, isDirectory) {
    return children
      .filter((child) => Boolean(child.directory) === isDirectory)
      .sort((previousChild, nextChild) =>
        previousChild.name.localeCompare(nextChild.name)
      );
  }

  function onFoldersKeyUp(event) {
    if (event.altKey) {
      if (event.key === BACK_KEY && !disabledBack) {
        setClickedButtonName(BACK_BUTTON_NAME);
      }
      if (event.key === FORWARD_KEY && !disabledForward) {
        setClickedButtonName(FORWARD_BUTTON_NAME);
      }
    }
    if (!event.altKey && !modifierKeyPressed(event) && !event.shiftKey) {
      if (event.key === LEFT_KEY && selectedFolder.parent) {
        goIntoFolder(selectedFolder.parent);
      }
      if (
        event.key === RIGHT_KEY &&
        highlightedEntry &&
        highlightedEntry.directory
      ) {
        goIntoFolder(highlightedEntry);
      }
    }
  }

  return {
    goIntoFolder,
    navigateBack,
    navigateForward,
    refreshSelectedFolder,
    updateHistoryData,
    onFoldersKeyUp
  };
}

export default getFoldersFeatures;
