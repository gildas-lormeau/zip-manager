import { alert, confirm, prompt } from "./util/util.js";

import {
  DEFAULT_MIME_TYPE,
  ZIP_EXTENSION,
  ROOT_ZIP_FILENAME,
  CANCELLED_DOWNLOAD_MESSAGE,
  CREATE_FOLDER_MESSAGE,
  RENAME_MESSAGE,
  RESET_MESSAGE,
  DELETE_MESSAGE
} from "./constants.js";

function getEntriesNavigationHandlers({
  entries,
  highlightedEntry,
  entriesHeight,
  setHighlightedEntry
}) {
  function onHighlightPreviousEntry() {
    const indexEntry = getEntryIndex();
    const previousEntry =
      entries[(indexEntry - 1 + entries.length) % entries.length];
    setHighlightedEntry(previousEntry);
  }

  function onHighlightNextEntry() {
    const indexEntry = getEntryIndex();
    const nextEntry = entries[(indexEntry + 1) % entries.length];
    setHighlightedEntry(nextEntry);
  }

  function onHighlightPreviousPageEntry() {
    const indexEntry = getEntryIndex();
    const previousEntry =
      entries[Math.max(indexEntry - entriesHeight.current, 0)];
    setHighlightedEntry(previousEntry);
  }

  function onHighlightNextPageEntry() {
    const indexEntry = getEntryIndex();
    const previousEntry =
      entries[Math.min(indexEntry + entriesHeight.current, entries.length - 1)];
    setHighlightedEntry(previousEntry);
  }

  function onHighlightFirstEntry() {
    setHighlightedEntry(entries[0]);
  }

  function onHighlightLastEntry() {
    setHighlightedEntry(entries[entries.length - 1]);
  }

  function onSetHighlightedEntry(entry) {
    setHighlightedEntry(entry);
  }

  function getEntryIndex() {
    return entries.findIndex((entry) => entry === highlightedEntry);
  }

  return {
    onHighlightPreviousEntry,
    onHighlightNextEntry,
    onHighlightPreviousPageEntry,
    onHighlightNextPageEntry,
    onHighlightFirstEntry,
    onHighlightLastEntry,
    onSetHighlightedEntry
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
  function onGoIntoFolder(entry) {
    const newHistory = [...history];
    const newHistoryIndex = historyIndex + 1;
    newHistory[newHistoryIndex] = entry;
    setHistory(newHistory);
    setHistoryIndex(newHistoryIndex);
    setSelectedFolders(entry);
  }

  function onNavigateHistoryBack() {
    onNavigateHistory(-1);
  }

  function onNavigateHistoryForward() {
    onNavigateHistory(1);
  }

  function onNavigateHistory(offset) {
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
    onGoIntoFolder,
    onNavigateHistoryBack,
    onNavigateHistoryForward
  };
}

function getDownloadHandlers({ setDownloads, downloadFile }) {
  function onDownloadFile(file) {
    downloadFile(file.name, {}, (options) =>
      onDeleteDownloadEntry(file.getBlob(DEFAULT_MIME_TYPE, options))
    );
  }

  function onDeleteDownloadEntry(deletedDownload) {
    setDownloads((downloads) =>
      downloads.filter((download) => download.id !== deletedDownload.id)
    );
    deletedDownload.controller.abort(CANCELLED_DOWNLOAD_MESSAGE);
  }

  return {
    onDownloadFile,
    onDeleteDownloadEntry
  };
}

function getSelectedFolderHandlers({
  selectedFolder,
  updateSelectedFolder,
  downloadFile
}) {
  function onCreateFolder() {
    const folderName = prompt(CREATE_FOLDER_MESSAGE);
    if (folderName) {
      try {
        selectedFolder.addDirectory(folderName);
        updateSelectedFolder();
      } catch (error) {
        alert(error.message);
      }
    }
  }

  function onAddFiles(files) {
    files.forEach((file) => {
      try {
        return selectedFolder.addBlob(file.name, file);
      } catch (error) {
        alert(error.message);
      }
    });
    updateSelectedFolder();
  }

  function onImportZipFile(zipFile) {
    async function updateZipFile() {
      try {
        await selectedFolder.importBlob(zipFile);
      } catch (error) {
        alert(error.message);
      }
      updateSelectedFolder();
    }

    if (zipFile) {
      updateZipFile();
    }
  }

  function onExportZipFile() {
    downloadFile(
      selectedFolder.name
        ? selectedFolder.name + ZIP_EXTENSION
        : ROOT_ZIP_FILENAME,
      { mimeType: DEFAULT_MIME_TYPE },
      (options) => selectedFolder.exportBlob(options)
    );
  }

  return {
    onCreateFolder,
    onAddFiles,
    onImportZipFile,
    onExportZipFile
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
  updateSelectedFolder
}) {
  function onCopyEntry() {
    setClipboardData({
      entry: highlightedEntry.clone(true)
    });
  }

  function onCutEntry() {
    setClipboardData({
      entry: highlightedEntry,
      cut: true
    });
  }

  function onPasteEntry() {
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
      alert(error.message);
    }
  }

  function onRenameEntry() {
    try {
      const entryName = prompt(RENAME_MESSAGE, highlightedEntry.name);
      if (entryName && entryName !== highlightedEntry.name) {
        highlightedEntry.rename(entryName);
        updateSelectedFolder();
      }
    } catch (error) {
      alert(error.message);
    }
  }

  function onDeleteEntry() {
    if (confirm(DELETE_MESSAGE)) {
      zipFilesystem.remove(highlightedEntry);
      updateHistoryData();
      setHighlightedEntry(null);
      updateSelectedFolder();
    }
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
    onCopyEntry,
    onCutEntry,
    onPasteEntry,
    onRenameEntry,
    onDeleteEntry
  };
}

function getZipFilesystemHandlers({ createZipFileSystem, setZipFilesystem }) {
  function onReset() {
    if (confirm(RESET_MESSAGE)) {
      setZipFilesystem(createZipFileSystem());
    }
  }
  return {
    onReset
  };
}

function getClipboardHandlers({ setClipboardData }) {
  function onResetClipboardData() {
    setClipboardData(null);
  }

  return {
    onResetClipboardData
  };
}

function getActionHandlers({
  highlightedEntry,
  onGoIntoFolder,
  onDownloadFile
}) {
  function onActionEntry(entry = highlightedEntry) {
    if (entry) {
      if (entry.directory) {
        onGoIntoFolder(entry);
      } else {
        onDownloadFile(entry);
      }
    }
  }

  return { onActionEntry };
}

export {
  getEntriesNavigationHandlers,
  getFolderNavigationHandlers,
  getSelectedFolderHandlers,
  getHighlightedEntryHandlers,
  getActionHandlers,
  getZipFilesystemHandlers,
  getDownloadHandlers,
  getClipboardHandlers
};
