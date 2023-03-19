function getAppFeatures({
  entriesHeight,
  entriesDeltaHeight,
  setExportPassword,
  setEntriesHeight,
  setEntriesDeltaHeight,
  goIntoFolder,
  download,
  util,
  constants,
  messages
}) {
  const { ENTER_PASSWORD_MESSAGE } = messages;
  function enter(entry) {
    if (entry.directory) {
      goIntoFolder(entry);
    } else {
      download(entry);
    }
  }

  function setZipPassword() {
    const password = util.prompt(ENTER_PASSWORD_MESSAGE);
    setExportPassword(password);
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
    setEntriesHeight(entriesHeight + entriesDeltaHeight);
    setEntriesDeltaHeight(0);
  }

  return {
    enter,
    setZipPassword,
    saveAccentColor,
    restoreAccentColor,
    resizeEntries,
    stopResizeEntries
  };
}

export default getAppFeatures;
