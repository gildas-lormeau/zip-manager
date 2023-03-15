function getAppHandlers({
  setPassword,
  goIntoFolder,
  download,
  util,
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
    setPassword(password);
  }

  return { enter, setZipPassword };
}

export default getAppHandlers;
