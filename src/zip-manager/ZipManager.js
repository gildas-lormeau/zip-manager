import "./styles/Base.css";
import "./styles/ListItem.css";
import "./styles/ButtonBar.css";
import "./styles/ZipManager.css";

import { useEffect, useState, useRef } from "react";

import * as constants from "./constants.js";
import * as messages from "./messages.js";

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
    highlightPreviousEntry,
    highlightNextEntry,
    highlightPreviousPageEntry,
    highlightNextPageEntry,
    highlightFirstEntry,
    highlightLastEntry,
    highlightEntry
  } = getEntriesNavigationHandlers({
    entries,
    highlightedEntry,
    entriesHeight,
    setHighlightedEntry
  });
  const { goIntoFolder, navigateHistoryBack, navigateHistoryForward } =
    getFolderNavigationHandlers({
      history,
      historyIndex,
      selectedFolder,
      setSelectedFolder,
      setPreviousSelectedFolder,
      setHistory,
      setHistoryIndex
    });
  const { deleteDownloadEntry } = getDownloadHandlers({
    setDownloads
  });
  const { createFolder, addFiles, importZipFile, exportZipFile } =
    getSelectedFolderHandlers({
      selectedFolder,
      updateSelectedFolder,
      deleteDownloadEntry,
      downloadFile
    });
  const {
    copyEntry,
    cutEntry,
    pasteEntry,
    renameEntry,
    deleteEntry,
    downloadEntry
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
    updateSelectedFolder,
    deleteDownloadEntry,
    downloadFile
  });
  const { reset } = getZipFilesystemHandlers({
    createZipFileSystem,
    setZipFilesystem
  });
  const { resetClipboardData } = getClipboardHandlers({
    setClipboardData
  });
  const { enterEntry } = getActionHandlers({
    highlightedEntry,
    goIntoFolder,
    downloadEntry
  });

  const keyUpProps = {
    disabledCutEntry,
    disabledCopyEntry,
    disabledRenameEntry,
    disabledPasteEntry,
    disabledDeleteEntry,
    disabledHistoryBack,
    disabledHistoryForward,
    disabledExportZip,
    cutEntry,
    copyEntry,
    renameEntry,
    pasteEntry,
    deleteEntry,
    enterEntry,
    highlightNextEntry,
    highlightPreviousEntry,
    highlightPreviousPageEntry,
    highlightNextPageEntry,
    highlightFirstEntry,
    highlightLastEntry,
    createFolder,
    exportZipFile,
    navigateHistoryBack,
    navigateHistoryForward,
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
        disabledExportZipButton={disabledExportZip}
        disabledResetButton={disabledReset}
        onCreateFolder={createFolder}
        onAddFiles={addFiles}
        onImportZipFile={importZipFile}
        onExportZipFile={exportZipFile}
        onReset={reset}
        addFilesButtonRef={addFilesButtonRef}
        importZipButtonRef={importZipButtonRef}
        constants={constants}
        messages={messages}
      />
      <NavigationBar
        selectedFolder={selectedFolder}
        disabledHistoryBackButton={disabledHistoryBack}
        disabledHistoryForwardButton={disabledHistoryForward}
        onNavigateHistoryBack={navigateHistoryBack}
        onNavigateHistoryForward={navigateHistoryForward}
        onGoIntoFolder={goIntoFolder}
        constants={constants}
        messages={messages}
      />
      <Entries
        entries={entries}
        selectedFolder={selectedFolder}
        highlightedEntry={highlightedEntry}
        entriesHeight={entriesHeight}
        onGoIntoFolder={goIntoFolder}
        onDownloadHighlightedEntry={downloadEntry}
        onHighlightEntry={highlightEntry}
        onEnterEntry={enterEntry}
        highlightedEntryRef={highlightedEntryRef}
        constants={constants}
        messages={messages}
      />
      <BottomButtonBar
        disabledCopyEntryButton={disabledCopyEntry}
        disabledCutEntryButton={disabledCutEntry}
        disabledPasteEntryButton={disabledPasteEntry}
        disabledResetClipboardDataButton={disabledResetClipboardData}
        disabledRenameEntryButton={disabledRenameEntry}
        disabledDeleteEntryButton={disabledDeleteEntry}
        onCopyEntry={copyEntry}
        onCutEntry={cutEntry}
        onPasteEntry={pasteEntry}
        onResetClipboardData={resetClipboardData}
        onRenameEntry={renameEntry}
        onDeleteEntry={deleteEntry}
        constants={constants}
        messages={messages}
      />
      <DownloadManager
        downloads={downloads}
        onDeleteDownloadEntry={deleteDownloadEntry}
        downloaderRef={downloaderRef}
        constants={constants}
        messages={messages}
      />
    </div>
  );
}

export default ZipManager;
