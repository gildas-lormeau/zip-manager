function getEffects({
  zipFilesystem,
  entries,
  highlightedEntry,
  selectedFolder,
  previousSelectedFolder,
  setEntries,
  setSelectedFolder,
  setPreviousSelectedFolder,
  setHighlightedEntry,
  setClipboardData,
  setHistory,
  setHistoryIndex,
  getHighlightedEntryElement,
  handleKeyUp,
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
    setPreviousSelectedFolder(null);
    setHighlightedEntry(null);
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

  function updateDefaultHighlightedEntry() {
    if (
      (selectedFolder && previousSelectedFolder === selectedFolder.parent) ||
      (previousSelectedFolder &&
        previousSelectedFolder.parent === selectedFolder)
    ) {
      setPreviousSelectedFolder(null);
      setHighlightedEntry(previousSelectedFolder);
    } else if (!highlightedEntry || !entries.includes(highlightedEntry)) {
      setHighlightedEntry(entries[0]);
    }
  }

  function registerKeyUpHandler() {
    util.addKeyListener(handleKeyUp);
    return () => util.removeKeyListener(handleKeyUp);
  }

  return {
    updateSelectedFolder,
    updateZipFilesystem,
    updateHighlightedEntry,
    updateDefaultHighlightedEntry,
    registerKeyUpHandler
  };
}

export { getEffects };
