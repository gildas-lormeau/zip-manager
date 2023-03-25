import "./styles/index.css";

import { useEffect, useState, useRef } from "react";

import * as util from "./misc/dom-util.js";
import * as messages from "./messages/en-US.js";
import * as zipService from "./services/zip-service.js";

import { getHooks } from "./hooks/hooks.js";
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
  InfoBar,
  ExportZipDialog,
  ExtractDialog,
  RenameDialog,
  CreateFolderDialog
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
  getAppFeatures
} = features;

function ZipManager() {
  const [zipFilesystem, setZipFilesystem] = useState(
    zipService.createZipFileSystem()
  );
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [entries, setEntries] = useState([]);
  const [entriesHeight, setEntriesHeight] = useState(0);
  const [entriesDeltaHeight, setEntriesDeltaHeight] = useState(0);
  const [highlightedIds, setHighlightedIds] = useState([]);
  const [previousHighlightedEntry, setPreviousHighlightedEntry] =
    useState(null);
  const [toggleNavigationDirection, setToggleNavigationDirection] = useState(0);
  const [downloads, setDownloads] = useState([]);
  const [downloadId, setDownloadId] = useState(0);
  const [clipboardData, setClipboardData] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [accentColor, setAccentColor] = useState(null);
  const [colorScheme, setColorScheme] = useState("");

  const [exportZipDialogOpened, setExportZipDialogOpened] = useState(false);
  const [exportZipFilename, setExportZipFilename] = useState("");
  const [exportZipPassword, setExportZipPassword] = useState("");
  const [extractDialogOpened, setExtractDialogOpened] = useState(false);
  const [extractFilename, setExtractFilename] = useState("");
  const [extractPassword, setExtractPassword] = useState("");
  const [extractPasswordDisabled, setExtractPasswordDisabled] = useState(true);
  const [renameDialogOpened, setRenameDialogOpened] = useState(false);
  const [renameFilename, setRenameFilename] = useState("");
  const [createFolderDialogOpened, setCreateFolderDialogOpened] =
    useState(false);
  const [createFolderName, setCreateFolderName] = useState("");

  const entriesRef = useRef(null);
  const entriesHeightRef = useRef(null);
  const downloaderRef = useRef(null);
  const highlightedEntryRef = useRef(null);
  const addFilesButtonRef = useRef(null);
  const importZipButtonRef = useRef(null);

  const getEntriesElementHeight = () => util.getHeight(entriesRef.current);
  const getHighlightedEntryElement = () => highlightedEntryRef.current;
  const getEntriesHeight = () => entriesHeightRef.current;
  const downloaderElement = downloaderRef.current;
  const addFilesButton = addFilesButtonRef.current;
  const importZipButton = importZipButtonRef.current;

  const closeRenameDialog = () => setRenameDialogOpened(false);
  const closeExtractDialog = () => setExtractDialogOpened(false);
  const closeExportZipDialog = () => setExportZipDialogOpened(false);
  const closeCreateFolderDialog = () => setCreateFolderDialogOpened(false);

  const { downloadFile, updateSelectedFolder } = getCommonFeatures({
    downloadId,
    selectedFolder,
    setDownloadId,
    setDownloads,
    setEntries,
    downloaderElement,
    util
  });
  const {
    highlightPrevious,
    highlightNext,
    highlightPreviousPage,
    highlightNextPage,
    highlightFirst,
    highlightLast,
    highlightFirstLetter,
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
    getEntriesHeight,
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
  const { abortDownload, removeDownload } = getDownloadsFeatures({
    setDownloads,
    util
  });
  const {
    promptCreateFolder,
    createFolder,
    addFiles,
    importZipFile,
    promptExportZip,
    exportZip
  } = getSelectedFolderFeatures({
    selectedFolder,
    setExportZipDialogOpened,
    setExportZipFilename,
    setExportZipPassword,
    setCreateFolderDialogOpened,
    setCreateFolderName,
    updateSelectedFolder,
    highlightEntries,
    removeDownload,
    downloadFile,
    util,
    constants,
    messages
  });
  const {
    copy,
    cut,
    paste,
    promptRename,
    rename,
    remove,
    promptExtract,
    extract
  } = getHighlightedEntriesFeatures({
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
    setExtractFilename,
    setExtractPassword,
    setExtractPasswordDisabled,
    setExtractDialogOpened,
    setRenameFilename,
    setRenameDialogOpened,
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
  const {
    enter,
    saveAccentColor,
    restoreAccentColor,
    resizeEntries,
    stopResizeEntries
  } = getAppFeatures({
    entriesHeight,
    entriesDeltaHeight,
    setEntriesHeight,
    setEntriesDeltaHeight,
    getEntriesElementHeight,
    goIntoFolder,
    promptExtract,
    util,
    constants
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
    disabledEnter
  } = getUIState({
    entries,
    highlightedIds,
    selectedFolder,
    clipboardData,
    historyIndex,
    history
  });
  const { handleKeyUp, handleKeyDown, handlePageUnload } = getEventHandlers({
    zipFilesystem,
    downloads,
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
    promptRename,
    paste,
    remove,
    enter,
    highlightNext,
    highlightPrevious,
    highlightPreviousPage,
    highlightNextPage,
    highlightFirst,
    highlightLast,
    highlightFirstLetter,
    highlightAll,
    togglePrevious,
    toggleNext,
    togglePreviousPage,
    toggleNextPage,
    toggleFirst,
    toggleLast,
    promptCreateFolder,
    promptExportZip,
    navigateBack,
    navigateForward,
    goIntoFolder,
    addFilesButton,
    importZipButton,
    util,
    constants
  });
  const { useKeyUp, useKeyDown, usePageUnload } = getHooks(util);
  const {
    updateHighlightedEntries,
    updateZipFilesystem,
    initAccentColor,
    updateAccentColor
  } = getEffects({
    zipFilesystem,
    accentColor,
    setAccentColor,
    setColorScheme,
    setPreviousHighlightedEntry,
    setToggleNavigationDirection,
    setSelectedFolder,
    setHighlightedIds,
    setClipboardData,
    setHistory,
    setHistoryIndex,
    getHighlightedEntryElement,
    updateSelectedFolder,
    restoreAccentColor,
    saveAccentColor,
    util
  });

  usePageUnload(handlePageUnload);
  useKeyUp(handleKeyUp);
  useKeyDown(handleKeyDown);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(updateZipFilesystem, [zipFilesystem]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(updateHighlightedEntries, [highlightedIds]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(initAccentColor, []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(updateAccentColor, [accentColor]);

  return (
    <div className={"main-container " + colorScheme}>
      <main>
        <TopButtonBar
          disabledExportZipButton={disabledExportZip}
          disabledResetButton={disabledReset}
          onCreateFolder={promptCreateFolder}
          onAddFiles={addFiles}
          onImportZipFile={importZipFile}
          onExportZipFile={promptExportZip}
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
          entriesHeight={entriesHeight}
          deltaEntriesHeight={entriesDeltaHeight}
          clipboardData={clipboardData}
          onAddFiles={addFiles}
          onHighlight={highlight}
          onToggle={toggle}
          onToggleRange={toggleRange}
          onEnter={enter}
          onSetEntriesHeight={setEntriesHeight}
          entriesRef={entriesRef}
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
          onRename={promptRename}
          onRemove={remove}
          onMove={resizeEntries}
          onStopMove={stopResizeEntries}
          messages={messages}
        />
        <DownloadManager
          downloads={downloads}
          onAbortDownload={abortDownload}
          downloaderRef={downloaderRef}
          constants={constants}
          messages={messages}
        />
      </main>
      <InfoBar accentColor={accentColor} onSetAccentColor={setAccentColor} />
      <CreateFolderDialog
        open={createFolderDialogOpened}
        folderName={createFolderName}
        onCreateFolder={createFolder}
        onClose={closeCreateFolderDialog}
        messages={messages}
      />
      <ExportZipDialog
        open={exportZipDialogOpened}
        filename={exportZipFilename}
        password={exportZipPassword}
        onExportZip={exportZip}
        onClose={closeExportZipDialog}
        messages={messages}
      />
      <ExtractDialog
        open={extractDialogOpened}
        filename={extractFilename}
        password={extractPassword}
        passwordDisabled={extractPasswordDisabled}
        onExtract={extract}
        onClose={closeExtractDialog}
        messages={messages}
      />
      <RenameDialog
        open={renameDialogOpened}
        filename={renameFilename}
        onRename={rename}
        onClose={closeRenameDialog}
        messages={messages}
      />
    </div>
  );
}

export default ZipManager;
