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
  ErrorMessageDialog
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
  const [deleteEntryDialogOpened, setDeleteEntryDialogOpened] = useState(false);
  const [resetDialogOpened, setResetDialogOpened] = useState(false);
  const [errorMessageDialogOpened, setErrorMessageDialogOpened] =
    useState(false);
  const [errorMessage, setErrorMessage] = useState("");
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

  const {
    downloadFile,
    updateSelectedFolder,
    openDisplayError,
    closeDisplayError
  } = getCommonFeatures({
    downloadId,
    selectedFolder,
    setDownloadId,
    setDownloads,
    setEntries,
    setErrorMessageDialogOpened,
    setErrorMessage,
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
    rootZipFilename: messages.ROOT_ZIP_FILENAME,
    setExportZipDialogOpened,
    setExportZipFilename,
    setExportZipPassword,
    setCreateFolderDialogOpened,
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
    setExtractFilename,
    setExtractPassword,
    setExtractPasswordDisabled,
    setExtractDialogOpened,
    setRenameFilename,
    setRenameDialogOpened,
    setDeleteEntryDialogOpened,
    removeDownload,
    updateSelectedFolder,
    downloadFile,
    openDisplayError,
    constants
  });
  const { openConfirmReset, reset, closeConfirmReset } = getFilesystemFeatures({
    zipService,
    setZipFilesystem,
    setResetDialogOpened
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
        open={createFolderDialogOpened}
        onCreateFolder={createFolder}
        onClose={closePromptCreateFolder}
        messages={messages}
      />
      <ExportZipDialog
        open={exportZipDialogOpened}
        filename={exportZipFilename}
        password={exportZipPassword}
        onExportZip={exportZip}
        onClose={closePromptExportZip}
        messages={messages}
      />
      <ExtractDialog
        open={extractDialogOpened}
        filename={extractFilename}
        password={extractPassword}
        passwordDisabled={extractPasswordDisabled}
        onExtract={extract}
        onClose={closePromptExtract}
        messages={messages}
      />
      <RenameDialog
        open={renameDialogOpened}
        filename={renameFilename}
        onRename={rename}
        onClose={closePromptRename}
        messages={messages}
      />
      <ResetDialog
        open={resetDialogOpened}
        onReset={reset}
        onClose={closeConfirmReset}
        messages={messages}
      />
      <DeleteEntryDialog
        open={deleteEntryDialogOpened}
        onDeleteEntry={deleteEntry}
        onClose={closeConfirmDeleteEntry}
        messages={messages}
      />
      <ErrorMessageDialog
        open={errorMessageDialogOpened}
        onClose={closeDisplayError}
        message={errorMessage}
        messages={messages}
      />
    </div>
  );
}

export default ZipManager;
