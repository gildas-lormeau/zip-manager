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

  return (
    <ZipManagerView
      appClassName={appClassName}
      entries={entries}
      selectedFolder={selectedFolder}
      highlightedIds={highlightedIds}
      entriesElementHeight={entriesElementHeight}
      entriesDeltaHeight={entriesDeltaHeight}
      highlightedEntryElementRef={highlightedEntryElementRef}
      entriesElementRef={entriesElementRef}
      downloads={downloads}
      dialogs={dialogs}
      clickedButtonName={clickedButtonName}
      theme={theme}
      musicData={musicData}
      playerActive={playerActive}
      constants={constants}
      messages={messages}
      i18n={i18nService}
      disabledExportZip={disabledExportZip}
      disabledReset={disabledReset}
      disabledBack={disabledBack}
      disabledForward={disabledForward}
      disabledCopy={disabledCopy}
      disabledCut={disabledCut}
      disabledPaste={disabledPaste}
      disabledResetClipboardData={disabledResetClipboardData}
      disabledHighlightAll={disabledHighlightAll}
      disabledExtract={disabledExtract}
      disabledRename={disabledRename}
      disabledDelete={disabledDelete}
      hiddenNavigationBar={hiddenNavigationBar}
      hiddenDownloadManager={hiddenDownloadManager}
      hiddenInfobar={hiddenInfobar}
      hiddenExportPassword={hiddenExportPassword}
      ancestorFolders={ancestorFolders}
      openPromptCreateFolder={openPromptCreateFolder}
      importZipFile={importZipFile}
      openPromptExportZip={openPromptExportZip}
      openConfirmReset={openConfirmReset}
      openOptions={openOptions}
      showImportZipFilePicker={showImportZipFilePicker}
      showAddFilesPicker={showAddFilesPicker}
      resetClickedButtonName={resetClickedButtonName}
      navigateBack={navigateBack}
      navigateForward={navigateForward}
      goIntoFolder={goIntoFolder}
      dropFiles={dropFiles}
      highlight={highlight}
      handleToggleEntry={handleToggleEntry}
      toggleRange={toggleRange}
      enterEntry={enterEntry}
      updateEntriesHeightWithElement={updateEntriesHeightWithElement}
      updateEntriesElementHeight={updateEntriesElementHeight}
      registerResizeEntriesHandlerWithElement={registerResizeEntriesHandlerWithElement}
      copy={copy}
      cut={cut}
      paste={paste}
      resetClipboardData={resetClipboardData}
      extract={extract}
      highlightAll={highlightAll}
      openPromptRename={openPromptRename}
      openConfirmDeleteEntries={openConfirmDeleteEntries}
      resizeEntries={resizeEntries}
      updateEntriesElementHeightEndWithElement={updateEntriesElementHeightEndWithElement}
      abortDownload={abortDownload}
      playMusic={playMusic}
      stopMusic={stopMusic}
      setTheme={setTheme}
      createFolder={createFolder}
      closePromptCreateFolder={closePromptCreateFolder}
      exportZip={exportZip}
      closePromptExportZip={closePromptExportZip}
      closePromptExtract={closePromptExtract}
      rename={rename}
      closePromptRename={closePromptRename}
      reset={reset}
      closeConfirmReset={closeConfirmReset}
      deleteEntries={deleteEntries}
      closeConfirmDeleteEntries={closeConfirmDeleteEntries}
      closeDisplayError={closeDisplayError}
      closePromptImportPassword={closePromptImportPassword}
      setOptions={setOptions}
      resetOptions={resetOptions}
      closeOptions={closeOptions}
      addFiles={addFiles}
      closeChooseAction={closeChooseAction}
    />
  );
}

export default ZipManager;
