import { addEventListener, removeEventListener } from "./util/util.js";
import { KEYUP_EVENT_NAME } from "./constants.js";

function getEffects({
  zipFilesystem,
  entries,
  highlightedEntry,
  highlightedEntryRef,
  selectedFolder,
  previousSelectedFolder,
  setEntries,
  setSelectedFolder,
  setPreviousSelectedFolder,
  setHighlightedEntry,
  setClipboardData,
  setHistory,
  setHistoryIndex,
  handleKeyUp
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
    setEntries([...root.children]);
  }

  function updateHighlightedEntry() {
    if (
      highlightedEntry &&
      highlightedEntryRef &&
      highlightedEntryRef.current
    ) {
      highlightedEntryRef.current.focus();
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
    addEventListener(KEYUP_EVENT_NAME, handleKeyUp);
    return () => removeEventListener(KEYUP_EVENT_NAME, handleKeyUp);
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
