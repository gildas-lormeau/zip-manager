function getFilesystemFeatures({
  zipService,
  setZipFilesystem,
  setResetDialogOpened
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
