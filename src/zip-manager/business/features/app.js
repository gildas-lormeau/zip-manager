function getAppFeatures({
  setExportPassword,
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

  function getAccentColor() {
    return util.restoreAccentColor(constants.DEFAULT_ACCENT_COLOR);
  }

  return { enter, setZipPassword, saveAccentColor, getAccentColor };
}

export default getAppFeatures;
