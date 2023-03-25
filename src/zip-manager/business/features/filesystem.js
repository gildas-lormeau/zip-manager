function getFilesystemFeatures({
  zipService,
  setZipFilesystem,
  setResetDialogOpened,
  util,
  messages
}) {
  function confirmReset() {
    setResetDialogOpened(true);
  }

  function reset() {
    setZipFilesystem(zipService.createZipFileSystem());
  }

  return {
    confirmReset,
    reset
  };
}

export default getFilesystemFeatures;
