import "./styles/Base.css";
import "./styles/ZipManager.css";
import "./styles/ListItem.css";
import "./styles/ButtonBar.css";

import { useEffect, useState, useRef } from "react";
import { fs } from "@zip.js/zip.js";

import {
  downloadBlob,
  alert,
  confirm,
  prompt,
  addEventListener,
  removeEventListener
} from "./../util/util.js";

import TopButtonBar from "./TopButtonBar.js";
import Breadcrumb from "./Breadcrumb.js";
import Entries from "./Entries.js";
import BottomButtonBar from "./BottomButtonBar.js";
import DownloadManager from "./DownloadManager.js";

import {
  DEFAULT_MIME_TYPE,
  ZIP_EXTENSION,
  ROOT_ZIP_FILENAME,
  CANCELLED_DOWNLOAD_MESSAGE,
  ABORT_ERROR_NAME,
  KEYUP_EVENT_NAME,
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
  CREATE_FOLDER_MESSAGE,
  RENAME_MESSAGE,
  RESET_MESSAGE,
  DOWNLOAD_MESSAGE,
  DELETE_MESSAGE
} from "./../business/constants.js";

const { FS } = fs;

function ZipManager() {
  const [zipFilesystem, setZipFilesystem] = useState(new FS());
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [previousSelectedFolder, setPreviousSelectedFolder] = useState(null);
  const [entries, setEntries] = useState([]);
  const [highlightedEntry, setHighlightedEntry] = useState(null);
  const [downloads, setDownloads] = useState([]);
  const [downloadId, setDownloadId] = useState(0);
  const [clipboardData, setClipboardData] = useState(null);
  const downloaderRef = useRef(null);
  const highlightedEntryRef = useRef(null);
  const addFilesButtonRef = useRef(null);
  const importZipButtonRef = useRef(null);

  function handleKeyUp(event) {
    if (event.ctrlKey) {
      if (highlightedEntry) {
        if (event.key === CUT_KEY) {
          onCutEntry();
        }
        if (event.key === COPY_KEY) {
          onCopyEntry();
        }
        if (event.key === RENAME_KEY) {
          onRenameEntry();
        }
      }
      if (clipboardData) {
        if (event.key === PASTE_KEY) {
          onPasteEntry();
        }
      }
      if (event.key === CREATE_FOLDER_KEY) {
        onCreateFolder();
      }
      if (event.key === ADD_FILES_KEY) {
        addFilesButtonRef.current.click();
      }
      if (event.key === IMPORT_ZIP_KEY) {
        importZipButtonRef.current.click();
      }
      if (entries.length) {
        if (event.key === EXPORT_ZIP_KEY) {
          onExportZipFile();
        }
      }
    }
    if (DELETE_KEYS.includes(event.key)) {
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

  function onCopyEntry() {
    setClipboardData({
      entry: highlightedEntry.clone()
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
        clone = entry.clone();
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

  function onResetClipboardData() {
    setClipboardData(null);
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
      setHighlightedEntry(null);
      updateSelectedFolder();
    }
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
    setHighlightedEntry(entries[0]);
    setHighlightedEntry(entries[entries.length - 1]);
  }

  function onReset() {
    if (confirm(RESET_MESSAGE)) {
      setZipFilesystem(new FS());
    }
  }

  function onSetHighlightedEntry(entry) {
    setHighlightedEntry(entry);
  }

  function onGoIntoFolder(entry) {
    setPreviousSelectedFolder(selectedFolder);
    setSelectedFolder(entry);
  }

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

  function onActionEntry() {
    if (highlightedEntry.directory) {
      onGoIntoFolder(highlightedEntry);
    } else {
      onDownloadFile(highlightedEntry);
    }
  }

  function updateSelectedFolder() {
    if (selectedFolder) {
      const { parent, children } = selectedFolder;
      const folders = filterChildren(children, true);
      const files = filterChildren(children, false);
      const ancestors = [];
      if (parent) {
        ancestors.push(parent);
      }
      setEntries([...ancestors, ...folders, ...files]);
    }
  }

  function filterChildren(children, isDirectory) {
    return children
      .filter((child) => Boolean(child.directory) === isDirectory)
      .sort((previousChild, nextChild) =>
        previousChild.name.localeCompare(nextChild.name)
      );
  }

  function updateZipFilesystem() {
    const { root } = zipFilesystem;
    setSelectedFolder(root);
    setHighlightedEntry(null);
    setClipboardData(null);
    setEntries([...root.children]);
  }

  function updateHighlightedEntry() {
    if (
      highlightedEntry &&
      highlightedEntryRef &&
      highlightedEntryRef.current
    ) {
      highlightedEntryRef.current.focus();
    }
  }

  function updateDefaultHighlightedEntry() {
    if (
      (selectedFolder && previousSelectedFolder === selectedFolder.parent) ||
      (previousSelectedFolder &&
        previousSelectedFolder.parent === selectedFolder)
    ) {
      setPreviousSelectedFolder(null);
      setHighlightedEntry(previousSelectedFolder);
    } else if (!highlightedEntry || !entries.includes(highlightedEntry)) {
      setHighlightedEntry(entries[0]);
    }
  }

  function registerKeyUpHandler() {
    addEventListener(KEYUP_EVENT_NAME, handleKeyUp);
    return () => removeEventListener(KEYUP_EVENT_NAME, handleKeyUp);
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

  useEffect(updateSelectedFolder, [selectedFolder]);
  useEffect(updateZipFilesystem, [zipFilesystem]);
  useEffect(updateHighlightedEntry, [highlightedEntry]);
  useEffect(updateDefaultHighlightedEntry, [
    entries,
    highlightedEntry,
    previousSelectedFolder,
    selectedFolder
  ]);
  useEffect(registerKeyUpHandler);
  return (
    <div className="application">
      <TopButtonBar
        entries={entries}
        addFilesButtonRef={addFilesButtonRef}
        importZipButtonRef={importZipButtonRef}
        onCreateFolder={onCreateFolder}
        onAddFiles={onAddFiles}
        onImportZipFile={onImportZipFile}
        onExportZipFile={onExportZipFile}
        onReset={onReset}
      />
      <Breadcrumb folder={selectedFolder} onGoIntoFolder={onGoIntoFolder} />
      <Entries
        entries={entries}
        selectedFolder={selectedFolder}
        highlightedEntry={highlightedEntry}
        highlightedEntryRef={highlightedEntryRef}
        onGoIntoFolder={onGoIntoFolder}
        onDownloadFile={onDownloadFile}
        onSetHighlightedEntry={onSetHighlightedEntry}
        onActionEntry={onActionEntry}
      />
      <BottomButtonBar
        selectedFolder={selectedFolder}
        highlightedEntry={highlightedEntry}
        clipboardData={clipboardData}
        onCopyEntry={onCopyEntry}
        onCutEntry={onCutEntry}
        onPasteEntry={onPasteEntry}
        onResetClipboardData={onResetClipboardData}
        onRenameEntry={onRenameEntry}
        onDeleteEntry={onDeleteEntry}
      />
      <DownloadManager
        downloads={downloads}
        downloaderRef={downloaderRef}
        onDeleteDownloadEntry={onDeleteDownloadEntry}
      />
    </div>
  );
}

export default ZipManager;
