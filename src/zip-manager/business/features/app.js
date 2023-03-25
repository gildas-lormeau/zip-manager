function getAppFeatures({
  entriesHeight,
  entriesDeltaHeight,
  setEntriesHeight,
  setEntriesDeltaHeight,
  getEntriesElementHeight,
  goIntoFolder,
  openPromptExtract,
  util,
  constants
}) {
  function enter(entry) {
    if (entry.directory) {
      goIntoFolder(entry);
    } else {
      openPromptExtract(entry);
    }
  }

  function saveAccentColor(color) {
    util.saveAccentColor(color);
  }

  function restoreAccentColor() {
    return util.restoreAccentColor(constants.DEFAULT_ACCENT_COLOR);
  }

  function resizeEntries(deltaY) {
    setEntriesDeltaHeight(deltaY);
  }

  function stopResizeEntries() {
    const entriesElementHeight = getEntriesElementHeight();
    setEntriesHeight(
      Math.max(
        Math.min(entriesHeight + entriesDeltaHeight, entriesElementHeight),
        entriesElementHeight
      )
    );
    setEntriesDeltaHeight(0);
  }

  return {
    enter,
    saveAccentColor,
    restoreAccentColor,
    resizeEntries,
    stopResizeEntries
  };
}

export default getAppFeatures;
