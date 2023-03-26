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
  CreateFolderDialog,
  ResetDialog,
  DeleteEntryDialog,
  ErrorMessageDialog,
  ImportPasswordDialog
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
  const [exportZipDialog, setExportZipDialog] = useState(null);
  const [extractDialog, setExtractDialog] = useState(null);
  const [renameDialog, setRenameDialog] = useState(null);
  const [createFolderDialog, setCreateFolderDialog] = useState(null);
  const [deleteEntryDialog, setDeleteEntryDialog] = useState(null);
  const [resetDialog, setResetDialog] = useState(null);
  const [errorMessageDialog, setErrorMessageDialog] = useState(null);
  const [importPasswordDialog, setImportPasswordDialog] = useState(null);
  const importPasswordCallbackRef = useRef(null);
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
  const rootZipFilename = messages.ROOT_ZIP_FILENAME;
  const setImportPassword = ({ password }) =>
    importPasswordCallbackRef.current(password);
  const setImportPasswordCallback = (callback) =>
    (importPasswordCallbackRef.current = callback);

  const {
    downloadFile,
    updateSelectedFolder,
    openDisplayError,
    closeDisplayError,
    closePromptImportPassword
  } = getCommonFeatures({
    downloadId,
    selectedFolder,
    setDownloadId,
    setDownloads,
    setEntries,
    setErrorMessageDialog,
    setImportPasswordDialog,
    setImportPasswordCallback,
    downloaderElement,
    zipService,
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
    openPromptCreateFolder,
    createFolder,
    closePromptCreateFolder,
    addFiles,
    importZipFile,
    openPromptExportZip,
    exportZip,
    closePromptExportZip
  } = getSelectedFolderFeatures({
    selectedFolder,
    rootZipFilename,
    setExportZipDialog,
    setCreateFolderDialog,
    updateSelectedFolder,
    highlightEntries,
    removeDownload,
    downloadFile,
    openDisplayError,
    constants
  });
  const {
    copy,
    cut,
    paste,
    openPromptRename,
    rename,
    closePromptRename,
    openConfirmDeleteEntry,
    deleteEntry,
    closeConfirmDeleteEntry,
    openPromptExtract,
    extract,
    closePromptExtract
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
    setExtractDialog,
    setRenameDialog,
    setDeleteEntryDialog,
    removeDownload,
    updateSelectedFolder,
    downloadFile,
    openDisplayError,
    constants
  });
  const { openConfirmReset, reset, closeConfirmReset } = getFilesystemFeatures({
    zipService,
    setZipFilesystem,
    setResetDialog
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
    openPromptExtract,
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
    openPromptRename,
    paste,
    openConfirmDeleteEntry,
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
    openPromptCreateFolder,
    openPromptExportZip,
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
          onCreateFolder={openPromptCreateFolder}
          onAddFiles={addFiles}
          onImportZipFile={importZipFile}
          onExportZipFile={openPromptExportZip}
          onReset={openConfirmReset}
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
          onRename={openPromptRename}
          onRemove={openConfirmDeleteEntry}
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
        createFolderDialog={createFolderDialog}
        onCreateFolder={createFolder}
        onClose={closePromptCreateFolder}
        messages={messages}
      />
      <ExportZipDialog
        exportZipDialog={exportZipDialog}
        onExportZip={exportZip}
        onClose={closePromptExportZip}
        messages={messages}
      />
      <ExtractDialog
        extractDialog={extractDialog}
        onExtract={extract}
        onClose={closePromptExtract}
        messages={messages}
      />
      <RenameDialog
        renameDialog={renameDialog}
        onRename={rename}
        onClose={closePromptRename}
        messages={messages}
      />
      <ResetDialog
        resetDialog={resetDialog}
        onReset={reset}
        onClose={closeConfirmReset}
        messages={messages}
      />
      <DeleteEntryDialog
        deleteEntryDialog={deleteEntryDialog}
        onDeleteEntry={deleteEntry}
        onClose={closeConfirmDeleteEntry}
        messages={messages}
      />
      <ErrorMessageDialog
        errorMessageDialog={errorMessageDialog}
        onClose={closeDisplayError}
        messages={messages}
      />
      <ImportPasswordDialog
        importPasswordDialog={importPasswordDialog}
        onSetPassword={setImportPassword}
        onClose={closePromptImportPassword}
        messages={messages}
      />
    </div>
  );
}

export default ZipManager;
