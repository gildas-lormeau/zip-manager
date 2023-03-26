function getFilesystemFeatures({
  zipService,
  setZipFilesystem,
  setResetDialog
}) {
  function openConfirmReset() {
    setResetDialog({});
  }

  function reset() {
    setZipFilesystem(zipService.createZipFileSystem());
  }

  function closeConfirmReset() {
    setResetDialog(null);
  }

  return {
    openConfirmReset,
    reset,
    closeConfirmReset
  };
}

export default getFilesystemFeatures;
