import "./styles/index.css";

import { useEffect, useState, useRef } from "react";

import {
  filesystemService,
  downloadService,
  i18nService,
  storageService,
  zipService,
  shareTargetService,
  fileHandlersService,
  stylesheetService,
  environmentService,
  keyboardService,
  themeService,
  documentService,
  windowService,
  musicService
} from "./services/index.js";
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
  Downloads,
  InfoBar,
  ExportZipDialog,
  ExtractDialog,
  RenameDialog,
  CreateFolderDialog,
  ResetDialog,
  DeleteEntriesDialog,
  ErrorMessageDialog,
  ImportPasswordDialog,
  OptionsDialog,
  ChooseActionDialog
} from "./components/index.jsx";
import { getMessages } from "./messages/index.js";
import { getHooks } from "./hooks/hooks.js";

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
const apiFilesystem = zipService.createZipFileSystem();
const { root } = apiFilesystem;
const rootZipFilename = messages.ROOT_ZIP_FILENAME;

function ZipManager() {
  const [zipFilesystem, setZipFilesystem] = useState(apiFilesystem);
  const [selectedFolder, setSelectedFolder] = useState(root);
  const [entries, setEntries] = useState([]);
  const [entriesElementHeight, setEntriesElementHeight] = useState(0);
  const [entriesDeltaHeight, setEntriesDeltaHeight] = useState(0);
  const [highlightedIds, setHighlightedIds] = useState([]);
  const [navigation, setNavigation] = useState({
    previousHighlight: null,
    direction: 0
  });
  const [downloads, setDownloads] = useState({ queue: [], nextId: 0 });
  const [clipboardData, setClipboardData] = useState(null);
  const [history, setHistory] = useState({
    path: [root],
    index: 0
  });
  const [dialogs, setDialogs] = useState({});
  const [clickedButtonName, setClickedButtonName] = useState(null);
  const [theme, setTheme] = useState({});
  const [musicData, setMusicData] = useState({
    frequencyData: []
  });

  const highlightedEntryElementRef = useRef(null);
  const entriesElementRef = useRef(null);
  const entriesHeightRef = useRef(1);
  const playerActiveRef = useRef(false);

  const entriesElement = entriesElementRef.current;
  const musicPlayerActive = playerActiveRef.current;

  const getHighlightedEntryElement = () => highlightedEntryElementRef.current;
  const resetHighlightedEntryElement = () =>
    (highlightedEntryElementRef.current = null);
  const getEntriesHeight = () => entriesHeightRef.current;
  const setEntriesHeight = (height) => (entriesHeightRef.current = height);
  const setPlayerActive = (active) => (playerActiveRef.current = active);

  const { abortDownload, removeDownload } = getDownloadsFeatures({
    setDownloads,
    downloadService
  });

  const {
    modifierKeyPressed,
    saveZipFile,
    saveEntries,
    openDisplayError,
    closeDisplayError
  } = getCommonFeatures({
    dialogs,
    setDownloads,
    setDialogs,
    removeDownload,
    downloadService,
    filesystemService,
    environmentService
  });

  const {
    initOptionsFeatures,
    setOptions,
    getOptions,
    openOptions,
    closeOptions,
    resetOptions
  } = getOptionsFeatures({
    dialogs,
    setDialogs,
    setTheme,
    zipService,
    storageService,
    stylesheetService,
    environmentService,
    themeService,
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
    disabledEnterEntry,
    dialogDisplayed,
    hiddenNavigationBar,
    hiddenDownloadManager,
    hiddenInfobar,
    hiddenExportPassword,
    highlightedEntry,
    highlightedEntries,
    selectedFolderEntries,
    ancestorFolders
  } = getUIState({
    entries,
    highlightedIds,
    selectedFolder,
    clipboardData,
    history,
    getOptions,
    dialogs,
    filesystemService
  });

  const {
    highlight,
    highlightEntries,
    highlightAll,
    toggle,
    toggleRange,
    resizeEntries,
    updateEntriesHeight,
    updateEntriesElementHeight,
    updateEntriesElementHeightEnd,
    updateHighlightedEntries,
    registerResizeEntriesHandler,
    onEntriesKeyUp,
    onEntriesKeyDown
  } = getEntriesFeatures({
    disabledNavigation,
    disabledHighlightAll,
    entries,
    selectedFolderEntries,
    highlightedIds,
    navigation,
    dialogDisplayed,
    entriesElementHeight,
    entriesDeltaHeight,
    entriesElement,
    setHighlightedIds,
    resetHighlightedEntryElement,
    setNavigation,
    setOptions,
    setEntriesHeight,
    setEntriesElementHeight,
    setEntriesDeltaHeight,
    setClickedButtonName,
    getEntriesHeight,
    getHighlightedEntryElement,
    getOptions,
    modifierKeyPressed,
    documentService,
    windowService,
    constants
  });

  const {
    goIntoFolder,
    navigateBack,
    navigateForward,
    refreshSelectedFolder,
    updateHistoryData,
    onFoldersKeyUp
  } = getFoldersFeatures({
    disabledBack,
    disabledForward,
    history,
    highlightedEntry,
    highlightedEntries,
    selectedFolder,
    setSelectedFolder,
    setEntries,
    setHistory,
    setHighlightedIds,
    setClickedButtonName,
    modifierKeyPressed,
    constants
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
    showImportZipFilePicker,
    onSelectedFolderKeyDown
  } = getSelectedFolderFeatures({
    disabledPaste,
    disabledExportZip,
    zipFilesystem,
    selectedFolder,
    rootZipFilename,
    clipboardData,
    dialogs,
    setHighlightedIds,
    setClipboardData,
    setDialogs,
    setClickedButtonName,
    refreshSelectedFolder,
    highlightEntries,
    saveZipFile,
    getOptions,
    openDisplayError,
    filesystemService,
    fileHandlersService,
    shareTargetService,
    modifierKeyPressed,
    constants
  });

  const {
    copy,
    cut,
    openPromptRename,
    rename,
    closePromptRename,
    openConfirmDeleteEntries,
    deleteEntries,
    closeConfirmDeleteEntries,
    openPromptExtract,
    extract,
    closePromptExtract,
    onHighlightedEntriesKeyUp,
    onHighlightedEntriesKeyDown
  } = getHighlightedEntriesFeatures({
    disabledCopy,
    disabledCut,
    disabledExtract,
    disabledRename,
    disabledDelete,
    zipFilesystem,
    entries,
    highlightedIds,
    highlightedEntry,
    highlightedEntries,
    navigation,
    dialogs,
    setClipboardData,
    setHighlightedIds,
    setNavigation,
    setDialogs,
    setClickedButtonName,
    refreshSelectedFolder,
    updateHistoryData,
    saveEntries,
    getOptions,
    openDisplayError,
    filesystemService,
    modifierKeyPressed,
    constants
  });

  const { openConfirmReset, reset, closeConfirmReset } = getFilesystemFeatures({
    dialogs,
    setZipFilesystem,
    setDialogs,
    zipService
  });

  const { resetClipboardData } = getClipboardFeatures({
    setClipboardData
  });

  const {
    playMusic,
    stopMusic,
    updateAccentColor,
    updateSkin,
    initMiscFeatures
  } = getMiscFeatures({
    theme,
    setOptions,
    setTheme,
    setMusicData,
    setPlayerActive,
    getOptions,
    stylesheetService,
    themeService,
    musicService,
    constants
  });

  const {
    enterEntry,
    initAppFeatures,
    updateZipFilesystem,
    resetClickedButtonName,
    getAppClassName,
    onAppKeyUp
  } = getAppFeatures({
    disabledEnterEntry,
    zipFilesystem,
    highlightedEntry,
    selectedFolder,
    hiddenInfobar,
    hiddenDownloadManager,
    setNavigation,
    setSelectedFolder,
    setHighlightedIds,
    setHistory,
    setClickedButtonName,
    goIntoFolder,
    openPromptExtract,
    refreshSelectedFolder,
    modifierKeyPressed,
    stylesheetService,
    documentService,
    i18nService,
    constants,
    messages
  });

  const { useKeyUp, useKeyDown, usePageUnload } = getHooks({
    keyboardService,
    windowService
  });

  const { handleKeyUp, handleKeyDown, handlePageUnload } = getEventHandlers({
    entries,
    downloads,
    dialogDisplayed,
    onEntriesKeyUp,
    onFoldersKeyUp,
    onHighlightedEntriesKeyUp,
    onAppKeyUp,
    onEntriesKeyDown,
    onHighlightedEntriesKeyDown,
    onSelectedFolderKeyDown
  });

  const appClassName = getAppClassName();

  useKeyUp(handleKeyUp);
  useKeyDown(handleKeyDown);
  usePageUnload(handlePageUnload);

  useEffect(updateZipFilesystem, [zipFilesystem]);
  useEffect(updateHighlightedEntries, [highlightedIds]);
  useEffect(updateAccentColor, [theme.accentColor]);
  useEffect(updateSkin, [theme.skin]);
  useEffect(() => {
    initSelectedFolderFeatures();
    initMiscFeatures();
    initOptionsFeatures();
    initAppFeatures();
  }, []);

  return (
    <div className={appClassName}>
      <main>
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
          constants={constants}
          messages={messages}
        />
        <NavigationBar
          selectedFolder={selectedFolder}
          ancestorFolders={ancestorFolders}
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
          entriesElementRef={entriesElementRef}
          highlightedEntryElementRef={highlightedEntryElementRef}
          i18n={i18nService}
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
          onRemove={openConfirmDeleteEntries}
          onMove={resizeEntries}
          onUpdateElementHeight={updateEntriesElementHeightEnd}
          onClickedButton={resetClickedButtonName}
          constants={constants}
          messages={messages}
        />
        <Downloads
          downloads={downloads}
          hidden={hiddenDownloadManager}
          onAbortDownload={abortDownload}
          i18n={i18nService}
          constants={constants}
          messages={messages}
        />
      </main>
      <InfoBar
        hidden={hiddenInfobar}
        theme={theme}
        musicData={musicData}
        onPlayMusic={playMusic}
        onStopMusic={stopMusic}
        onSetTheme={setTheme}
        musicPlayerActive={musicPlayerActive}
        constants={constants}
        messages={messages}
      />
      <CreateFolderDialog
        data={dialogs.createFolder}
        onCreateFolder={createFolder}
        onClose={closePromptCreateFolder}
        messages={messages}
      />
      <ExportZipDialog
        data={dialogs.exportZip}
        hiddenPassword={hiddenExportPassword}
        onExportZip={exportZip}
        onClose={closePromptExportZip}
        messages={messages}
      />
      <ExtractDialog
        data={dialogs.extract}
        onExtract={extract}
        onClose={closePromptExtract}
        messages={messages}
      />
      <RenameDialog
        data={dialogs.rename}
        onRename={rename}
        onClose={closePromptRename}
        messages={messages}
      />
      <ResetDialog
        data={dialogs.reset}
        onReset={reset}
        onClose={closeConfirmReset}
        messages={messages}
      />
      <DeleteEntriesDialog
        data={dialogs.deleteEntries}
        onDeleteEntries={deleteEntries}
        onClose={closeConfirmDeleteEntries}
        messages={messages}
      />
      <ErrorMessageDialog
        data={dialogs.displayError}
        onClose={closeDisplayError}
        messages={messages}
      />
      <ImportPasswordDialog
        data={dialogs.enterImportPassword}
        onClose={closePromptImportPassword}
        messages={messages}
      />
      <OptionsDialog
        data={dialogs.options}
        onSetOptions={setOptions}
        onResetOptions={resetOptions}
        onClose={closeOptions}
        messages={messages}
      />
      <ChooseActionDialog
        data={dialogs.chooseAction}
        onImportZipFile={importZipFile}
        onAddFiles={addFiles}
        onClose={closeChooseAction}
        messages={messages}
      />
    </div>
  );
}

export default ZipManager;
