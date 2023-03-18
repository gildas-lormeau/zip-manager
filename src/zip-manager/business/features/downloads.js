function getDownloadsFeatures({ setDownloads, util }) {
  function abortDownload(deletedDownload) {
    removeDownload(deletedDownload);
    util.abortDownload(deletedDownload.controller);
  }

  function removeDownload(deletedDownload) {
    setDownloads((downloads) =>
      downloads.filter((download) => download.id !== deletedDownload.id)
    );
  }

  return {
    removeDownload,
    abortDownload
  };
}

export default getDownloadsFeatures;
