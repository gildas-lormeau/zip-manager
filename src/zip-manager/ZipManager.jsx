import "./styles/index.css";

import { useEffect, useState, useRef } from "react";

import * as util from "./misc/dom-util.js";
import {
  filesystemService,
  downloadService,
  i18nService,
  storageService,
  zipService,
  musicService
} from "./services/index.js";
import { getMessages } from "./messages/index.js";
import { getHooks } from "./hooks/hooks.js";
import {
  constants,
  features,
  getUIState,
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
  ImportPasswordDialog,
  OptionsDialog,
  ChooseActionDialog
} from "./components/index.jsx";

const {
  getCommonFeatures,
  getEntriesFeatures,
  getFoldersFeatures,
  getSelectedFolderFeatures,
  getHighlightedEntriesFeatures,
  getFilesystemFeatures,
  getDownloadsFeatures,
  getClipboardFeatures,
  getOptionsFeatures,
  getAppFeatures,
  getMiscFeatures
} = features;
const messages = getMessages({ i18nService });
const randomTrackIndex = Math.floor(
  Math.random() * constants.MUSIC_TRACKS_VOLUMES.length
);

function ZipManager() {
  const apiFilesystem = zipService.createZipFileSystem();
  const [zipFilesystem, setZipFilesystem] = useState(apiFilesystem);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [entries, setEntries] = useState([]);
  const [entriesElementHeight, setEntriesElementHeight] = useState(0);
  const [entriesDeltaHeight, setEntriesDeltaHeight] = useState(0);
  const [highlightedIds, setHighlightedIds] = useState([]);
  const [previousHighlight, setPreviousHighlight] = useState(null);
  const [toggleNavigationDirection, setToggleNavigationDirection] = useState(0);
  const [downloads, setDownloads] = useState([]);
  const [, setDownloadId] = useState(0);
  const [clipboardData, setClipboardData] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [accentColor, setAccentColor] = useState(null);
  const [exportZipDialog, setExportZipDialog] = useState(null);
  const [extractDialog, setExtractDialog] = useState(null);
  const [renameDialog, setRenameDialog] = useState(null);
  const [createFolderDialog, setCreateFolderDialog] = useState(null);
  const [deleteEntryDialog, setDeleteEntryDialog] = useState(null);
  const [resetDialog, setResetDialog] = useState(null);
  const [errorMessageDialog, setErrorMessageDialog] = useState(null);
  const [importPasswordDialog, setImportPasswordDialog] = useState(null);
  const [optionsDialog, setOptionsDialog] = useState(null);
  const [chooseActionDialog, setChooseActionDialog] = useState(null);
  const [clickedButtonName, setClickedButtonName] = useState(null);
  const [musicFrequencyData, setMusicFrequencyData] = useState([]);
  const [musicTrackIndex, setMusicTrackIndex] = useState(randomTrackIndex);
  const appStyleRef = useRef(null);
  const highlightedEntryRef = useRef(null);
  const entriesRef = useRef(null);
  const entriesHeightRef = useRef(null);
  const addFilePickerRef = useRef(null);
  const importZipFilePickerRef = useRef(null);
  const musicPlayerActiveRef = useRef(null);

  const appStyleElement = appStyleRef.current;
  const entriesElement = entriesRef.current;
  const entriesHeight = entriesHeightRef.current;
  const addFilePickerElement = addFilePickerRef.current;
  const importZipFilePickerElement = importZipFilePickerRef.current;
  const musicPlayerActive = musicPlayerActiveRef.current;
  const rootZipFilename = messages.ROOT_ZIP_FILENAME;

  const getHighlightedEntryElement = () => highlightedEntryRef.current;

  const setEntriesHeight = (height) => (entriesHeightRef.current = height);
  const setMusicPlayerActive = (active) =>
    (musicPlayerActiveRef.current = active);

  const { abortDownload, removeDownload } = getDownloadsFeatures({
    setDownloads,
    util
  });
  const { saveEntry, saveEntries, openDisplayError, closeDisplayError } =
    getCommonFeatures({
      setDownloadId,
      setDownloads,
      setErrorMessageDialog,
      removeDownload,
      downloadService,
      filesystemService
    });
  const {
    initOptionsFeatures,
    setOptions,
    getOptions,
    openOptions,
    closeOptions,
    resetOptions
  } = getOptionsFeatures({
    appStyleElement,
    setOptionsDialog,
    zipService,
    storageService,
    util,
    constants
  });
  const {
    disabledExportZip,
    disabledReset,
    disabledNavigation,
    disabledBack,
    disabledForward,
    disabledCopy,
    disabledCut,
    disabledPaste,
    disabledResetClipboardData,
    disabledHighlightAll,
    disabledExtract,
    disabledRename,
    disabledDelete,
    disabledEnter,
    dialogDisplayed,
    hiddenNavigationBar,
    hiddenDownloadManager,
    hiddenInfobar,
    hiddenExportPassword,
    highlightedEntry,
    highlightedEntries,
    selectedFolderEntries
  } = getUIState({
    entries,
    highlightedIds,
    selectedFolder,
    clipboardData,
    historyIndex,
    history,
    getOptions,
    exportZipDialog,
    extractDialog,
    renameDialog,
    createFolderDialog,
    deleteEntryDialog,
    resetDialog,
    errorMessageDialog,
    importPasswordDialog,
    optionsDialog,
    filesystemService
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
    toggleLast,
    moveBottomBar,
    updateEntriesHeight,
    updateEntriesElementHeight,
    updateEntriesElementHeightEnd,
    updateHighlightedEntries,
    registerResizeEntriesHandler
  } = getEntriesFeatures({
    entries,
    selectedFolderEntries,
    previousHighlight,
    highlightedIds,
    toggleNavigationDirection,
    dialogDisplayed,
    entriesElementHeight,
    entriesDeltaHeight,
    entriesElement,
    entriesHeight,
    setHighlightedIds,
    setPreviousHighlight,
    setToggleNavigationDirection,
    setOptions,
    setEntriesHeight,
    setEntriesElementHeight,
    setEntriesDeltaHeight,
    getHighlightedEntryElement,
    getOptions,
    util
  });
  const {
    goIntoFolder,
    navigateBack,
    navigateForward,
    refreshSelectedFolder,
    updateHistoryData
  } = getFoldersFeatures({
    history,
    historyIndex,
    highlightedEntries,
    selectedFolder,
    setSelectedFolder,
    setEntries,
    setHistory,
    setHistoryIndex,
    setHighlightedIds
  });
  const {
    initSelectedFolderFeatures,
    openPromptCreateFolder,
    createFolder,
    closePromptCreateFolder,
    addFiles,
    dropFiles,
    closeChooseAction,
    importZipFile,
    openPromptExportZip,
    exportZip,
    paste,
    closePromptExportZip,
    closePromptImportPassword,
    showAddFilesPicker,
    showImportZipFilePicker
  } = getSelectedFolderFeatures({
    zipFilesystem,
    selectedFolder,
    rootZipFilename,
    clipboardData,
    addFilePickerElement,
    importZipFilePickerElement,
    chooseActionDialog,
    setHighlightedIds,
    setClipboardData,
    setImportPasswordDialog,
    setExportZipDialog,
    setCreateFolderDialog,
    setChooseActionDialog,
    refreshSelectedFolder,
    highlightEntries,
    saveEntry,
    getOptions,
    openDisplayError,
    filesystemService,
    util,
    constants
  });
  const {
    copy,
    cut,
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
    highlightedIds,
    highlightedEntry,
    highlightedEntries,
    setClipboardData,
    setHighlightedIds,
    setPreviousHighlight,
    setExtractDialog,
    setRenameDialog,
    setDeleteEntryDialog,
    refreshSelectedFolder,
    updateHistoryData,
    saveEntries,
    getOptions,
    openDisplayError,
    filesystemService
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
    playMusic,
    stopMusic,
    updateAccentColor,
    playMusicFile,
    initMiscFeatures
  } = getMiscFeatures({
    accentColor,
    musicTrackIndex,
    appStyleElement,
    setOptions,
    setAccentColor,
    setMusicFrequencyData,
    setMusicTrackIndex,
    setMusicPlayerActive,
    getOptions,
    filesystemService,
    musicService,
    util,
    constants
  });
  const {
    enterEntry,
    initAppFeatures,
    updateZipFilesystem,
    resetClickedButtonName,
    getAppClassName
  } = getAppFeatures({
    zipFilesystem,
    appStyleElement,
    hiddenInfobar,
    hiddenDownloadManager,
    setPreviousHighlight,
    setToggleNavigationDirection,
    setSelectedFolder,
    setHighlightedIds,
    setHistory,
    setHistoryIndex,
    setClickedButtonName,
    goIntoFolder,
    openPromptExtract,
    refreshSelectedFolder,
    util,
    constants,
    messages
  });
  const { handleKeyUp, handleKeyDown, handlePageUnload } = getEventHandlers({
    zipFilesystem,
    downloads,
    highlightedEntry,
    selectedFolder,
    disabledCut,
    disabledCopy,
    disabledExtract,
    disabledHighlightAll,
    disabledRename,
    disabledPaste,
    disabledDelete,
    disabledBack,
    disabledForward,
    disabledExportZip,
    disabledEnter,
    disabledNavigation,
    dialogDisplayed,
    enterEntry,
    highlightNext,
    highlightPrevious,
    highlightPreviousPage,
    highlightNextPage,
    highlightFirst,
    highlightLast,
    highlightFirstLetter,
    togglePrevious,
    toggleNext,
    togglePreviousPage,
    toggleNextPage,
    toggleFirst,
    toggleLast,
    goIntoFolder,
    setClickedButtonName,
    util,
    constants
  });
  const { useKeyUp, useKeyDown, usePageUnload } = getHooks(util);
  const appClassName = getAppClassName();

  usePageUnload(handlePageUnload);
  useKeyUp(handleKeyUp);
  useKeyDown(handleKeyDown);

  useEffect(updateZipFilesystem, [zipFilesystem]);
  useEffect(updateHighlightedEntries, [highlightedIds]);
  useEffect(updateAccentColor, [accentColor]);
  useEffect(() => {
    initSelectedFolderFeatures();
    initMiscFeatures();
  }, []);
  useEffect(() => {
    if (appStyleElement) {
      initOptionsFeatures();
      initAppFeatures();
    }
  }, [appStyleElement]);

  return (
    <div className={appClassName}>
      <style ref={appStyleRef}></style>
      <main role="application">
        <TopButtonBar
          disabledExportZipButton={disabledExportZip}
          disabledResetButton={disabledReset}
          clickedButtonName={clickedButtonName}
          onCreateFolder={openPromptCreateFolder}
          onAddFiles={addFiles}
          onImportZipFile={importZipFile}
          onExportZip={openPromptExportZip}
          onReset={openConfirmReset}
          onOpenOptions={openOptions}
          onShowImportZipFilePicker={showImportZipFilePicker}
          onShowAddFilesPicker={showAddFilesPicker}
          onClickedButton={resetClickedButtonName}
          addFilePickerRef={addFilePickerRef}
          importZipFilePickerRef={importZipFilePickerRef}
          constants={constants}
          messages={messages}
        />
        <NavigationBar
          selectedFolder={selectedFolder}
          disabledBackButton={disabledBack}
          disabledForwardButton={disabledForward}
          clickedButtonName={clickedButtonName}
          hidden={hiddenNavigationBar}
          onNavigateBack={navigateBack}
          onNavigateForward={navigateForward}
          onGoIntoFolder={goIntoFolder}
          onClickedButton={resetClickedButtonName}
          constants={constants}
          messages={messages}
        />
        <Entries
          entries={entries}
          selectedFolder={selectedFolder}
          highlightedIds={highlightedIds}
          entriesElementHeight={entriesElementHeight}
          deltaEntriesHeight={entriesDeltaHeight}
          hiddenDownloadManager={hiddenDownloadManager}
          onDropFiles={dropFiles}
          onHighlight={highlight}
          onToggle={toggle}
          onToggleRange={toggleRange}
          onEnter={enterEntry}
          onUpdateEntriesHeight={updateEntriesHeight}
          onUpdateEntriesElementHeight={updateEntriesElementHeight}
          onRegisterResizeEntriesHandler={registerResizeEntriesHandler}
          entriesRef={entriesRef}
          highlightedEntryRef={highlightedEntryRef}
          entriesHeightRef={entriesHeightRef}
          i18nService={i18nService}
          constants={constants}
          messages={messages}
        />
        <BottomButtonBar
          disabledCopyButton={disabledCopy}
          disabledCutButton={disabledCut}
          disabledPasteButton={disabledPaste}
          disabledResetClipboardDataButton={disabledResetClipboardData}
          disabledExtractButton={disabledExtract}
          disabledHighlightAllButton={disabledHighlightAll}
          disabledRenameButton={disabledRename}
          disabledDeleteButton={disabledDelete}
          clickedButtonName={clickedButtonName}
          onCopy={copy}
          onCut={cut}
          onPaste={paste}
          onResetClipboardData={resetClipboardData}
          onExtract={extract}
          onHighlightAll={highlightAll}
          onRename={openPromptRename}
          onRemove={openConfirmDeleteEntry}
          onMove={moveBottomBar}
          onUpdateElementHeight={updateEntriesElementHeightEnd}
          onClickedButton={resetClickedButtonName}
          constants={constants}
          messages={messages}
        />
        <DownloadManager
          downloads={downloads}
          hidden={hiddenDownloadManager}
          onAbortDownload={abortDownload}
          i18nService={i18nService}
          constants={constants}
          messages={messages}
        />
      </main>
      <InfoBar
        hidden={hiddenInfobar}
        accentColor={accentColor}
        musicFrequencyData={musicFrequencyData}
        playMusic={playMusic}
        stopMusic={stopMusic}
        onSetAccentColor={setAccentColor}
        onPlayMusicFile={playMusicFile}
        musicPlayerActive={musicPlayerActive}
        messages={messages}
      />
      <CreateFolderDialog
        data={createFolderDialog}
        onCreateFolder={createFolder}
        onClose={closePromptCreateFolder}
        messages={messages}
      />
      <ExportZipDialog
        data={exportZipDialog}
        hiddenPassword={hiddenExportPassword}
        onExportZip={exportZip}
        onClose={closePromptExportZip}
        messages={messages}
      />
      <ExtractDialog
        data={extractDialog}
        onExtract={extract}
        onClose={closePromptExtract}
        messages={messages}
      />
      <RenameDialog
        data={renameDialog}
        onRename={rename}
        onClose={closePromptRename}
        messages={messages}
      />
      <ResetDialog
        data={resetDialog}
        onReset={reset}
        onClose={closeConfirmReset}
        messages={messages}
      />
      <DeleteEntryDialog
        data={deleteEntryDialog}
        onDeleteEntry={deleteEntry}
        onClose={closeConfirmDeleteEntry}
        messages={messages}
      />
      <ErrorMessageDialog
        data={errorMessageDialog}
        onClose={closeDisplayError}
        messages={messages}
      />
      <ImportPasswordDialog
        data={importPasswordDialog}
        onClose={closePromptImportPassword}
        messages={messages}
      />
      <OptionsDialog
        data={optionsDialog}
        onSetOptions={setOptions}
        onResetOptions={resetOptions}
        onClose={closeOptions}
        messages={messages}
      />
      <ChooseActionDialog
        data={chooseActionDialog}
        onImportZipFile={importZipFile}
        onAddFiles={addFiles}
        onClose={closeChooseAction}
        messages={messages}
      />
    </div>
  );
}

export default ZipManager;
