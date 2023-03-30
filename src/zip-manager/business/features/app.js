function getAppFeatures({
  dialogDisplayed,
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

  function moveBottomBar(deltaY) {
    setEntriesDeltaHeight(deltaY);
  }

  function resizeEntries(height) {
    if (!dialogDisplayed) {
      setEntriesHeight(height);
    }
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
    moveBottomBar,
    resizeEntries,
    stopResizeEntries
  };
}

export default getAppFeatures;
