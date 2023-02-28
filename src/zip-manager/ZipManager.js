import "./styles/Base.css";
import "./styles/ListItem.css";
import "./styles/ButtonBar.css";
import "./styles/ZipManager.css";

import { useEffect, useState, useRef } from "react";

import * as util from "./helpers/util.js";
import * as constants from "./business/constants.js";
import * as messages from "./messages/en-US.js";

import { getHelpers, createZipFileSystem } from "./helpers/helpers.js";
import { getUIState } from "./business/ui-state.js";
import { getEffects } from "./business/effects.js";
import {
  getEntriesNavigationHandlers,
  getFolderNavigationHandlers,
  getSelectedFolderHandlers,
  getHighlightedEntryHandlers,
  getActionHandlers,
  getZipFilesystemHandlers,
  getDownloadHandlers,
  getClipboardHandlers
} from "./business/handlers.js";
import { getKeyUpHandler } from "./business/keyboard-handlers.js";

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
  const entriesHeightRef = useRef(0);
  const downloaderRef = useRef(null);
  const highlightedEntryRef = useRef(null);
  const addFilesButtonRef = useRef(null);
  const importZipButtonRef = useRef(null);

  const { downloadFile } = getHelpers({
    downloadId,
    setDownloadId,
    setDownloads,
    downloaderElement: downloaderRef.current,
    util,
    messages
  });
  const {
    disabledExportZip,
    disabledReset,
    disabledBack,
    disabledForward,
    disabledCopy,
    disabledCut,
    disabledPaste,
    disabledResetClipboardData,
    disabledRename,
    disabledDelete,
    disabledGoIntoParentFolder,
    disabledGoIntoChildFolder,
    disabledEnter
  } = getUIState({
    entries,
    highlightedEntry,
    selectedFolder,
    clipboardData,
    historyIndex,
    history
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
    selectedFolder,
    previousSelectedFolder,
    setEntries,
    setSelectedFolder,
    setPreviousSelectedFolder,
    setHighlightedEntry,
    setClipboardData,
    setHistory,
    setHistoryIndex,
    highlightedEntryElement: highlightedEntryRef && highlightedEntryRef.current,
    handleKeyUp,
    util
  });
  const {
    highlightPrevious,
    highlightNext,
    highlightPreviousPage,
    highlightNextPage,
    highlightFirst,
    highlightLast,
    highlight
  } = getEntriesNavigationHandlers({
    entries,
    highlightedEntry,
    entriesHeight: entriesHeightRef.current,
    setHighlightedEntry
  });
  const { goIntoFolder, navigateBack, navigateForward } =
    getFolderNavigationHandlers({
      history,
      historyIndex,
      selectedFolder,
      setSelectedFolder,
      setPreviousSelectedFolder,
      setHistory,
      setHistoryIndex
    });
  const { abortDownload, removeDownload } = getDownloadHandlers({
    setDownloads,
    util
  });
  const { createFolder, addFiles, importZipFile, exportZipFile } =
    getSelectedFolderHandlers({
      selectedFolder,
      updateSelectedFolder,
      removeDownload,
      downloadFile,
      util,
      constants,
      messages
    });
  const { copy, cut, paste, rename, remove, download } =
    getHighlightedEntryHandlers({
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
      removeDownload,
      downloadFile,
      util,
      messages
    });
  const { reset } = getZipFilesystemHandlers({
    createZipFileSystem,
    setZipFilesystem,
    util,
    messages
  });
  const { resetClipboardData } = getClipboardHandlers({
    setClipboardData
  });
  const { enter } = getActionHandlers({
    highlightedEntry,
    goIntoFolder,
    download
  });
  const keyUpHandler = getKeyUpHandler({
    highlightedEntry,
    selectedFolder,
    disabledCut,
    disabledCopy,
    disabledRename,
    disabledPaste,
    disabledDelete,
    disabledBack,
    disabledForward,
    disabledExportZip,
    disabledGoIntoParentFolder,
    disabledGoIntoChildFolder,
    disabledEnter,
    cut,
    copy,
    rename,
    paste,
    remove,
    enter,
    highlightNext,
    highlightPrevious,
    highlightPreviousPage,
    highlightNextPage,
    highlightFirst,
    highlightLast,
    createFolder,
    exportZipFile,
    navigateBack,
    navigateForward,
    goIntoFolder,
    addFilesButton: addFilesButtonRef.current,
    importZipButton: importZipButtonRef.current,
    util,
    constants
  });

  function handleKeyUp(event) {
    keyUpHandler.handleKeyUp(event);
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
        util={util}
        constants={constants}
        messages={messages}
      />
      <NavigationBar
        selectedFolder={selectedFolder}
        disabledBackButton={disabledBack}
        disabledForwardButton={disabledForward}
        onNavigateBack={navigateBack}
        onNavigateForward={navigateForward}
        onGoIntoFolder={goIntoFolder}
        constants={constants}
        messages={messages}
      />
      <Entries
        entries={entries}
        selectedFolder={selectedFolder}
        highlightedEntry={highlightedEntry}
        onHighlight={highlight}
        onEnterEntry={enter}
        highlightedEntryRef={highlightedEntryRef}
        entriesHeightRef={entriesHeightRef}
        util={util}
        constants={constants}
        messages={messages}
      />
      <BottomButtonBar
        disabledCopyButton={disabledCopy}
        disabledCutButton={disabledCut}
        disabledPasteButton={disabledPaste}
        disabledResetClipboardDataButton={disabledResetClipboardData}
        disabledRenameButton={disabledRename}
        disabledDeleteButton={disabledDelete}
        onCopy={copy}
        onCut={cut}
        onPaste={paste}
        onResetClipboardData={resetClipboardData}
        onRename={rename}
        onRemove={remove}
        constants={constants}
        messages={messages}
      />
      <DownloadManager
        downloads={downloads}
        onAbortDownload={abortDownload}
        downloaderRef={downloaderRef}
        constants={constants}
        messages={messages}
      />
    </div>
  );
}

export default ZipManager;
