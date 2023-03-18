import "./styles/index.css";

import { useEffect, useState, useRef } from "react";

import * as util from "./misc/dom-util.js";
import * as messages from "./messages/en-US.js";
import getHelpers from "./misc/helpers.js";
import getHooks from "./hooks/hooks.js";
import * as zipService from "./services/zip-service.js";

import {
  constants,
  features,
  getUIState,
  getEffects,
  getEventHandlers
} from "./business/index.js";
import {
  TopButtonBar,
  NavigationBar,
  Entries,
  BottomButtonBar,
  DownloadManager,
  InfoBar
} from "./components/index.js";
const {
  getCommonFeatures,
  getEntriesFeatures,
  getFoldersFeatures,
  getSelectedFolderFeatures,
  getHighlightedEntriesFeatures,
  getFilesystemFeatures,
  getDownloadsFeatures,
  getClipboardFeatures,
  getUIFeatures,
  getAppFeatures
} = features;

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
  const passwordRef = useRef("");
  const entriesHeightRef = useRef(null);
  const downloaderRef = useRef(null);
  const highlightedEntryRef = useRef(null);
  const addFilesButtonRef = useRef(null);
  const importZipButtonRef = useRef(null);

  const { useKeyUp, usePageUnload } = getHooks(util);
  const { abortDownload, removeDownload } = getDownloadsFeatures({
    setDownloads,
    util
  });
  const { downloadFile } = getHelpers({
    zipFilesystem,
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
    disabledSetZipPassword,
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
  const { updateSelectedFolder } = getCommonFeatures({
    selectedFolder,
    setEntries
  });
  const { updateHighlightedEntries, updateZipFilesystem } = getEffects({
    zipFilesystem,
    setPassword: (password) => (passwordRef.current = password),
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
  const { setAccentColor } = getUIFeatures({
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
  } = getEntriesFeatures({
    entries,
    previousHighlightedEntry,
    highlightedIds,
    toggleNavigationDirection,
    getEntriesHeight: () => entriesHeightRef.current,
    setHighlightedIds,
    setPreviousHighlightedEntry,
    setToggleNavigationDirection
  });
  const { goIntoFolder, navigateBack, navigateForward } = getFoldersFeatures({
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
    getSelectedFolderFeatures({
      selectedFolder,
      getPassword: () => passwordRef.current,
      updateSelectedFolder,
      highlightEntries,
      removeDownload,
      downloadFile,
      util,
      constants,
      messages
    });
  const { copy, cut, paste, rename, remove, download } =
    getHighlightedEntriesFeatures({
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
  const { reset } = getFilesystemFeatures({
    zipService,
    setZipFilesystem,
    util,
    messages
  });
  const { resetClipboardData } = getClipboardFeatures({
    setClipboardData
  });
  const { enter, setZipPassword } = getAppFeatures({
    setPassword: (password) => (passwordRef.current = password),
    goIntoFolder,
    download,
    util,
    messages
  });
  const { handleKeyUp, handlePageUnload } = getEventHandlers({
    zipFilesystem,
    downloads,
    highlightedIds,
    selectedFolder,
    disabledSetZipPassword,
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
    setZipPassword,
    navigateBack,
    navigateForward,
    goIntoFolder,
    addFilesButton: addFilesButtonRef.current,
    importZipButton: importZipButtonRef.current,
    util,
    constants
  });

  usePageUnload(handlePageUnload);
  useKeyUp(handleKeyUp);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(updateZipFilesystem, [zipFilesystem]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(updateHighlightedEntries, [highlightedIds]);

  return (
    <>
      <div className="application">
        <TopButtonBar
          disabledExportZipButton={disabledExportZip}
          disabledSetZipPasswordButton={disabledSetZipPassword}
          disabledResetButton={disabledReset}
          onCreateFolder={createFolder}
          onAddFiles={addFiles}
          onImportZipFile={importZipFile}
          onExportZipFile={exportZipFile}
          onSetZipPassword={setZipPassword}
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
      <InfoBar
        accentColor={accentColor}
        onSetAccentColor={setAccentColor}
        util={util}
      />
    </>
  );
}

export default ZipManager;
