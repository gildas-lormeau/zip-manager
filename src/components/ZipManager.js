import "./styles/Base.css";
import "./styles/Common.css";
import "./styles/ListItem.css";
import "./styles/ButtonBar.css";
import "./styles/ZipManager.css";

import { useEffect, useState, useRef } from "react";
import { fs } from "@zip.js/zip.js";

import {
  getEntriesNavigationHandlers,
  getFolderNavigationHandlers,
  getSelectedFolderHandlers,
  getHighlightedEntryHandlers,
  getActionHandlers,
  getZipFilesystemHandlers,
  getDownloadHandlers,
  getClipboardHandlers,
  onKeyUp
} from "./ZipManagerHandlers.js";

import {
  addEventListener,
  removeEventListener
} from "./../util/util.js";

import TopButtonBar from "./TopButtonBar.js";
import NavigationBar from "./NavigationBar.js";
import Entries from "./Entries.js";
import BottomButtonBar from "./BottomButtonBar.js";
import DownloadManager from "./DownloadManager.js";

import {
  KEYUP_EVENT_NAME
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
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const downloaderRef = useRef(null);
  const highlightedEntryRef = useRef(null);
  const addFilesButtonRef = useRef(null);
  const importZipButtonRef = useRef(null);

  const entriesEmpty = !entries.length;
  const actionDisabled =
    !highlightedEntry || highlightedEntry === selectedFolder.parent;
  const clipboardDataEmpty = !clipboardData;

  const disabledExportZipButton = entriesEmpty;
  const disabledResetButton = entriesEmpty;
  const disabledHistoryBackButton = !historyIndex;
  const disabledHistoryForwardButton = historyIndex === history.length - 1;
  const disabledCopyEntryButton = actionDisabled;
  const disabledCutEntryButton = actionDisabled;
  const disabledPasteEntryButton = clipboardDataEmpty;
  const disabledResetClipboardDataButton = clipboardDataEmpty;
  const disabledRenameEntryButton = actionDisabled;
  const disabledDeleteEntryButton = actionDisabled;

  const {
    onHighlightPreviousEntry,
    onHighlightNextEntry,
    onHighlightFirstEntry,
    onHighlightLastEntry,
    onSetHighlightedEntry
  } = getEntriesNavigationHandlers({
    entries,
    highlightedEntry,
    setHighlightedEntry
  });
  const { onGoIntoFolder, onNavigateHistoryBack, onNavigateHistoryForward } =
    getFolderNavigationHandlers({
      history,
      historyIndex,
      selectedFolder,
      setSelectedFolder,
      setPreviousSelectedFolder,
      setHistory,
      setHistoryIndex
    });
  const { downloadFile, onDownloadFile, onDeleteDownloadEntry } =
    getDownloadHandlers({
      downloadId,
      setDownloads,
      setDownloadId,
      downloaderRef
    });
  const { onCreateFolder, onAddFiles, onImportZipFile, onExportZipFile } =
    getSelectedFolderHandlers({
      selectedFolder,
      updateSelectedFolder,
      downloadFile
    });
  const {
    onCopyEntry,
    onCutEntry,
    onPasteEntry,
    onRenameEntry,
    onDeleteEntry
  } = getHighlightedEntryHandlers({
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
  });
  const { onReset } = getZipFilesystemHandlers({
    setZipFilesystem
  });
  const { onResetClipboardData } = getClipboardHandlers({
    setClipboardData
  });
  const { onActionEntry } = getActionHandlers({
    highlightedEntry,
    onGoIntoFolder,
    onDownloadFile
  });

  function handleKeyUp(event) {
    onKeyUp({
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
      disabledDeleteEntryButton,
      onCreateFolder,
      onExportZipFile,
      addFilesButtonRef,
      importZipButtonRef,
      disabledExportZipButton,
      onNavigateHistoryBack,
      onNavigateHistoryForward,
      disabledHistoryBackButton
    });
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
    setPreviousSelectedFolder(null);
    setHighlightedEntry(null);
    setClipboardData(null);
    setHistory([root]);
    setHistoryIndex(0);
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

  useEffect(registerKeyUpHandler);
  useEffect(updateSelectedFolder, [selectedFolder]);
  useEffect(updateZipFilesystem, [zipFilesystem]);
  useEffect(updateHighlightedEntry, [highlightedEntry]);
  useEffect(updateDefaultHighlightedEntry, [
    entries,
    highlightedEntry,
    previousSelectedFolder,
    selectedFolder
  ]);

  return (
    <div className="application">
      <TopButtonBar
        addFilesButtonRef={addFilesButtonRef}
        importZipButtonRef={importZipButtonRef}
        disabledExportZipButton={disabledExportZipButton}
        disabledResetButton={disabledResetButton}
        onCreateFolder={onCreateFolder}
        onAddFiles={onAddFiles}
        onImportZipFile={onImportZipFile}
        onExportZipFile={onExportZipFile}
        onReset={onReset}
      />
      <NavigationBar
        selectedFolder={selectedFolder}
        disabledHistoryBackButton={disabledHistoryBackButton}
        disabledHistoryForwardButton={disabledHistoryForwardButton}
        onNavigateHistoryBack={onNavigateHistoryBack}
        onNavigateHistoryForward={onNavigateHistoryForward}
        onGoIntoFolder={onGoIntoFolder}
      />
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
        disabledCopyEntryButton={disabledCopyEntryButton}
        disabledCutEntryButton={disabledCutEntryButton}
        disabledPasteEntryButton={disabledPasteEntryButton}
        disabledResetClipboardDataButton={disabledResetClipboardDataButton}
        disabledRenameEntryButton={disabledRenameEntryButton}
        disabledDeleteEntryButton={disabledDeleteEntryButton}
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
