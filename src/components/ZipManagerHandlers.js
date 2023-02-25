/* global AbortController */

import { fs } from "@zip.js/zip.js";

import { downloadBlob, alert, confirm, prompt } from "./../util/util.js";

import {
  DEFAULT_MIME_TYPE,
  ZIP_EXTENSION,
  ROOT_ZIP_FILENAME,
  CANCELLED_DOWNLOAD_MESSAGE,
  ABORT_ERROR_NAME,
  ACTION_KEY,
  CUT_KEY,
  COPY_KEY,
  RENAME_KEY,
  PASTE_KEY,
  CREATE_FOLDER_KEY,
  ADD_FILES_KEY,
  IMPORT_ZIP_KEY,
  EXPORT_ZIP_KEY,
  DELETE_KEYS,
  DOWN_KEY,
  UP_KEY,
  HOME_KEY,
  END_KEY,
  NAVIGATION_BACK_KEY,
  NAVIGATION_FORWARD_KEY,
  CREATE_FOLDER_MESSAGE,
  RENAME_MESSAGE,
  RESET_MESSAGE,
  DOWNLOAD_MESSAGE,
  DELETE_MESSAGE
} from "./../business/constants.js";

const { FS } = fs;

function getEntriesNavigationHandlers({
  entries,
  highlightedEntry,
  setHighlightedEntry
}) {
  function onHighlightPreviousEntry() {
    const indexEntry = entries.findIndex((entry) => entry === highlightedEntry);
    const previousEntry =
      entries[(indexEntry - 1 + entries.length) % entries.length];
    setHighlightedEntry(previousEntry);
  }

  function onHighlightNextEntry() {
    const indexEntry = entries.findIndex((entry) => entry === highlightedEntry);
    const nextEntry = entries[(indexEntry + 1) % entries.length];
    setHighlightedEntry(nextEntry);
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

  return {
    onHighlightPreviousEntry,
    onHighlightNextEntry,
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

function getDownloadHandlers({
  downloadId,
  setDownloads,
  setDownloadId,
  downloaderRef
}) {
  function onDownloadFile(file) {
    downloadFile(file.name, {}, (options) =>
      file.getBlob(DEFAULT_MIME_TYPE, options)
    );
  }

  function onDeleteDownloadEntry(deletedDownload) {
    setDownloads((downloads) =>
      downloads.filter((download) => download.id !== deletedDownload.id)
    );
    deletedDownload.controller.abort(CANCELLED_DOWNLOAD_MESSAGE);
  }

  async function downloadFile(name, options, blobGetter) {
    name = prompt(DOWNLOAD_MESSAGE, name);
    if (name) {
      const controller = new AbortController();
      const progressValue = null;
      const progressMax = null;
      const id = downloadId + 1;
      setDownloadId(() => id);
      const download = { id, name, controller, progressValue, progressMax };
      setDownloads((downloads) => [download, ...downloads]);
      const { signal } = controller;
      const onprogress = (progressValue, progressMax) =>
        onDownloadProgress(download.id, progressValue, progressMax);
      Object.assign(options, {
        signal,
        onprogress,
        bufferedWrite: true,
        keepOrder: true
      });
      try {
        const blob = await blobGetter(options);
        downloadBlob(blob, downloaderRef.current, download.name);
      } catch (error) {
        const message = error.message || error;
        if (
          message !== CANCELLED_DOWNLOAD_MESSAGE &&
          error.name !== ABORT_ERROR_NAME
        ) {
          alert(message);
        }
      } finally {
        onDeleteDownloadEntry(download);
      }
    }
  }

  function onDownloadProgress(downloadId, progressValue, progressMax) {
    setDownloads((downloads) =>
      downloads.map((download) => {
        if (download.id === downloadId) {
          download = {
            ...download,
            progressValue,
            progressMax
          };
        }
        return download;
      })
    );
  }

  return {
    downloadFile,
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

function getZipFilesystemHandlers({ setZipFilesystem }) {
  function onReset() {
    if (confirm(RESET_MESSAGE)) {
      setZipFilesystem(new FS());
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

function onHighlightedEntryKeyUp({
  event,
  onCutEntry,
  onCopyEntry,
  onRenameEntry,
  onPasteEntry,
  onDeleteEntry,
  onActionEntry,
  onHighlightNextEntry,
  onHighlightPreviousEntry,
  onHighlightFirstEntry,
  onHighlightLastEntry,
  disabledCutEntryButton,
  disabledCopyEntryButton,
  disabledRenameEntryButton,
  disabledPasteEntryButton,
  disabledDeleteEntryButton
}) {
  if (event.ctrlKey) {
    if (event.key === CUT_KEY && !disabledCutEntryButton) {
      onCutEntry();
    }
    if (event.key === COPY_KEY && !disabledCopyEntryButton) {
      onCopyEntry();
    }
    if (event.key === RENAME_KEY && !disabledRenameEntryButton) {
      onRenameEntry();
    }
    if (event.key === PASTE_KEY && !disabledPasteEntryButton) {
      onPasteEntry();
    }
  }
  if (DELETE_KEYS.includes(event.key) && !disabledDeleteEntryButton) {
    onDeleteEntry();
  }
  if (event.key === ACTION_KEY) {
    onActionEntry();
  }
  if (event.key === DOWN_KEY) {
    onHighlightNextEntry();
  }
  if (event.key === UP_KEY) {
    onHighlightPreviousEntry();
  }
  if (event.key === HOME_KEY) {
    onHighlightFirstEntry();
  }
  if (event.key === END_KEY) {
    onHighlightLastEntry();
  }
}

function onSelectedFolderKeyUp({
  event,
  onCreateFolder,
  onExportZipFile,
  addFilesButtonRef,
  importZipButtonRef,
  disabledExportZipButton
}) {
  if (event.ctrlKey) {
    if (event.key === CREATE_FOLDER_KEY) {
      onCreateFolder();
    }
    if (event.key === ADD_FILES_KEY) {
      addFilesButtonRef.current.click();
    }
    if (event.key === IMPORT_ZIP_KEY) {
      importZipButtonRef.current.click();
    }
    if (event.key === EXPORT_ZIP_KEY && !disabledExportZipButton) {
      onExportZipFile();
    }
  }
}

function onFolderNavigationKeyUp({
  event,
  onNavigateHistoryBack,
  onNavigateHistoryForward,
  disabledHistoryBackButton,
  disabledHistoryForwardButton
}) {
  if (event.altKey) {
    if (event.key === NAVIGATION_BACK_KEY && !disabledHistoryBackButton) {
      onNavigateHistoryBack();
    }
    if (event.key === NAVIGATION_FORWARD_KEY && !disabledHistoryForwardButton) {
      onNavigateHistoryForward();
    }
  }
}

function onEntryNavigationKeyUp({
  event,
  onHighlightNextEntry,
  onHighlightPreviousEntry,
  onHighlightFirstEntry,
  onHighlightLastEntry
}) {
  if (event.key === DOWN_KEY) {
    onHighlightNextEntry();
  }
  if (event.key === UP_KEY) {
    onHighlightPreviousEntry();
  }
  if (event.key === HOME_KEY) {
    onHighlightFirstEntry();
  }
  if (event.key === END_KEY) {
    onHighlightLastEntry();
  }
}

function onKeyUp({
  event,
  onCutEntry,
  onCopyEntry,
  onRenameEntry,
  onPasteEntry,
  onDeleteEntry,
  onActionEntry,
  onHighlightNextEntry,
  onHighlightPreviousEntry,
  onHighlightFirstEntry,
  onHighlightLastEntry,
  onCreateFolder,
  onExportZipFile,
  onNavigateHistoryBack,
  onNavigateHistoryForward,
  disabledCutEntryButton,
  disabledCopyEntryButton,
  disabledRenameEntryButton,
  disabledPasteEntryButton,
  disabledDeleteEntryButton,
  disabledHistoryBackButton,
  disabledHistoryForwardButton,
  disabledExportZipButton,
  addFilesButtonRef,
  importZipButtonRef
}) {
  onHighlightedEntryKeyUp({
    event,
    onCutEntry,
    onCopyEntry,
    onRenameEntry,
    onPasteEntry,
    onDeleteEntry,
    onActionEntry,
    onHighlightNextEntry,
    onHighlightPreviousEntry,
    onHighlightFirstEntry,
    onHighlightLastEntry,
    disabledCutEntryButton,
    disabledCopyEntryButton,
    disabledRenameEntryButton,
    disabledPasteEntryButton,
    disabledDeleteEntryButton
  });
  onSelectedFolderKeyUp({
    event,
    onCreateFolder,
    onExportZipFile,
    addFilesButtonRef,
    importZipButtonRef,
    disabledExportZipButton
  });
  onFolderNavigationKeyUp({
    event,
    onNavigateHistoryBack,
    onNavigateHistoryForward,
    disabledHistoryBackButton,
    disabledHistoryForwardButton
  });
  onEntryNavigationKeyUp({
    event,
    onHighlightNextEntry,
    onHighlightPreviousEntry,
    onHighlightFirstEntry,
    onHighlightLastEntry
  });
}

export {
  getEntriesNavigationHandlers,
  getFolderNavigationHandlers,
  getSelectedFolderHandlers,
  getHighlightedEntryHandlers,
  getActionHandlers,
  getZipFilesystemHandlers,
  getDownloadHandlers,
  getClipboardHandlers,
  onKeyUp
};
