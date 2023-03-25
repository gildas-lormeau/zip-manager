function getFilesystemFeatures({
  zipService,
  setZipFilesystem,
  setResetDialogOpened
}) {
  function openConfirmReset() {
    setResetDialogOpened(true);
  }

  function reset() {
    setZipFilesystem(zipService.createZipFileSystem());
  }

  function closeConfirmReset() {
    setResetDialogOpened(false);
  }

  return {
    openConfirmReset,
    reset,
    closeConfirmReset
  };
}

export default getFilesystemFeatures;
