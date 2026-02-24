import "./styles/index.css";

import { useEffect } from "react";

import {
  i18nService,
  zipService,
  keyboardService,
  windowService
} from "./services/index.js";
import {
  TopButtonBar,
  NavigationBar,
  Entries,
  BottomButtonBar,
  Downloads,
  InfoBar,
  DialogsContainer
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
    <div className={appClassName}>
      <main>
        <TopButtonBar
          disabledExportZipButton={disabledExportZip}
          disabledResetButton={disabledReset}
          clickedButtonName={clickedButtonName}
          onCreateFolder={openPromptCreateFolder}
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
          onToggle={handleToggleEntry}
          onToggleRange={toggleRange}
          onEnter={enterEntry}
          onUpdateEntriesHeight={updateEntriesHeightWithElement}
          onUpdateEntriesElementHeight={updateEntriesElementHeight}
          onRegisterResizeEntriesHandler={registerResizeEntriesHandlerWithElement}
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
          onUpdateElementHeight={updateEntriesElementHeightEndWithElement}
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
        playerActive={playerActive}
        onPlayMusic={playMusic}
        onStopMusic={stopMusic}
        onSetTheme={setTheme}
        constants={constants}
        messages={messages}
      />
      <DialogsContainer
        dialogs={dialogs}
        hiddenExportPassword={hiddenExportPassword}
        messages={messages}
        onCreateFolder={createFolder}
        onCloseCreateFolder={closePromptCreateFolder}
        onExportZip={exportZip}
        onCloseExportZip={closePromptExportZip}
        onExtract={extract}
        onCloseExtract={closePromptExtract}
        onRename={rename}
        onCloseRename={closePromptRename}
        onReset={reset}
        onCloseReset={closeConfirmReset}
        onDeleteEntries={deleteEntries}
        onCloseDeleteEntries={closeConfirmDeleteEntries}
        onCloseDisplayError={closeDisplayError}
        onCloseImportPassword={closePromptImportPassword}
        onSetOptions={setOptions}
        onResetOptions={resetOptions}
        onCloseOptions={closeOptions}
        onImportZipFile={importZipFile}
        onAddFiles={addFiles}
        onCloseChooseAction={closeChooseAction}
      />
    </div>
  );
}

export default ZipManager;
