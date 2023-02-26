function getEntriesNavigationHandlers({
  entries,
  highlightedEntry,
  entriesHeight,
  setHighlightedEntry
}) {
  function highlightPreviousEntry() {
    const indexEntry = getEntryIndex();
    const previousEntry =
      entries[(indexEntry - 1 + entries.length) % entries.length];
    setHighlightedEntry(previousEntry);
  }

  function highlightNextEntry() {
    const indexEntry = getEntryIndex();
    const nextEntry = entries[(indexEntry + 1) % entries.length];
    setHighlightedEntry(nextEntry);
  }

  function highlightPreviousPageEntry() {
    const indexEntry = getEntryIndex();
    const previousEntry =
      entries[Math.max(indexEntry - entriesHeight.current, 0)];
    setHighlightedEntry(previousEntry);
  }

  function highlightNextPageEntry() {
    const indexEntry = getEntryIndex();
    const previousEntry =
      entries[Math.min(indexEntry + entriesHeight.current, entries.length - 1)];
    setHighlightedEntry(previousEntry);
  }

  function highlightFirstEntry() {
    setHighlightedEntry(entries[0]);
  }

  function highlightLastEntry() {
    setHighlightedEntry(entries[entries.length - 1]);
  }

  function highlightEntry(entry) {
    setHighlightedEntry(entry);
  }

  function getEntryIndex() {
    return entries.findIndex((entry) => entry === highlightedEntry);
  }

  return {
    highlightPreviousEntry,
    highlightNextEntry,
    highlightPreviousPageEntry,
    highlightNextPageEntry,
    highlightFirstEntry,
    highlightLastEntry,
    highlightEntry
  };
}

function getFolderNavigationHandlers({
  history,
  historyIndex,
  selectedFolder,
  setSelectedFolder,
  setPreviousSelectedFolder,
  setHistory,
  setHistoryIndex
}) {
  function goIntoFolder(entry) {
    const newHistory = [...history];
    const newHistoryIndex = historyIndex + 1;
    newHistory.length = newHistoryIndex + 1;
    newHistory[newHistoryIndex] = entry;
    setHistory(newHistory);
    setHistoryIndex(newHistoryIndex);
    setSelectedFolders(entry);
  }

  function navigateHistoryBack() {
    navigateHistory(-1);
  }

  function navigateHistoryForward() {
    navigateHistory(1);
  }

  function navigateHistory(offset) {
    const newHistoryIndex = historyIndex + offset;
    setHistoryIndex(newHistoryIndex);
    const entry = history[newHistoryIndex];
    setSelectedFolders(entry);
  }

  function setSelectedFolders(entry) {
    setPreviousSelectedFolder(selectedFolder);
    setSelectedFolder(entry);
  }

  return {
    goIntoFolder,
    navigateHistoryBack,
    navigateHistoryForward
  };
}

function getHighlightedEntryHandlers({
  zipFilesystem,
  history,
  historyIndex,
  highlightedEntry,
  selectedFolder,
  clipboardData,
  setHistory,
  setHistoryIndex,
  setClipboardData,
  setHighlightedEntry,
  deleteDownloadEntry,
  updateSelectedFolder,
  downloadFile,
  util,
  constants,
  messages
}) {
  const { DEFAULT_MIME_TYPE } = constants;
  const { RENAME_MESSAGE, DELETE_MESSAGE } = messages;

  function copyEntry() {
    setClipboardData({
      entry: highlightedEntry.clone(true)
    });
  }

  function cutEntry() {
    setClipboardData({
      entry: highlightedEntry,
      cut: true
    });
  }

  function pasteEntry() {
    try {
      const { entry, cut } = clipboardData;
      let clone;
      if (!cut) {
        clone = entry.clone(true);
      }
      zipFilesystem.move(entry, selectedFolder);
      if (!cut) {
        setClipboardData({ entry: clone });
      }
      updateSelectedFolder();
    } catch (error) {
      util.alert(error.message);
    }
  }

  function renameEntry() {
    try {
      const entryName = util.prompt(RENAME_MESSAGE, highlightedEntry.name);
      if (entryName && entryName !== highlightedEntry.name) {
        highlightedEntry.rename(entryName);
        updateSelectedFolder();
      }
    } catch (error) {
      util.alert(error.message);
    }
  }

  function deleteEntry() {
    if (util.confirm(DELETE_MESSAGE)) {
      zipFilesystem.remove(highlightedEntry);
      updateHistoryData();
      setHighlightedEntry(null);
      updateSelectedFolder();
    }
  }

  function downloadEntry(entry) {
    downloadFile(entry.name, {}, async (download, options) => {
      const blob = await entry.getBlob(DEFAULT_MIME_TYPE, options);
      deleteDownloadEntry(download);
      return blob;
    });
  }

  function updateHistoryData() {
    let offsetIndex = 0;
    let previousEntry;
    const newHistory = history.filter((entry, indexEntry) => {
      const entryRemoved =
        previousEntry === entry ||
        entry === highlightedEntry ||
        entry.isDescendantOf(highlightedEntry);
      if (entryRemoved) {
        if (indexEntry <= historyIndex) {
          offsetIndex++;
        }
      } else {
        previousEntry = entry;
      }
      return !entryRemoved;
    });
    const newHistoryIndex = historyIndex - offsetIndex;
    setHistory(newHistory);
    setHistoryIndex(newHistoryIndex);
  }

  return {
    copyEntry,
    cutEntry,
    pasteEntry,
    renameEntry,
    deleteEntry,
    downloadEntry
  };
}

function getSelectedFolderHandlers({
  selectedFolder,
  updateSelectedFolder,
  deleteDownloadEntry,
  downloadFile,
  util,
  constants,
  messages
}) {
  const { DEFAULT_MIME_TYPE } = constants;
  const { ZIP_EXTENSION, ROOT_ZIP_FILENAME, CREATE_FOLDER_MESSAGE } = messages;

  function createFolder() {
    const folderName = util.prompt(CREATE_FOLDER_MESSAGE);
    if (folderName) {
      try {
        selectedFolder.addDirectory(folderName);
        updateSelectedFolder();
      } catch (error) {
        util.alert(error.message);
      }
    }
  }

  function addFiles(files) {
    files.forEach((file) => {
      try {
        return selectedFolder.addBlob(file.name, file);
      } catch (error) {
        util.alert(error.message);
      }
    });
    updateSelectedFolder();
  }

  function importZipFile(zipFile) {
    async function updateZipFile() {
      try {
        await selectedFolder.importBlob(zipFile);
      } catch (error) {
        util.alert(error.message);
      }
      updateSelectedFolder();
    }

    if (zipFile) {
      updateZipFile();
    }
  }

  function exportZipFile() {
    downloadFile(
      selectedFolder.name
        ? selectedFolder.name + ZIP_EXTENSION
        : ROOT_ZIP_FILENAME,
      { mimeType: DEFAULT_MIME_TYPE },
      async (download, options) => {
        const blob = await selectedFolder.exportBlob(options);
        deleteDownloadEntry(download);
        return blob;
      }
    );
  }

  return {
    createFolder,
    addFiles,
    importZipFile,
    exportZipFile
  };
}

function getDownloadHandlers({ setDownloads, constants }) {
  const { CANCELLED_DOWNLOAD_MESSAGE } = constants;
  function deleteDownloadEntry(deletedDownload) {
    setDownloads((downloads) =>
      downloads.filter((download) => download.id !== deletedDownload.id)
    );
    deletedDownload.controller.abort(CANCELLED_DOWNLOAD_MESSAGE);
  }

  return {
    deleteDownloadEntry
  };
}

function getZipFilesystemHandlers({
  createZipFileSystem,
  setZipFilesystem,
  util,
  messages
}) {
  const { RESET_MESSAGE } = messages;
  function reset() {
    if (util.confirm(RESET_MESSAGE)) {
      setZipFilesystem(createZipFileSystem());
    }
  }
  return {
    reset
  };
}

function getClipboardHandlers({ setClipboardData }) {
  function resetClipboardData() {
    setClipboardData(null);
  }

  return {
    resetClipboardData
  };
}

function getActionHandlers({ highlightedEntry, goIntoFolder, downloadEntry }) {
  function enterEntry(entry = highlightedEntry) {
    if (entry) {
      if (entry.directory) {
        goIntoFolder(entry);
      } else {
        downloadEntry(entry);
      }
    }
  }

  return { enterEntry };
}

export {
  getEntriesNavigationHandlers,
  getFolderNavigationHandlers,
  getHighlightedEntryHandlers,
  getSelectedFolderHandlers,
  getDownloadHandlers,
  getZipFilesystemHandlers,
  getClipboardHandlers,
  getActionHandlers
};
