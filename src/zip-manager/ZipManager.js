import "./styles/index.css";

import { useEffect, useState, useRef } from "react";

import * as util from "./misc/dom-util.js";
import * as messages from "./messages/en-US.js";
import * as zipService from "./services/zip-service.js";
import { getStorageService } from "./services/storage-service.js";

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
  ImportPasswordDialog,
  OptionsDialog,
  ChooseActionDialog
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
const storageService = getStorageService({ util });

function ZipManager() {
  const apiFilesystem = zipService.createZipFileSystem();
  const [zipFilesystem, setZipFilesystem] = useState(apiFilesystem);
  const [selectedFolderInit, setSelectedFolderInit] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [entries, setEntries] = useState([]);
  const [entriesHeight, setEntriesHeight] = useState(0);
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
  const [colorScheme, setColorScheme] = useState("");
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
  const entriesRef = useRef(null);
  const entriesHeightRef = useRef(null);
  const downloaderRef = useRef(null);
  const highlightedEntryRef = useRef(null);

  const getEntriesElementHeight = () => util.getHeight(entriesRef.current);
  const getHighlightedEntryElement = () => highlightedEntryRef.current;
  const getEntriesHeight = () => entriesHeightRef.current;
  const downloaderElement = downloaderRef.current;
  const rootZipFilename = messages.ROOT_ZIP_FILENAME;
  const appClassName = [constants.APP_CLASSNAME, colorScheme].join(" ").trim();

  const { abortDownload, removeDownload } = getDownloadsFeatures({
    setDownloads,
    util
  });
  const {
    saveEntry,
    saveEntries,
    refreshSelectedFolder,
    setOptions,
    getOptions,
    openDisplayError,
    closeDisplayError,
    resetClickedButtonName
  } = getCommonFeatures({
    selectedFolder,
    setDownloadId,
    setDownloads,
    setEntries,
    setErrorMessageDialog,
    setClickedButtonName,
    removeDownload,
    downloaderElement,
    zipService,
    storageService,
    util,
    constants
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
    selectedFolder,
    previousHighlight,
    highlightedIds,
    toggleNavigationDirection,
    getEntriesHeight,
    setHighlightedIds,
    setPreviousHighlight,
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
    refreshSelectedFolder
  });
  const {
    openPromptCreateFolder,
    createFolder,
    closePromptCreateFolder,
    addFiles,
    dropFiles,
    closeChooseAction,
    importZipFile,
    openPromptExportZip,
    exportZip,
    closePromptExportZip,
    closePromptImportPassword
  } = getSelectedFolderFeatures({
    zipFilesystem,
    selectedFolder,
    rootZipFilename,
    chooseActionDialog,
    setImportPasswordDialog,
    setExportZipDialog,
    setCreateFolderDialog,
    setChooseActionDialog,
    refreshSelectedFolder,
    highlightEntries,
    saveEntry,
    getOptions,
    openDisplayError,
    util,
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
    setPreviousHighlight,
    setExtractDialog,
    setRenameDialog,
    setDeleteEntryDialog,
    refreshSelectedFolder,
    saveEntries,
    getOptions,
    openDisplayError,
    util
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
    hideNavigationBar,
    hideDownloadManager,
    hideInfobar,
    hideExportPassword
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
    util
  });
  const {
    initApplication,
    initZipFilesystem,
    initSelectedFolder,
    enter,
    openOptions,
    closeOptions,
    resetOptions,
    saveAccentColor,
    moveBottomBar,
    updateEntriesHeight,
    saveEntriesHeight,
    updateEntriesHeightEnd
  } = getAppFeatures({
    zipFilesystem,
    dialogDisplayed,
    entriesHeight,
    entriesDeltaHeight,
    selectedFolderInit,
    setPreviousHighlight,
    setToggleNavigationDirection,
    setSelectedFolder,
    setHighlightedIds,
    setClipboardData,
    setOptions,
    setHistory,
    setHistoryIndex,
    setAccentColor,
    setEntriesHeight,
    setEntriesDeltaHeight,
    setSelectedFolderInit,
    getEntriesElementHeight,
    setOptionsDialog,
    getOptions,
    goIntoFolder,
    openPromptExtract,
    addFiles,
    importZipFile,
    refreshSelectedFolder,
    storageService,
    util,
    constants
  });
  const { handleKeyUp, handleKeyDown, handlePageUnload } = getEventHandlers({
    zipFilesystem,
    downloads,
    highlightedIds,
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
    enter,
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
  const {
    updateApplication,
    updateSelectedFolder,
    updateHighlightedEntries,
    updateZipFilesystem,
    updateAccentColor
  } = getEffects({
    selectedFolder,
    accentColor,
    setColorScheme,
    getHighlightedEntryElement,
    initApplication,
    initZipFilesystem,
    initSelectedFolder,
    saveAccentColor,
    util
  });

  usePageUnload(handlePageUnload);
  useKeyUp(handleKeyUp);
  useKeyDown(handleKeyDown);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(updateZipFilesystem, [zipFilesystem]);
  useEffect(updateHighlightedEntries, [highlightedIds]);
  useEffect(updateAccentColor, [accentColor]);
  useEffect(updateSelectedFolder, [selectedFolder]);
  useEffect(updateApplication, []);
  /* eslint-enable react-hooks/exhaustive-deps */

  return (
    <div className={appClassName}>
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
          onClickedButton={resetClickedButtonName}
          util={util}
          constants={constants}
          messages={messages}
        />
        <NavigationBar
          selectedFolder={selectedFolder}
          disabledBackButton={disabledBack}
          disabledForwardButton={disabledForward}
          clickedButtonName={clickedButtonName}
          hidden={hideNavigationBar}
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
          entriesHeight={entriesHeight}
          deltaEntriesHeight={entriesDeltaHeight}
          hideDownloadManager={hideDownloadManager}
          onDropFiles={dropFiles}
          onHighlight={highlight}
          onToggle={toggle}
          onToggleRange={toggleRange}
          onEnter={enter}
          onSaveHeight={saveEntriesHeight}
          onUpdateHeight={updateEntriesHeight}
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
          disabledExtractButton={disabledExtract}
          disabledHighlightAllButton={disabledHighlightAll}
          disabledRenameButton={disabledRename}
          disabledDeleteButton={disabledDelete}
          hideDownloadManager={hideDownloadManager}
          hideInfobar={hideInfobar}
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
          onUpdateHeight={updateEntriesHeightEnd}
          onClickedButton={resetClickedButtonName}
          constants={constants}
          messages={messages}
        />
        <DownloadManager
          downloads={downloads}
          hidden={hideDownloadManager}
          hideInfobar={hideInfobar}
          onAbortDownload={abortDownload}
          downloaderRef={downloaderRef}
          constants={constants}
          messages={messages}
        />
      </main>
      <InfoBar
        hidden={hideInfobar}
        accentColor={accentColor}
        onSetAccentColor={setAccentColor}
      />
      <CreateFolderDialog
        data={createFolderDialog}
        onCreateFolder={createFolder}
        onClose={closePromptCreateFolder}
        messages={messages}
      />
      <ExportZipDialog
        data={exportZipDialog}
        hidePassword={hideExportPassword}
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
