import "./styles/Base.css";
import "./styles/ListItem.css";
import "./styles/ButtonBar.css";
import "./styles/ZipManager.css";

import { useEffect, useState, useRef } from "react";

import * as util from "./helpers/util.js";
import * as messages from "./messages/en-US.js";

import getHelpers from "./helpers/helpers.js";
import getKeyboardHooks from "./hooks/keyboard-hooks.js";
import * as zipService from "./services/zip-service.js";

import * as constants from "./business/constants.js";
import getUIState from "./business/ui-state.js";
import getEffects from "./business/effects.js";
import getCommonHandlers from "./business/features/common.js";
import getEntriesHandlers from "./business/features/entries.js";
import getFoldersHandlers from "./business/features/folders.js";
import getSelectedFolderHandlers from "./business/features/selected-folder.js";
import getHighlightedEntriesHandlers from "./business/features/highlighted-entries.js";
import getAppHandlers from "./business/features/app.js";
import getFilesystemHandlers from "./business/features/filesystem.js";
import getDownloadsHandlers from "./business/features/downloads.js";
import getClipboardHandlers from "./business/features/clipboard.js";
import getKeyboardHandlers from "./business/features/keyboard.js";
import getUIHandlers from "./business/features/ui.js";

import TopButtonBar from "./components/TopButtonBar.js";
import NavigationBar from "./components/NavigationBar.js";
import Entries from "./components/Entries.js";
import BottomButtonBar from "./components/BottomButtonBar.js";
import DownloadManager from "./components/DownloadManager.js";

function ZipManager() {
  const [zipFilesystem, setZipFilesystem] = useState(
    zipService.createZipFileSystem()
  );
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
  const entriesHeightRef = useRef(null);
  const downloaderRef = useRef(null);
  const highlightedEntryRef = useRef(null);
  const addFilesButtonRef = useRef(null);
  const importZipButtonRef = useRef(null);

  const { useKeyUp } = getKeyboardHooks(util);
  const { abortDownload, removeDownload } = getDownloadsHandlers({
    setDownloads,
    util
  });
  const { downloadFile } = getHelpers({
    downloadId,
    setDownloadId,
    setDownloads,
    removeDownload,
    downloaderElement: downloaderRef.current,
    zipService,
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
  const { updateSelectedFolder } = getCommonHandlers({
    selectedFolder,
    setEntries
  });
  const { updateHighlightedEntry, updateZipFilesystem } = getEffects({
    zipFilesystem,
    setPreviousHighlightedEntry,
    setToggleNavigationDirection,
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
  } = getEntriesHandlers({
    entries,
    previousHighlightedEntry,
    highlightedIds,
    toggleNavigationDirection,
    getEntriesHeight: () => entriesHeightRef.current,
    setHighlightedIds,
    setPreviousHighlightedEntry,
    setToggleNavigationDirection
  });
  const { goIntoFolder, navigateBack, navigateForward } = getFoldersHandlers({
    history,
    historyIndex,
    selectedFolder,
    setSelectedFolder,
    setHistory,
    setHistoryIndex,
    setHighlightedIds,
    updateSelectedFolder
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
    getHighlightedEntriesHandlers({
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
  const { reset } = getFilesystemHandlers({
    zipService,
    setZipFilesystem,
    util,
    messages
  });
  const { resetClipboardData } = getClipboardHandlers({
    setClipboardData
  });
  const { enter } = getAppHandlers({
    goIntoFolder,
    download
  });
  const { handleKeyUp } = getKeyboardHandlers({
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
