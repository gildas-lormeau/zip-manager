import "./styles/Base.css";
import "./styles/ListItem.css";
import "./styles/ButtonBar.css";
import "./styles/ZipManager.css";

import { useEffect, useState, useRef } from "react";
import { useKeyUp } from "./hooks.js";

import * as util from "./helpers/util.js";
import * as constants from "./business/constants.js";
import * as messages from "./messages/en-US.js";

import { getCommon } from "./business/common.js";
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
import { getUIHandlers } from "./business/ui-handlers";

import TopButtonBar from "./components/TopButtonBar.js";
import NavigationBar from "./components/NavigationBar.js";
import Entries from "./components/Entries.js";
import BottomButtonBar from "./components/BottomButtonBar.js";
import DownloadManager from "./components/DownloadManager.js";

function ZipManager() {
  const [zipFilesystem, setZipFilesystem] = useState(createZipFileSystem());
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [entries, setEntries] = useState([]);
  const [highlightedIds, setHighlightedIds] = useState([]);
  const [previousHighlightedEntry, setPreviousHighlightedEntry] =
    useState(null);
  const [toggleNavigationDirection, setToggleNavigationDirection] = useState(0);
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
    disabledEnter,
    accentColor
  } = getUIState({
    entries,
    highlightedIds,
    selectedFolder,
    clipboardData,
    historyIndex,
    history,
    util,
    constants
  });
  const { updateSelectedFolder } = getCommon({
    selectedFolder,
    setEntries
  });
  const { updateHighlightedEntry, updateZipFilesystem } = getEffects({
    zipFilesystem,
    setPreviousHighlightedEntry,
    setSelectedFolder,
    setHighlightedIds,
    setClipboardData,
    setHistory,
    setHistoryIndex,
    getHighlightedEntryElement: () => highlightedEntryRef.current,
    updateSelectedFolder,
    util
  });
  const { setAccentColor } = getUIHandlers({
    util
  });
  const {
    highlightPrevious,
    highlightNext,
    highlightPreviousPage,
    highlightNextPage,
    highlightFirst,
    highlightLast,
    highlight,
    highlightEntries,
    highlightAll,
    toggle,
    toggleRange,
    togglePrevious,
    toggleNext,
    togglePreviousPage,
    toggleNextPage,
    toggleFirst,
    toggleLast
  } = getEntriesNavigationHandlers({
    entries,
    previousHighlightedEntry,
    highlightedIds,
    toggleNavigationDirection,
    getEntriesHeight: () => entriesHeightRef.current,
    setHighlightedIds,
    setPreviousHighlightedEntry,
    setToggleNavigationDirection
  });
  const { goIntoFolder, navigateBack, navigateForward } =
    getFolderNavigationHandlers({
      history,
      historyIndex,
      selectedFolder,
      setSelectedFolder,
      setHistory,
      setHistoryIndex,
      setHighlightedIds,
      updateSelectedFolder
    });
  const { abortDownload, removeDownload } = getDownloadHandlers({
    setDownloads,
    util
  });
  const { createFolder, addFiles, importZipFile, exportZipFile } =
    getSelectedFolderHandlers({
      selectedFolder,
      updateSelectedFolder,
      highlightEntries,
      removeDownload,
      downloadFile,
      util,
      constants,
      messages
    });
  const { copy, cut, paste, rename, remove, download } =
    getHighlightedEntryHandlers({
      zipFilesystem,
      entries,
      history,
      historyIndex,
      highlightedIds,
      selectedFolder,
      clipboardData,
      setHistory,
      setHistoryIndex,
      setClipboardData,
      setHighlightedIds,
      setPreviousHighlightedEntry,
      removeDownload,
      updateSelectedFolder,
      downloadFile,
      util,
      constants,
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
    goIntoFolder,
    download
  });
  const { handleKeyUp } = getKeyUpHandler({
    highlightedIds,
    selectedFolder,
    disabledCut,
    disabledCopy,
    disabledRename,
    disabledPaste,
    disabledDelete,
    disabledBack,
    disabledForward,
    disabledExportZip,
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
    highlightAll,
    togglePrevious,
    toggleNext,
    togglePreviousPage,
    toggleNextPage,
    toggleFirst,
    toggleLast,
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

  useKeyUp(handleKeyUp);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(updateZipFilesystem, [zipFilesystem]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(updateHighlightedEntry, [highlightedIds]);
  // eslint-disable-next-line react-hooks/exhaustive-deps

  return (
    <div className="application">
      <TopButtonBar
        disabledExportZipButton={disabledExportZip}
        disabledResetButton={disabledReset}
        accentColor={accentColor}
        onCreateFolder={createFolder}
        onAddFiles={addFiles}
        onImportZipFile={importZipFile}
        onExportZipFile={exportZipFile}
        onReset={reset}
        onSetAccentColor={setAccentColor}
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
        highlightedIds={highlightedIds}
        onHighlight={highlight}
        onToggle={toggle}
        onToggleRange={toggleRange}
        onEnter={enter}
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
