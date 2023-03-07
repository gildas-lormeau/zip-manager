function getEffects({
  zipFilesystem,
  selectedFolder,
  setPreviousHighlightedEntry,
  setEntries,
  setSelectedFolder,
  setHighlightedIds,
  setClipboardData,
  setHistory,
  setHistoryIndex,
  getHighlightedEntryElement,
  util
}) {
  function updateSelectedFolder() {
    if (selectedFolder) {
      const { parent, children } = selectedFolder;
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

  function updateZipFilesystem() {
    const { root } = zipFilesystem;
    setSelectedFolder(root);
    setHighlightedIds([]);
    setPreviousHighlightedEntry(null);
    setClipboardData(null);
    setHistory([root]);
    setHistoryIndex(0);
    updateSelectedFolder();
  }

  function updateHighlightedEntry() {
    const highlightedEntryElement = getHighlightedEntryElement();
    if (highlightedEntryElement) {
      util.highlight(highlightedEntryElement);
    }
  }

  return {
    updateSelectedFolder,
    updateZipFilesystem,
    updateHighlightedEntry
  };
}

export { getEffects };
