import "./styles/Base.css";
import "./styles/Common.css";
import "./styles/ListItem.css";
import "./styles/ButtonBar.css";
import "./styles/ZipManager.css";

import { useEffect, useState, useRef } from "react";
import { fs } from "@zip.js/zip.js";

import * as constants from "./ZipManagerConstants.js";
import { getUtil } from "./ZipManagerUtil.js";
import { getEffects } from "./ZipManagerEffects.js";
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

import TopButtonBar from "./components/TopButtonBar.js";
import NavigationBar from "./components/NavigationBar.js";
import Entries from "./components/Entries.js";
import BottomButtonBar from "./components/BottomButtonBar.js";
import DownloadManager from "./components/DownloadManager.js";

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

  const { downloadFile } = getUtil({
    downloadId,
    setDownloadId,
    setDownloads,
    downloaderRef
  });
  const {
    updateSelectedFolder,
    updateZipFilesystem,
    updateHighlightedEntry,
    updateDefaultHighlightedEntry,
    registerKeyUpHandler
  } = getEffects({
    zipFilesystem,
    entries,
    highlightedEntry,
    highlightedEntryRef,
    selectedFolder,
    previousSelectedFolder,
    setEntries,
    setSelectedFolder,
    setPreviousSelectedFolder,
    setHighlightedEntry,
    setClipboardData,
    setHistory,
    setHistoryIndex,
    handleKeyUp
  });
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
  const { onDownloadFile, onDeleteDownloadEntry } = getDownloadHandlers({
    setDownloads,
    downloadFile
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
    });
  }

  useEffect(registerKeyUpHandler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(updateSelectedFolder, [selectedFolder]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(updateZipFilesystem, [zipFilesystem]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(updateHighlightedEntry, [highlightedEntry]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
        constants={constants}
      />
      <NavigationBar
        selectedFolder={selectedFolder}
        disabledHistoryBackButton={disabledHistoryBackButton}
        disabledHistoryForwardButton={disabledHistoryForwardButton}
        onNavigateHistoryBack={onNavigateHistoryBack}
        onNavigateHistoryForward={onNavigateHistoryForward}
        onGoIntoFolder={onGoIntoFolder}
        constants={constants}
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
        constants={constants}
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
        constants={constants}
      />
      <DownloadManager
        downloads={downloads}
        downloaderRef={downloaderRef}
        onDeleteDownloadEntry={onDeleteDownloadEntry}
        constants={constants}
      />
    </div>
  );
}

export default ZipManager;
