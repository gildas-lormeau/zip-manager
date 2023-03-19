function getEffects({
  zipFilesystem,
  accentColor,
  setAccentColor,
  setColorScheme,
  setExportPassword,
  setImportPassword,
  setPreviousHighlightedEntry,
  setToggleNavigationDirection,
  setSelectedFolder,
  setHighlightedIds,
  setClipboardData,
  setHistory,
  setHistoryIndex,
  getHighlightedEntryElement,
  updateSelectedFolder,
  restoreAccentColor,
  saveAccentColor,
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
    setExportPassword("");
    setImportPassword("");
    updateSelectedFolder(root);
  }

  function updateHighlightedEntries() {
    const highlightedEntryElement = getHighlightedEntryElement();
    if (highlightedEntryElement) {
      util.highlight(highlightedEntryElement);
    }
  }

  function initAccentColor() {
    const accentColor = restoreAccentColor();
    setAccentColor(accentColor);
    saveAccentColor(accentColor);
  }

  function updateAccentColor() {
    if (accentColor) {
      const brightNessAccentColor = getBrightNess(accentColor);
      if (brightNessAccentColor > 192) {
        setColorScheme("dark");
      } else if (brightNessAccentColor < 64) {
        setColorScheme("light");
      } else {
        setColorScheme("");
      }
      saveAccentColor(accentColor);
    }
  }

  function getBrightNess(color) {
    const red = parseInt(color.substring(1, 3), 16);
    const green = parseInt(color.substring(3, 5), 16);
    const blue = parseInt(color.substring(5, 7), 16);
    // cf. https://www.w3.org/TR/AERT/#color-contrast
    return Math.round((red * 299 + green * 587 + blue * 114) / 1000);
  }

  return {
    updateZipFilesystem,
    updateHighlightedEntries,
    initAccentColor,
    updateAccentColor
  };
}

export default getEffects;
