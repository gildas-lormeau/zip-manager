function getFilesystemHandlers({
  zipService,
  setZipFilesystem,
  util,
  messages
}) {
  const { RESET_MESSAGE } = messages;
  function reset() {
    if (util.confirm(RESET_MESSAGE)) {
      setZipFilesystem(zipService.createZipFileSystem());
    }
  }
  return {
    reset
  };
}

export { getFilesystemHandlers };
