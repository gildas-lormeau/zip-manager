import "./App.css";
import { useEffect, useState, useRef } from "react";
import { fs } from "@zip.js/zip.js";

const { FS } = fs;
const DEFAULT_MIME_TYPE = "application/octet-stream";
const PARENT_FOLDER_LABEL = "..";
const ROOT_FOLDER_LABEL = "[root]";
const ZIP_EXTENSION = ".zip";
const ROOT_ZIP_FILENAME = "Download" + ZIP_EXTENSION;
const CANCELLED_DOWNLOAD_MESSAGE = "download cancelled";
const ABORT_ERROR_NAME = "AbortError";

const KEYUP_EVENT_NAME = "keyup";
const CLICK_EVENT_NAME = "click";

const ACTION_KEY = "Enter";
const CUT_KEY = "x";
const COPY_KEY = "c";
const RENAME_KEY = "r";
const PASTE_KEY = "v";
const CREATE_FOLDER_KEY = "d";
const ADD_FILES_KEY = "f";
const IMPORT_ZIP_KEY = "i";
const EXPORT_ZIP_KEY = "e";
const DELETE_KEYS = ["Backspace", "Delete"];
const DOWN_KEY = "ArrowDown";
const UP_KEY = "ArrowUp";
const HOME_KEY = "Home";
const END_KEY = "End";

const NAVIGATION_KEYS = [DOWN_KEY, UP_KEY, HOME_KEY, END_KEY, ACTION_KEY];

const CTRL_KEY_LABEL = "Ctrl-";

const CREATE_FOLDER_MESSAGE = "Please enter the folder name";
const RENAME_MESSAGE = "Please enter the entry name";
const RESET_MESSAGE = "Please confirm the reset";
const DOWNLOAD_MESSAGE = "Please enter the file name";
const DELETE_MESSAGE = "Please confirm the deletion";

function App() {
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
    if (NAVIGATION_KEYS.includes(event.key)) {
      onNavigateEntries(event.key);
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
    // eslint-disable-next-line no-restricted-globals
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
    const indexEntry = entries.findIndex(
      (entry) => entry.id === highlightedEntry.id
    );
    const previousEntry =
      entries[(indexEntry - 1 + entries.length) % entries.length];
    setHighlightedEntry(previousEntry);
  }

  function onHighlightNextEntry() {
    const indexEntry = entries.findIndex(
      (entry) => entry.id === highlightedEntry.id
    );
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
    // eslint-disable-next-line no-restricted-globals
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

  function onNavigateEntries(eventKey) {
    if (eventKey === ACTION_KEY) {
      onActionEntry();
    }
    if (eventKey === DOWN_KEY) {
      onHighlightNextEntry();
    }
    if (eventKey === UP_KEY) {
      onHighlightPreviousEntry();
    }
    if (eventKey === HOME_KEY) {
      onHighlightFirstEntry();
    }
    if (eventKey === END_KEY) {
      onHighlightLastEntry();
    }
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
    if (selectedFolder && previousSelectedFolder === selectedFolder.parent) {
      setPreviousSelectedFolder(null);
      setHighlightedEntry(previousSelectedFolder);
    } else if (
      previousSelectedFolder &&
      previousSelectedFolder.parent === selectedFolder
    ) {
      setPreviousSelectedFolder(null);
      setHighlightedEntry(previousSelectedFolder);
    } else if (!highlightedEntry || !entries.includes(highlightedEntry)) {
      setHighlightedEntry(entries[0]);
    }
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
  useEffect(() => {
    window.addEventListener(KEYUP_EVENT_NAME, handleKeyUp);
    return () => window.removeEventListener(KEYUP_EVENT_NAME, handleKeyUp);
  });
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

async function downloadBlob(blob, downloaderElement, download) {
  const href = URL.createObjectURL(blob);
  Object.assign(downloaderElement, { href, download });
  downloaderElement.click();
  URL.revokeObjectURL(href);
}

function TopButtonBar({
  entries,
  addFilesButtonRef,
  importZipButtonRef,
  onCreateFolder,
  onAddFiles,
  onImportZipFile,
  onExportZipFile,
  onReset
}) {
  return (
    <div className="button-bar">
      <div className="button-group">
        <CreateFolderButton onCreateFolder={onCreateFolder} />
        <AddFilesButton
          onAddFiles={onAddFiles}
          addFilesButtonRef={addFilesButtonRef}
        />
      </div>
      <div className="button-group">
        <ImportZipButton
          onImportZipFile={onImportZipFile}
          importZipButtonRef={importZipButtonRef}
        />
        <ExportZipButton
          disabled={!entries.length}
          onExportZipFile={onExportZipFile}
        />
      </div>
      <div className="button-group">
        <ResetButton disabled={!entries.length} onReset={onReset} />
      </div>
    </div>
  );
}

function CreateFolderButton({ onCreateFolder }) {
  return (
    <button onClick={onCreateFolder} title={CTRL_KEY_LABEL + CREATE_FOLDER_KEY}>
      Create directory
    </button>
  );
}

function AddFilesButton({ addFilesButtonRef, onAddFiles }) {
  const fileInputRef = useRef(null);
  const { current } = fileInputRef;

  function handleChange({ target }) {
    const files = Array.from(target.files);
    current.value = "";
    if (files.length) {
      onAddFiles(files);
    }
  }

  function dispatchEvent() {
    current.dispatchEvent(new MouseEvent(CLICK_EVENT_NAME));
  }

  return (
    <>
      <button
        onClick={dispatchEvent}
        ref={addFilesButtonRef}
        title={CTRL_KEY_LABEL + ADD_FILES_KEY}
      >
        Add files
      </button>
      <input
        onChange={handleChange}
        ref={fileInputRef}
        type="file"
        multiple
        hidden
      />
    </>
  );
}

function ImportZipButton({ importZipButtonRef, onImportZipFile }) {
  const fileInput = useRef(null);
  const { current } = fileInput;

  function dispatchEvent() {
    current.dispatchEvent(new MouseEvent(CLICK_EVENT_NAME));
  }

  return (
    <>
      <button
        onClick={dispatchEvent}
        ref={importZipButtonRef}
        title={CTRL_KEY_LABEL + IMPORT_ZIP_KEY}
      >
        Import zip file
      </button>
      <input
        onChange={({ target }) => onImportZipFile(target.files[0])}
        ref={fileInput}
        type="file"
        accept={ZIP_EXTENSION}
        hidden
      />
    </>
  );
}

function ExportZipButton({ disabled, onExportZipFile }) {
  return (
    <button
      onClick={onExportZipFile}
      disabled={disabled}
      title={CTRL_KEY_LABEL + EXPORT_ZIP_KEY}
    >
      Export zip file
    </button>
  );
}

function ResetButton({ disabled, onReset }) {
  return (
    <button onClick={onReset} disabled={disabled}>
      Reset
    </button>
  );
}

function Breadcrumb({ folder, onGoIntoFolder }) {
  const folderAncestors = [];
  const lastItemFolder = folder;

  function getBreadcrumbItemClassName(itemFolder) {
    const classes = ["breadcrumb-item"];
    if (folderAncestors.length > 1 && itemFolder !== lastItemFolder) {
      classes.push("breadcrumb-item-active");
    }
    return classes.join(" ");
  }

  function getTabIndex(itemFolder) {
    if (folderAncestors.length > 1 && itemFolder !== lastItemFolder) {
      return 0;
    } else {
      return null;
    }
  }

  function handleClick(folder) {
    onGoIntoFolder(folder);
  }

  function handleKeyUp({ event, folder }) {
    if (event.key === ACTION_KEY) {
      handleClick(folder);
    }
  }

  while (folder && folder.parent) {
    folderAncestors.unshift(folder);
    folder = folder.parent;
  }
  if (folder) {
    folderAncestors.unshift(folder);
  }
  return (
    <ol className="breadcrumb">
      {folderAncestors.map((folder) => (
        <li key={folder.id}>
          <span
            className={getBreadcrumbItemClassName(folder)}
            onClick={() => handleClick(folder)}
            onKeyUp={(event) => handleKeyUp({ event, folder })}
            tabIndex={getTabIndex(folder)}
          >
            {folder.parent ? folder.name : ROOT_FOLDER_LABEL}
          </span>
        </li>
      ))}
    </ol>
  );
}

function Entries({
  entries,
  selectedFolder,
  highlightedEntry,
  highlightedEntryRef,
  onSetHighlightedEntry,
  onActionEntry
}) {
  function getEntryClassName(entry) {
    const classes = [];
    if (entry.directory) {
      classes.push("directory");
    }
    if (entry === highlightedEntry) {
      classes.push("entry-highlighted");
    }
    return classes.join(" ");
  }

  return (
    <ol className="entries">
      {entries.map((entry) => {
        if (entry === highlightedEntry) {
          return (
            <li
              key={entry.id}
              ref={highlightedEntryRef}
              className={getEntryClassName(entry)}
              tabIndex={0}
            >
              <Entry
                entry={entry}
                selectedFolder={selectedFolder}
                onSelectEntry={onSetHighlightedEntry}
                onActionEntry={onActionEntry}
              />
            </li>
          );
        } else {
          return (
            <li key={entry.id} className={getEntryClassName(entry)}>
              <Entry
                entry={entry}
                selectedFolder={selectedFolder}
                onSelectEntry={onSetHighlightedEntry}
                onActionEntry={onActionEntry}
              />
            </li>
          );
        }
      })}
    </ol>
  );
}

function Entry({ entry, selectedFolder, onSelectEntry, onActionEntry }) {
  return (
    <>
      <EntryName
        entry={entry}
        selectedFolder={selectedFolder}
        onSelectEntry={onSelectEntry}
        onActionEntry={onActionEntry}
      />
      <EntryButton entry={entry} onActionEntry={onActionEntry} />
    </>
  );
}

function EntryName({ entry, selectedFolder, onSelectEntry, onActionEntry }) {
  const entryLabel =
    entry === selectedFolder.parent ? PARENT_FOLDER_LABEL : entry.name;

  function handleClick() {
    onSelectEntry(entry);
  }

  function handleDoubleClick() {
    onActionEntry(entry);
  }

  return (
    <span
      className="list-item-name entry-name"
      title={entryLabel}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      {entryLabel}
    </span>
  );
}

function EntryButton({ entry, onActionEntry }) {
  function handleClick() {
    onActionEntry(entry);
  }

  return (
    <span className="list-item-button" onClick={handleClick}>
      {entry.directory ? "↵" : "↓"}
    </span>
  );
}

function BottomButtonBar({
  selectedFolder,
  highlightedEntry,
  clipboardData,
  onCopyEntry,
  onCutEntry,
  onPasteEntry,
  onResetClipboardData,
  onRenameEntry,
  onDeleteEntry
}) {
  const actionDisabled =
    !highlightedEntry || highlightedEntry === selectedFolder.parent;

  return (
    <div className="button-bar button-bar-bottom">
      <div className="button-group">
        <CopyEntryButton disabled={actionDisabled} onCopyEntry={onCopyEntry} />
        <CutEntryButton disabled={actionDisabled} onCutEntry={onCutEntry} />
        <PasteEntryButton
          disabled={!clipboardData}
          onPasteEntry={onPasteEntry}
        />
        <ResetClipboardDataButton
          disabled={!clipboardData}
          onResetClipboardData={onResetClipboardData}
        />
      </div>
      <div className="button-group">
        <RenameEntryButton
          disabled={actionDisabled}
          onRenameEntry={onRenameEntry}
        />
        <DeleteEntryButton
          disabled={actionDisabled}
          onDeleteEntry={onDeleteEntry}
        />
      </div>
    </div>
  );
}

function CopyEntryButton({ disabled, onCopyEntry }) {
  return (
    <button
      onClick={onCopyEntry}
      disabled={disabled}
      title={CTRL_KEY_LABEL + COPY_KEY}
    >
      Copy
    </button>
  );
}

function CutEntryButton({ disabled, onCutEntry }) {
  return (
    <button
      onClick={onCutEntry}
      disabled={disabled}
      title={CTRL_KEY_LABEL + CUT_KEY}
    >
      Cut
    </button>
  );
}

function PasteEntryButton({ disabled, onPasteEntry }) {
  return (
    <button
      onClick={onPasteEntry}
      disabled={disabled}
      title={CTRL_KEY_LABEL + PASTE_KEY}
    >
      Paste
    </button>
  );
}

function ResetClipboardDataButton({ disabled, onResetClipboardData }) {
  return (
    <button onClick={onResetClipboardData} disabled={disabled}>
      Reset clipboard
    </button>
  );
}

function RenameEntryButton({ disabled, onRenameEntry }) {
  return (
    <button
      onClick={onRenameEntry}
      disabled={disabled}
      title={CTRL_KEY_LABEL + RENAME_KEY}
    >
      Rename
    </button>
  );
}

function DeleteEntryButton({ disabled, onDeleteEntry }) {
  return (
    <button
      onClick={onDeleteEntry}
      disabled={disabled}
      title={DELETE_KEYS.map((key) => key).join(", ")}
    >
      Delete
    </button>
  );
}

function DownloadManager({ downloads, downloaderRef, onDeleteDownloadEntry }) {
  return (
    <div className="downloads">
      <ol>
        {downloads.map((download) => (
          <li key={download.id}>
            <DownloadEntry
              download={download}
              onDeleteDownloadEntry={onDeleteDownloadEntry}
            />
          </li>
        ))}
      </ol>
      {/* eslint-disable-next-line jsx-a11y/anchor-has-content, jsx-a11y/anchor-is-valid */}
      <a hidden ref={downloaderRef} />
    </div>
  );
}

function DownloadEntry({ download, onDeleteDownloadEntry }) {
  return (
    <>
      <DownloadEntryInfo
        download={download}
        onDeleteDownloadEntry={onDeleteDownloadEntry}
      />
      <DownloadEntryProgress download={download} />
    </>
  );
}

function DownloadEntryInfo({ download, onDeleteDownloadEntry }) {
  return (
    <div className="download-entry">
      <span className="list-item-name download-entry-name">
        {download.name}
      </span>
      <DeleteDownloadEntryButton
        download={download}
        onDeleteDownloadEntry={onDeleteDownloadEntry}
      />
    </div>
  );
}

function DeleteDownloadEntryButton({ download, onDeleteDownloadEntry }) {
  function handleClick() {
    onDeleteDownloadEntry(download);
  }

  function handleKeyUp(event) {
    if (event.key === ACTION_KEY) {
      handleClick();
    }
  }

  return (
    <span
      className="list-item-button"
      onClick={handleClick}
      onKeyUp={handleKeyUp}
      tabIndex={0}
    >
      ✕
    </span>
  );
}

function DownloadEntryProgress({ download }) {
  return <progress value={download.progressValue} max={download.progressMax} />;
}

export default App;
