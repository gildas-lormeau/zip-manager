import "./styles/index.css";

import { useEffect } from "react";

import {
  i18nService,
  zipService,
  keyboardService,
  windowService
} from "./services/index.js";
import {
  ZipManagerView
} from "./components/index.jsx";
import { getMessages } from "./messages/index.js";
import { getHooks } from "./hooks/hooks.js";
import useZipManagerState from "./hooks/useZipManagerState.js";
import useZipManagerFeatureWiring from "./hooks/useZipManagerFeatureWiring.js";

const { useKeyUp, useKeyDown, usePageUnload } = getHooks({
  keyboardService,
  windowService
});

const messages = getMessages({ i18nService });
const apiFilesystem = zipService.createZipFileSystem();
const { root } = apiFilesystem;
const rootZipFilename = messages.ROOT_ZIP_FILENAME;

function ZipManager() {
  const {
    zipFilesystem,
    setZipFilesystem,
    selectedFolder,
    setSelectedFolder,
    entries,
    setEntries,
    highlightedIds,
    setHighlightedIds,
    navigation,
    setNavigation,
    downloads,
    setDownloads,
    clipboardData,
    setClipboardData,
    history,
    setHistory,
    entriesHeight,
    setEntriesHeight,
    entriesElementHeight,
    setEntriesElementHeight,
    entriesDeltaHeight,
    setEntriesDeltaHeight,
    dialogs,
    setDialogs,
    clickedButtonName,
    setClickedButtonName,
    theme,
    setTheme,
    musicData,
    setMusicData,
    playerActive,
    setPlayerActive,
    highlightedEntryElementRef,
    entriesElementRef,
    getHighlightedEntryElement,
    resetHighlightedEntryElement
  } = useZipManagerState({ apiFilesystem, root });

  const {
    constants,
    appClassName,
    abortDownload,
    closeDisplayError,
    openOptions,
    closeOptions,
    setOptions,
    resetOptions,
    disabledExportZip,
    disabledReset,
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
    hiddenNavigationBar,
    hiddenDownloadManager,
    hiddenInfobar,
    hiddenExportPassword,
    ancestorFolders,
    highlight,
    highlightAll,
    toggleRange,
    resizeEntries,
    updateEntriesElementHeight,
    updateHighlightedEntries,
    navigateBack,
    navigateForward,
    goIntoFolder,
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
    copy,
    cut,
    openPromptRename,
    rename,
    closePromptRename,
    openConfirmDeleteEntries,
    deleteEntries,
    closeConfirmDeleteEntries,
    extract,
    closePromptExtract,
    openConfirmReset,
    reset,
    closeConfirmReset,
    resetClipboardData,
    initMiscFeatures,
    playMusic,
    stopMusic,
    updateAccentColor,
    updateSkin,
    initAppFeatures,
    enterEntry,
    updateZipFilesystem,
    resetClickedButtonName,
    handleKeyUp,
    handleKeyDownEvent,
    handlePageUnload,
    handleToggleEntry,
    updateEntriesHeightWithElement,
    registerResizeEntriesHandlerWithElement,
    updateEntriesElementHeightEndWithElement,
    initOptionsFeatures
  } = useZipManagerFeatureWiring({
    state: {
      zipFilesystem,
      setZipFilesystem,
      selectedFolder,
      setSelectedFolder,
      entries,
      setEntries,
      highlightedIds,
      setHighlightedIds,
      navigation,
      setNavigation,
      downloads,
      setDownloads,
      clipboardData,
      setClipboardData,
      history,
      setHistory,
      entriesHeight,
      setEntriesHeight,
      entriesElementHeight,
      setEntriesElementHeight,
      entriesDeltaHeight,
      setEntriesDeltaHeight,
      dialogs,
      setDialogs,
      setClickedButtonName,
      theme,
      setTheme,
      setMusicData,
      setPlayerActive,
      entriesElementRef,
      resetHighlightedEntryElement
    },
    rootZipFilename,
    messages
  });

  useKeyUp(handleKeyUp);
  useKeyDown(handleKeyDownEvent);
  usePageUnload(handlePageUnload);

  useEffect(updateZipFilesystem, [zipFilesystem]);
  useEffect(() => updateHighlightedEntries(getHighlightedEntryElement()), [highlightedIds]);
  useEffect(updateAccentColor, [theme.accentColor]);
  useEffect(updateSkin, [theme.skin]);
  useEffect(() => {
    initSelectedFolderFeatures();
    initMiscFeatures();
    initOptionsFeatures();
    initAppFeatures();
  }, []);

  const viewState = {
    appClassName,
    entries,
    selectedFolder,
    highlightedIds,
    entriesElementHeight,
    entriesDeltaHeight,
    highlightedEntryElementRef,
    entriesElementRef,
    downloads,
    dialogs,
    clickedButtonName,
    theme,
    musicData,
    playerActive
  };

  const viewUI = {
    constants,
    messages,
    i18n: i18nService,
    disabledExportZip,
    disabledReset,
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
    hiddenNavigationBar,
    hiddenDownloadManager,
    hiddenInfobar,
    hiddenExportPassword,
    ancestorFolders
  };

  const viewActions = {
    openPromptCreateFolder,
    importZipFile,
    openPromptExportZip,
    openConfirmReset,
    openOptions,
    showImportZipFilePicker,
    showAddFilesPicker,
    resetClickedButtonName,
    navigateBack,
    navigateForward,
    goIntoFolder,
    dropFiles,
    highlight,
    handleToggleEntry,
    toggleRange,
    enterEntry,
    updateEntriesHeightWithElement,
    updateEntriesElementHeight,
    registerResizeEntriesHandlerWithElement,
    copy,
    cut,
    paste,
    resetClipboardData,
    extract,
    highlightAll,
    openPromptRename,
    openConfirmDeleteEntries,
    resizeEntries,
    updateEntriesElementHeightEndWithElement,
    abortDownload,
    playMusic,
    stopMusic,
    setTheme,
    createFolder,
    closePromptCreateFolder,
    exportZip,
    closePromptExportZip,
    closePromptExtract,
    rename,
    closePromptRename,
    reset,
    closeConfirmReset,
    deleteEntries,
    closeConfirmDeleteEntries,
    closeDisplayError,
    closePromptImportPassword,
    setOptions,
    resetOptions,
    closeOptions,
    addFiles,
    closeChooseAction
  };

  return (
    <ZipManagerView state={viewState} ui={viewUI} actions={viewActions} />
  );
}

export default ZipManager;
