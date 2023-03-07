function getEntriesNavigationHandlers({
  entries,
  previousHighlightedEntry,
  highlightedIds,
  toggleNavigationDirection,
  getEntriesHeight,
  setHighlightedIds,
  setPreviousHighlightedEntry,
  setToggleNavigationDirection
}) {
  function highlightPrevious() {
    const indexEntry = getHighlightedEntryIndex();
    const previousEntry =
      entries[(indexEntry - 1 + entries.length) % entries.length];
    highlightEntry(previousEntry);
  }

  function highlightNext() {
    const indexEntry = getHighlightedEntryIndex();
    const nextEntry = entries[(indexEntry + 1) % entries.length];
    highlightEntry(nextEntry);
  }

  function highlightPreviousPage() {
    const indexEntry = getHighlightedEntryIndex();
    const previousEntry = getPreviousPageEntry(indexEntry);
    highlightEntry(previousEntry);
  }

  function highlightNextPage() {
    const indexEntry = getHighlightedEntryIndex();
    const nextEntry = getNextPageEntry(indexEntry);
    highlightEntry(nextEntry);
  }

  function highlightFirst() {
    highlightEntry(entries[0]);
  }

  function highlightLast() {
    highlightEntry(entries[entries.length - 1]);
  }

  function highlight(entry) {
    highlightEntry(entry);
  }

  function highlightEntries(entries) {
    setPreviousHighlightedEntry(entries[entries.length - 1]);
    setToggleNavigationDirection(0);
    setHighlightedIds(entries.map((entry) => entry.id));
  }

  function highlightAll() {
    setPreviousHighlightedEntry(entries[0]);
    setToggleNavigationDirection(0);
    setHighlightedIds(entries.map((entry) => entry.id));
  }

  function toggle(entry) {
    let newIds = getToggledHighlightedIds(highlightedIds, entry);
    setPreviousHighlightedEntry(entry);
    setToggleNavigationDirection(0);
    setHighlightedIds(newIds);
  }

  function highlightEntry(entry) {
    setPreviousHighlightedEntry(entry);
    setToggleNavigationDirection(0);
    setHighlightedIds([entry.id]);
  }

  function toggleRange(
    targetEntry,
    previousHighlightedEntryIndex = getPreviousHighlightedEntryIndex()
  ) {
    const highlightedEntryIndex = entries.findIndex(
      (entry) => entry.id === targetEntry.id
    );
    let newIds = [...highlightedIds];
    if (previousHighlightedEntryIndex < highlightedEntryIndex) {
      for (
        let indexEntry = previousHighlightedEntryIndex + 1;
        indexEntry <= highlightedEntryIndex;
        indexEntry++
      ) {
        newIds = getToggledHighlightedIds(newIds, entries[indexEntry]);
      }
    } else if (previousHighlightedEntryIndex > highlightedEntryIndex) {
      for (
        let indexEntry = previousHighlightedEntryIndex - 1;
        indexEntry >= highlightedEntryIndex;
        indexEntry--
      ) {
        newIds = getToggledHighlightedIds(newIds, entries[indexEntry]);
      }
    }
    setPreviousHighlightedEntry(targetEntry);
    setToggleNavigationDirection(0);
    setHighlightedIds(newIds);
  }

  function getToggledHighlightedIds(highlightedIds, entry) {
    if (highlightedIds.includes(entry.id)) {
      if (highlightedIds.length > 1) {
        return highlightedIds.filter((id) => id !== entry.id);
      }
    } else {
      return [...highlightedIds, entry.id];
    }
    return highlightedIds;
  }

  function togglePrevious() {
    if (previousHighlightedEntry) {
      const indexEntry = getPreviousHighlightedEntryIndex();
      if (indexEntry > 0) {
        const previousEntry = entries[indexEntry - 1];
        toggle(
          toggleNavigationDirection !== 1
            ? previousEntry
            : previousHighlightedEntry
        );
        setToggleNavigationDirection(-1);
      }
    }
  }

  function toggleNext() {
    if (previousHighlightedEntry) {
      const indexEntry = getPreviousHighlightedEntryIndex();
      if (indexEntry < entries.length - 1) {
        const nextEntry = entries[indexEntry + 1];
        toggle(
          toggleNavigationDirection !== -1
            ? nextEntry
            : previousHighlightedEntry
        );
        setToggleNavigationDirection(1);
      }
    }
  }

  function togglePreviousPage() {
    if (previousHighlightedEntry) {
      const indexEntry = getPreviousHighlightedEntryIndex();
      const previousPageEntry = getPreviousPageEntry(indexEntry);
      if (toggleNavigationDirection !== 1) {
        toggleRange(previousPageEntry);
      } else {
        toggleRange(previousPageEntry, indexEntry + 1);
      }
      setToggleNavigationDirection(-1);
    }
  }

  function toggleNextPage() {
    if (previousHighlightedEntry) {
      const indexEntry = getPreviousHighlightedEntryIndex();
      const nextPageEntry = getNextPageEntry(indexEntry);
      if (toggleNavigationDirection !== -1) {
        toggleRange(nextPageEntry);
      } else {
        toggleRange(nextPageEntry, indexEntry - 1);
      }
      setToggleNavigationDirection(1);
    }
  }

  function toggleFirst() {
    if (previousHighlightedEntry) {
      const indexEntry = getPreviousHighlightedEntryIndex();
      const firstEntry = entries[0];
      if (toggleNavigationDirection !== 1) {
        toggleRange(firstEntry);
      } else {
        toggleRange(firstEntry, indexEntry + 1);
      }
      setToggleNavigationDirection(-1);
    }
  }

  function toggleLast() {
    if (previousHighlightedEntry) {
      const indexEntry = getPreviousHighlightedEntryIndex();
      const lastEntry = entries[entries.length - 1];
      if (toggleNavigationDirection !== -1) {
        toggleRange(lastEntry);
      } else {
        toggleRange(lastEntry, indexEntry - 1);
      }
      setToggleNavigationDirection(1);
    }
  }

  function getPreviousPageEntry(indexEntry) {
    return entries[Math.max(indexEntry - getEntriesHeight(), 0)];
  }

  function getNextPageEntry(indexEntry) {
    return entries[
      Math.min(indexEntry + getEntriesHeight(), entries.length - 1)
    ];
  }

  function getPreviousHighlightedEntryIndex() {
    return entries.findIndex(
      (highlightedEntry) => highlightedEntry === previousHighlightedEntry
    );
  }

  function getHighlightedEntryIndex() {
    const entryId = highlightedIds[highlightedIds.length - 1];
    return entries.findIndex((entry) => entry.id === entryId);
  }

  return {
    highlightPrevious,
    highlightNext,
    highlightPreviousPage,
    highlightNextPage,
    highlightFirst,
    highlightLast,
    highlight,
    highlightEntries,
    highlightAll,
    toggle,
    toggleRange,
    togglePrevious,
    toggleNext,
    togglePreviousPage,
    toggleNextPage,
    toggleFirst,
    toggleLast
  };
}

function getFolderNavigationHandlers({
  history,
  historyIndex,
  selectedFolder,
  setSelectedFolder,
  setHistory,
  setHistoryIndex,
  setHighlightedIds,
  updateSelectedFolder
}) {
  function goIntoFolder(entry) {
    const newHistory = [...history];
    const newHistoryIndex = historyIndex + 1;
    if (entry.isDescendantOf(selectedFolder)) {
      newHistory.length = newHistoryIndex + 1;
    }
    newHistory[newHistoryIndex] = entry;
    setHistory(newHistory);
    setHistoryIndex(newHistoryIndex);
    setHighlightedIds([selectedFolder.id]);
    setSelectedFolder(entry);
    updateSelectedFolder(entry);
  }

  function navigateBack() {
    navigateHistory(-1);
  }

  function navigateForward() {
    navigateHistory(1);
  }

  function navigateHistory(offset) {
    const newHistoryIndex = historyIndex + offset;
    setHistoryIndex(newHistoryIndex);
    const entry = history[newHistoryIndex];
    setHighlightedIds([selectedFolder.id]);
    setSelectedFolder(entry);
    updateSelectedFolder(entry);
  }

  return {
    goIntoFolder,
    navigateBack,
    navigateForward
  };
}

function getHighlightedEntryHandlers({
  zipFilesystem,
  entries,
  history,
  historyIndex,
  highlightedIds,
  selectedFolder,
  clipboardData,
  setHistory,
  setHistoryIndex,
  setClipboardData,
  setHighlightedIds,
  setPreviousHighlightedEntry,
  removeDownload,
  updateSelectedFolder,
  downloadFile,
  util,
  constants,
  messages
}) {
  const { DEFAULT_MIME_TYPE } = constants;
  const { RENAME_MESSAGE, DELETE_MESSAGE } = messages;

  function copy() {
    setClipboardData({
      entries: highlightedIds.map((entryId) =>
        zipFilesystem.getById(entryId).clone(true)
      )
    });
  }

  function cut() {
    setClipboardData({
      entries: highlightedIds.map((entryId) => zipFilesystem.getById(entryId)),
      cut: true
    });
  }

  function paste() {
    try {
      const { entries, cut } = clipboardData;
      if (cut) {
        entries.forEach((entry) => {
          zipFilesystem.move(entry, selectedFolder);
        });
      } else {
        const clones = entries.map((entry) => {
          let clone = entry.clone(true);
          zipFilesystem.move(entry, selectedFolder);
          return clone;
        });
        setClipboardData({ entries: clones });
      }
      setHighlightedIds(entries.map((entry) => entry.id));
      updateSelectedFolder();
    } catch (error) {
      util.alert(error.message);
    }
  }

  function rename() {
    try {
      const highlightedEntry = zipFilesystem.getById(highlightedIds[0]);
      const entryName = util.prompt(RENAME_MESSAGE, highlightedEntry.name);
      if (entryName && entryName !== highlightedEntry.name) {
        highlightedEntry.rename(entryName);
        updateSelectedFolder();
      }
    } catch (error) {
      util.alert(error.message);
    }
  }

  function remove() {
    if (util.confirm(DELETE_MESSAGE)) {
      highlightedIds.forEach((id) =>
        zipFilesystem.remove(zipFilesystem.getById(id))
      );
      if (selectedFolder.children.length) {
        const indexEntry = Math.max(
          ...entries
            .map((entry, index) => ({ entry, index }))
            .filter(({ entry }) => highlightedIds.includes(entry.id))
            .map(({ index }) => index)
        );
        let indexNextEntry = indexEntry;
        while (
          indexNextEntry < entries.length &&
          highlightedIds.includes(entries[indexNextEntry].id)
        ) {
          indexNextEntry++;
        }
        if (indexNextEntry === entries.length) {
          indexNextEntry = indexEntry;
          while (
            indexNextEntry >= 0 &&
            highlightedIds.includes(entries[indexNextEntry].id)
          ) {
            indexNextEntry--;
          }
        }
        setPreviousHighlightedEntry(entries[indexNextEntry]);
        setHighlightedIds([entries[indexNextEntry].id]);
      } else {
        setPreviousHighlightedEntry(null);
        setHighlightedIds([]);
      }
      updateHistoryData();
      updateSelectedFolder();
    }
  }

  function download(entry) {
    downloadFile(entry.name, {}, async (download, options) => {
      const blob = await entry.getBlob(DEFAULT_MIME_TYPE, options);
      removeDownload(download);
      return blob;
    });
  }

  function updateHistoryData() {
    let offsetIndex = 0;
    let previousEntry;
    const highlightedEntry = entries.find(
      (entry) => entry.id === highlightedIds[0]
    );
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
    copy,
    cut,
    paste,
    rename,
    remove,
    download
  };
}

function getSelectedFolderHandlers({
  selectedFolder,
  updateSelectedFolder,
  highlightEntries,
  removeDownload,
  downloadFile,
  util,
  constants,
  messages
}) {
  const { DEFAULT_MIME_TYPE, ZIP_EXTENSION } = constants;
  const { ROOT_ZIP_FILENAME, CREATE_FOLDER_MESSAGE } = messages;

  function createFolder() {
    const folderName = util.prompt(CREATE_FOLDER_MESSAGE);
    if (folderName) {
      try {
        const entry = selectedFolder.addDirectory(folderName);
        highlightEntries([entry]);
        updateSelectedFolder();
      } catch (error) {
        util.alert(error.message);
      }
    }
  }

  function addFiles(files) {
    const addedEntries = [];
    files.forEach((file) => {
      try {
        addedEntries.push(selectedFolder.addBlob(file.name, file));
      } catch (error) {
        util.alert(error.message);
      }
    });
    if (addedEntries.length) {
      highlightEntries(addedEntries);
    }
    updateSelectedFolder();
  }

  function importZipFile(zipFile) {
    async function updateZipFile() {
      const children = [...selectedFolder.children];
      try {
        await selectedFolder.importBlob(zipFile);
      } catch (error) {
        util.alert(error.message);
      }
      const addedEntries = selectedFolder.children.filter(
        (entry) => !children.includes(entry)
      );
      if (addedEntries.length) {
        highlightEntries(addedEntries);
      }
      updateSelectedFolder();
    }

    updateZipFile();
  }

  function exportZipFile() {
    downloadFile(
      selectedFolder.name
        ? selectedFolder.name + ZIP_EXTENSION
        : ROOT_ZIP_FILENAME,
      { mimeType: DEFAULT_MIME_TYPE },
      async (download, options) => {
        const blob = await selectedFolder.exportBlob(options);
        removeDownload(download);
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

function getDownloadHandlers({ setDownloads, util }) {
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

function getActionHandlers({ goIntoFolder, download }) {
  function enter(entry) {
    if (entry.directory) {
      goIntoFolder(entry);
    } else {
      download(entry);
    }
  }

  return { enter };
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
