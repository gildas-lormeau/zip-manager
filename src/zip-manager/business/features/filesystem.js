function getFilesystemFeatures({
  zipService,
  setZipFilesystem,
  setResetDialog
}) {
  function openConfirmReset() {
    setResetDialog({ opened: true });
  }

  function reset() {
    setZipFilesystem(zipService.createZipFileSystem());
  }

  function closeConfirmReset() {
    setResetDialog({ opened: false });
  }

  return {
    openConfirmReset,
    reset,
    closeConfirmReset
  };
}

export default getFilesystemFeatures;
