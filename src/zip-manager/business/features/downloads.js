function getDownloadsFeatures({ setDownloads, downloadService }) {
  function abortDownload(deletedDownload) {
    removeDownload(deletedDownload);
    downloadService.abortDownload(deletedDownload.controller);
  }

  function removeDownload(deletedDownload) {
    setDownloads((downloads) => ({
      ...downloads,
      queue: downloads.queue.filter(
        (download) => download.id !== deletedDownload.id
      )
    }));
  }

  return {
    removeDownload,
    abortDownload
  };
}

export default getDownloadsFeatures;
