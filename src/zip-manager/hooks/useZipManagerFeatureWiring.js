import { useEffect, useEffectEvent } from "react";

import {
  constants,
  features,
  getEventHandlers
} from "../business/index.js";
import {
  filesystemService,
  downloadService,
  storageService,
  zipService,
  shareTargetService,
  fileHandlersService,
  stylesheetService,
  environmentService,
  themeService,
  documentService,
  windowService,
  i18nService,
  musicService
} from "../services/index.js";
import useZipManagerUIState from "./useZipManagerUIState.js";

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

function useZipManagerFeatureWiring({ state, rootZipFilename, messages }) {
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
    setClickedButtonName,
    theme,
    setTheme,
    setMusicData,
    setPlayerActive,
    entriesElementRef,
    getHighlightedEntryElement,
    resetHighlightedEntryElement
  } = state;

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
  } = useZipManagerUIState({
    entries,
    highlightedIds,
    selectedFolder,
    clipboardData,
    history,
    dialogs,
    getOptions
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
    handleEntriesResize,
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
    entriesHeight,
    entriesElementHeight,
    entriesDeltaHeight,
    modifierKeyPressed,
    setHighlightedIds,
    setNavigation,
    setOptions,
    setEntriesHeight,
    setEntriesElementHeight,
    setEntriesDeltaHeight,
    setClickedButtonName,
    getOptions,
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
    modifierKeyPressed,
    setSelectedFolder,
    setEntries,
    setHistory,
    setHighlightedIds,
    setClickedButtonName,
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
    modifierKeyPressed,
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
    modifierKeyPressed,
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
    initMiscFeatures,
    playMusic,
    stopMusic,
    updateAccentColor,
    updateSkin
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
    initAppFeatures,
    enterEntry,
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
    modifierKeyPressed,
    setNavigation,
    setSelectedFolder,
    setHighlightedIds,
    setHistory,
    setClickedButtonName,
    goIntoFolder,
    openPromptExtract,
    refreshSelectedFolder,
    stylesheetService,
    documentService,
    i18nService,
    constants,
    messages
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

  function handleKeyDownEvent(event) {
    handleKeyDown(event, resetHighlightedEntryElement);
  }

  function handleToggleEntry(entry) {
    toggle(entry, resetHighlightedEntryElement);
  }

  const onEntriesResize = useEffectEvent(() =>
    handleEntriesResize(entriesElementRef.current, getHighlightedEntryElement())
  );
  const onWindowResize = useEffectEvent(updateEntriesElementHeight);
  const registerResizeEntriesHandlers = useEffectEvent(() =>
    registerResizeEntriesHandler(entriesElementRef.current, {
      onEntriesResize: () => onEntriesResize(),
      onWindowResize: () => onWindowResize()
    })
  );

  useEffect(() => registerResizeEntriesHandlers(), []);

  function updateEntriesHeightWithElement() {
    updateEntriesHeight(entriesElementRef.current, getHighlightedEntryElement());
  }

  function updateEntriesElementHeightEndWithElement() {
    updateEntriesElementHeightEnd(entriesElementRef.current);
  }

  return {
    constants,
    appClassName: getAppClassName(),
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
    openPromptExtract,
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
    updateEntriesElementHeightEndWithElement,
    initOptionsFeatures
  };
}

export default useZipManagerFeatureWiring;
