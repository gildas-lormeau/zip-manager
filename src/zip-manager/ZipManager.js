import "./styles/Base.css";
import "./styles/ListItem.css";
import "./styles/ButtonBar.css";
import "./styles/ZipManager.css";

import { useEffect, useState, useRef } from "react";

import * as constants from "./constants.js";
import { getUtil, createZipFileSystem } from "./util.js";
import { getEffects } from "./effects.js";
import {
  getEntriesNavigationHandlers,
  getFolderNavigationHandlers,
  getSelectedFolderHandlers,
  getHighlightedEntryHandlers,
  getActionHandlers,
  getZipFilesystemHandlers,
  getDownloadHandlers,
  getClipboardHandlers
} from "./appHandlers.js";
import { onKeyUp } from "./keyUpHandler.js";

import TopButtonBar from "./components/TopButtonBar.js";
import NavigationBar from "./components/NavigationBar.js";
import Entries from "./components/Entries.js";
import BottomButtonBar from "./components/BottomButtonBar.js";
import DownloadManager from "./components/DownloadManager.js";

function ZipManager() {
  const [zipFilesystem, setZipFilesystem] = useState(createZipFileSystem());
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [previousSelectedFolder, setPreviousSelectedFolder] = useState(null);
  const [entries, setEntries] = useState([]);
  const [highlightedEntry, setHighlightedEntry] = useState(null);
  const [downloads, setDownloads] = useState([]);
  const [downloadId, setDownloadId] = useState(0);
  const [clipboardData, setClipboardData] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const entriesHeight = useRef(0);
  const downloaderRef = useRef(null);
  const highlightedEntryRef = useRef(null);
  const addFilesButtonRef = useRef(null);
  const importZipButtonRef = useRef(null);

  const entriesEmpty = !entries.length;
  const actionDisabled =
    !highlightedEntry || highlightedEntry === selectedFolder.parent;
  const clipboardDataEmpty = !clipboardData;

  const disabledExportZip = entriesEmpty;
  const disabledReset = entriesEmpty;
  const disabledHistoryBack = !historyIndex;
  const disabledHistoryForward = historyIndex === history.length - 1;
  const disabledCopyEntry = actionDisabled;
  const disabledCutEntry = actionDisabled;
  const disabledPasteEntry = clipboardDataEmpty;
  const disabledResetClipboardData = clipboardDataEmpty;
  const disabledRenameEntry = actionDisabled;
  const disabledDeleteEntry = actionDisabled;

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
    onHighlightPreviousPageEntry,
    onHighlightNextPageEntry,
    onHighlightFirstEntry,
    onHighlightLastEntry,
    onSetHighlightedEntry
  } = getEntriesNavigationHandlers({
    entries,
    highlightedEntry,
    entriesHeight,
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
    createZipFileSystem,
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

  const keyUpProps = {
    onCutEntry,
    onCopyEntry,
    onRenameEntry,
    onPasteEntry,
    onDeleteEntry,
    onActionEntry,
    onHighlightNextEntry,
    onHighlightPreviousEntry,
    onHighlightPreviousPageEntry,
    onHighlightNextPageEntry,
    onHighlightFirstEntry,
    onHighlightLastEntry,
    onCreateFolder,
    onExportZipFile,
    onNavigateHistoryBack,
    onNavigateHistoryForward,
    disabledCutEntry,
    disabledCopyEntry,
    disabledRenameEntry,
    disabledPasteEntry,
    disabledDeleteEntry,
    disabledHistoryBack,
    disabledHistoryForward,
    disabledExportZip,
    addFilesButtonRef,
    importZipButtonRef
  };

  function handleKeyUp(event) {
    onKeyUp({ event, ...keyUpProps });
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
        disabledExportZipButton={disabledExportZip}
        disabledResetButton={disabledReset}
        onCreateFolder={onCreateFolder}
        onAddFiles={onAddFiles}
        onImportZipFile={onImportZipFile}
        onExportZipFile={onExportZipFile}
        onReset={onReset}
        constants={constants}
      />
      <NavigationBar
        selectedFolder={selectedFolder}
        disabledHistoryBackButton={disabledHistoryBack}
        disabledHistoryForwardButton={disabledHistoryForward}
        onNavigateHistoryBack={onNavigateHistoryBack}
        onNavigateHistoryForward={onNavigateHistoryForward}
        onGoIntoFolder={onGoIntoFolder}
        constants={constants}
      />
      <Entries
        entries={entries}
        selectedFolder={selectedFolder}
        highlightedEntry={highlightedEntry}
        entriesHeight={entriesHeight}
        highlightedEntryRef={highlightedEntryRef}
        onGoIntoFolder={onGoIntoFolder}
        onDownloadFile={onDownloadFile}
        onSetHighlightedEntry={onSetHighlightedEntry}
        onActionEntry={onActionEntry}
        constants={constants}
      />
      <BottomButtonBar
        disabledCopyEntryButton={disabledCopyEntry}
        disabledCutEntryButton={disabledCutEntry}
        disabledPasteEntryButton={disabledPasteEntry}
        disabledResetClipboardDataButton={disabledResetClipboardData}
        disabledRenameEntryButton={disabledRenameEntry}
        disabledDeleteEntryButton={disabledDeleteEntry}
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
