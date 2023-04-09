function getEffects({
  selectedFolder,
  accentColor,
  setColorScheme,
  getHighlightedEntryElement,
  initApplication,
  initZipFilesystem,
  initSelectedFolder,
  saveAccentColor,
  util
}) {
  function updateApplication() {
    initApplication();
  }

  function updateSelectedFolder() {
    if (selectedFolder) {
      initSelectedFolder();
    }
  }

  function updateZipFilesystem() {
    initZipFilesystem();
  }

  function updateHighlightedEntries() {
    const highlightedEntryElement = getHighlightedEntryElement();
    if (highlightedEntryElement) {
      util.scrollIntoView(highlightedEntryElement);
    }
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
    updateApplication,
    updateSelectedFolder,
    updateZipFilesystem,
    updateHighlightedEntries,
    updateAccentColor
  };
}

export default getEffects;
