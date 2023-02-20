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

function App() {
  const [zipFilesystem, setZipFilesystem] = useState(new FS());
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [entries, setEntries] = useState([]);
  const [highlightedEntry, setHighlightedEntry] = useState(null);
  const [downloads, setDownloads] = useState([]);
  const [downloadId, setDownloadId] = useState(0);
  const downloader = useRef(null);

  function onCreateFolder(folderName) {
    try {
      const folder = selectedFolder.addDirectory(folderName);
      setHighlightedEntry(folder);
      updateSelectedFolder();
    } catch (error) {
      alert(error.message);
    }
  }

  function onAddFile(files) {
    files.forEach((file) => {
      try {
        return selectedFolder.addBlob(file.name, file);
      } catch (error) {
        alert(error.message);
      }
    });
    updateSelectedFolder();
  }

  function onRenameEntry(entryName) {
    try {
      highlightedEntry.rename(entryName);
      updateSelectedFolder();
    } catch (error) {
      alert(error.message);
    }
  }

  function onDeleteEntry() {
    zipFilesystem.remove(highlightedEntry);
    setHighlightedEntry(null);
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

  function onReset() {
    setZipFilesystem(new FS());
  }

  function onHighlightEntry(entry) {
    setHighlightedEntry(entry === highlightedEntry ? null : entry);
  }

  function onGoIntoFolder(entry) {
    setHighlightedEntry(null);
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
    setEntries([...root.children]);
  }

  async function downloadFile(name, options, blobGetter) {
    name = prompt("Please enter the file name", name);
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
        const blob = await blobGetter(options)
        downloadBlob(
          blob,
          downloader.current,
          download.name
        );
      } catch (error) {
        const message = error.message || error;
        if (message !== CANCELLED_DOWNLOAD_MESSAGE && error.name !== "AbortError") {
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
  return (
    <div className="application">
      <TopButtonBar
        entriesLength={entries.length}
        onCreateFolder={onCreateFolder}
        onAddFile={onAddFile}
        onImportZipFile={onImportZipFile}
        onExportZipFile={onExportZipFile}
        onReset={onReset}
      />
      <Breadcrumb folder={selectedFolder} onGoIntoFolder={onGoIntoFolder} />
      <Entries
        entries={entries}
        parentFolder={selectedFolder && selectedFolder.parent}
        highlightedEntry={highlightedEntry}
        onHighlightEntry={onHighlightEntry}
        onGoIntoFolder={onGoIntoFolder}
        onDownloadFile={onDownloadFile}
      />
      <BottomButtonBar
        highlightedEntry={highlightedEntry}
        onRenameEntry={onRenameEntry}
        onDeleteEntry={onDeleteEntry}
      />
      <DownloadManager
        downloads={downloads}
        downloader={downloader}
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
  entriesLength,
  onCreateFolder,
  onAddFile,
  onImportZipFile,
  onExportZipFile,
  onReset
}) {
  return (
    <div className="button-bar">
      <CreateFolderButton onCreateFolder={onCreateFolder} />
      <AddFilesButton onAddFile={onAddFile} />
      <ImportZipButton onImportZipFile={onImportZipFile} />
      <ExportZipButton
        disabled={!entriesLength}
        onExportZipFile={onExportZipFile}
      />
      <ResetButton disabled={!entriesLength} onReset={onReset} />
    </div>
  );
}

function CreateFolderButton({ onCreateFolder }) {
  function handleClick() {
    const folderName = prompt("Please enter the folder name");
    if (folderName) {
      onCreateFolder(folderName);
    }
  }

  return <button onClick={handleClick}>Create folder</button>;
}

function AddFilesButton({ onAddFile }) {
  const fileInput = useRef(null);
  const { current } = fileInput;

  function handleChange({ target }) {
    const files = Array.from(target.files);
    current.value = "";
    if (files.length) {
      onAddFile(files);
    }
  }

  function dispatchEvent() {
    current.dispatchEvent(new MouseEvent("click"));
  }

  return (
    <>
      <button onClick={dispatchEvent}>Add files</button>
      <input
        onChange={handleChange}
        ref={fileInput}
        type="file"
        multiple
        hidden
      />
    </>
  );
}

function ImportZipButton({ onImportZipFile }) {
  const fileInput = useRef(null);
  const { current } = fileInput;

  function dispatchEvent() {
    current.dispatchEvent(new MouseEvent("click"));
  }

  return (
    <>
      <button onClick={dispatchEvent}>Import zip file</button>
      <input
        onChange={({ target }) => onImportZipFile(target.files[0])}
        ref={fileInput}
        type="file"
        accept=".zip"
        hidden
      />
    </>
  );
}

function ExportZipButton({ disabled, onExportZipFile }) {
  return (
    <button onClick={onExportZipFile} disabled={disabled}>
      Export zip file
    </button>
  );
}

function ResetButton({ disabled, onReset }) {
  function handleClick() {
    // eslint-disable-next-line no-restricted-globals
    if (confirm("Please confirm the reset")) {
      onReset();
    }
  }

  return (
    <button onClick={handleClick} disabled={disabled}>
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

  function handleClick() {
    onGoIntoFolder(folder);
  }

  function handleKeyUp(event) {
    if (event.key === "Enter") {
      handleClick();
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
            onClick={handleClick}
            onKeyUp={handleKeyUp}
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
  parentFolder,
  highlightedEntry,
  onHighlightEntry,
  onGoIntoFolder,
  onDownloadFile
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
    <ol className="entries" >
      {entries.map((entry) => (
        <li key={entry.id} className={getEntryClassName(entry)}>
          <EntryName
            entry={entry}
            parentFolder={parentFolder}
            onHighlightEntry={onHighlightEntry}
            onGoIntoFolder={onGoIntoFolder}
            onDownloadFile={onDownloadFile}
          />
          <EntryButton
            entry={entry}
            onGoIntoFolder={onGoIntoFolder}
            onDownloadFile={onDownloadFile}
          />
        </li>
      ))}
    </ol>
  );
}

function EntryName({
  entry,
  parentFolder,
  onGoIntoFolder,
  onHighlightEntry,
  onDownloadFile
}) {
  const isParentEntry = entry === parentFolder;

  function handleClick() {
    if (isParentEntry) {
      onGoIntoFolder(entry);
    } else {
      onHighlightEntry(entry);
    }
  }

  function handleKeyUp(event) {
    if (event.key === "Enter") {
      handleClick();
    }
  }

  function handleDoubleClick() {
    if (entry.directory) {
      onGoIntoFolder(entry);
    } else {
      onDownloadFile(entry);
    }
  }

  return (
    <span
      className="list-item-name entry-name"
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onKeyUp={handleKeyUp}
      tabIndex="0"
    >
      {isParentEntry ? PARENT_FOLDER_LABEL : entry.name}
    </span>
  );
}

function EntryButton({ entry, onGoIntoFolder, onDownloadFile }) {
  return entry.directory ? (
    <FolderNavigationButton folder={entry} onGoIntoFolder={onGoIntoFolder} />
  ) : (
    <FileDownloadButton file={entry} onDownloadFile={onDownloadFile} />
  );
}

function FolderNavigationButton({ folder, onGoIntoFolder }) {
  function handleClick() {
    onGoIntoFolder(folder);
  }

  function handleKeyUp(event) {
    if (event.key === "Enter") {
      handleClick();
    }
  }

  return (
    <span
      className="list-item-button navigate-button"
      onClick={handleClick}
      onKeyUp={handleKeyUp}
      tabIndex="0"
    >
      ↵
    </span>
  );
}

function FileDownloadButton({ file, onDownloadFile }) {
  function handleClick() {
    onDownloadFile(file);
  }

  function handleKeyUp(event) {
    if (event.key === "Enter") {
      handleClick();
    }
  }

  return (
    <span
      className="list-item-button download-button"
      onClick={handleClick}
      onKeyUp={handleKeyUp}
      tabIndex="0"
    >
      ↓
    </span>
  );
}

function BottomButtonBar({ highlightedEntry, onRenameEntry, onDeleteEntry }) {
  return (
    <div className="button-bar button-bar-bottom">
      <RenameEntryButton
        disabled={!highlightedEntry}
        entryName={highlightedEntry?.name}
        onRenameEntry={onRenameEntry}
      />
      <DeleteEntryButton
        disabled={!highlightedEntry}
        onDeleteEntry={onDeleteEntry}
      />
    </div>
  );
}

function RenameEntryButton({ entryName, disabled, onRenameEntry }) {
  function handleClick() {
    const previousEntryName = entryName;
    const newEntryName = prompt(
      "Please enter the entry name",
      previousEntryName
    );
    if (newEntryName && newEntryName !== previousEntryName) {
      onRenameEntry(newEntryName);
    }
  }

  return (
    <button onClick={handleClick} disabled={disabled}>
      Rename
    </button>
  );
}

function DeleteEntryButton({ disabled, onDeleteEntry }) {
  function handleClick() {
    // eslint-disable-next-line no-restricted-globals
    if (confirm("Please confirm the deletion")) {
      onDeleteEntry();
    }
  }

  return (
    <button onClick={handleClick} disabled={disabled}>
      Delete
    </button>
  );
}

function DownloadManager({ downloads, downloader, onDeleteDownloadEntry }) {
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
      <a hidden ref={downloader} />
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
    if (event.key === "Enter") {
      handleClick();
    }
  }

  return (
    <span
      className="list-item-button"
      onClick={handleClick}
      onKeyUp={handleKeyUp}
      tabIndex="0"
    >
      ✕
    </span>
  );
}

function DownloadEntryProgress({ download }) {
  return <progress value={download.progressValue} max={download.progressMax} />;
}

export default App;
