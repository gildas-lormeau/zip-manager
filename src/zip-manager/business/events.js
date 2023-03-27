function getEventHandlers({
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
  setFlashingButton,
  util,
  constants
}) {
  function handleKeyUp(event) {
    if (!event.target.closest("dialog")) {
      onEntriesKeyUp(event, {
        highlightPrevious,
        highlightNext,
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
        util,
        constants
      });
      onFoldersKeyUp(event, {
        disabledBack,
        disabledForward,
        selectedFolder,
        highlightedIds,
        setFlashingButton,
        navigateBack,
        navigateForward,
        goIntoFolder,
        util,
        constants
      });
      onHighlightedEntriesKeyUp(event, {
        disabledDelete,
        disabledEnter,
        selectedFolder,
        highlightedIds,
        setFlashingButton,
        openConfirmDeleteEntry,
        enter,
        util,
        constants
      });
    }
  }

  function handleKeyDown(event) {
    if (!event.target.closest("dialog")) {
      onEntriesKeyDown(event, { highlightAll, util, constants });
      onHighlightedEntriesKeyDown(event, {
        disabledCut,
        disabledCopy,
        disabledRename,
        disabledPaste,
        setFlashingButton,
        cut,
        copy,
        openPromptRename,
        paste,
        util,
        constants
      });
      onSelectedFolderKeyDown(event, {
        disabledExportZip,
        openPromptCreateFolder,
        openPromptExportZip,
        addFilesButton,
        importZipButton,
        setFlashingButton,
        util,
        constants
      });
    }
  }

  function handlePageUnload(event) {
    if (zipFilesystem.children.length || downloads.length) {
      event.preventDefault();
      event.returnValue = "";
    }
  }

  return {
    handlePageUnload,
    handleKeyUp,
    handleKeyDown
  };
}

function onEntriesKeyUp(
  event,
  {
    highlightPrevious,
    highlightNext,
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
    util,
    constants
  }
) {
  const {
    ACTION_KEY,
    DOWN_KEY,
    UP_KEY,
    PAGE_UP_KEY,
    PAGE_DOWN_KEY,
    HOME_KEY,
    END_KEY
  } = constants;
  if (event.shiftKey) {
    if (event.key === DOWN_KEY) {
      toggleNext();
    }
    if (event.key === UP_KEY) {
      togglePrevious();
    }
    if (event.key === PAGE_UP_KEY) {
      togglePreviousPage();
    }
    if (event.key === PAGE_DOWN_KEY) {
      toggleNextPage();
    }
    if (event.key === HOME_KEY) {
      toggleFirst();
    }
    if (event.key === END_KEY) {
      toggleLast();
    }
  }
  if (!event.altKey && !modifierKeyPressed(event, util) && !event.shiftKey) {
    if (event.key === DOWN_KEY) {
      highlightNext();
    }
    if (event.key === UP_KEY) {
      highlightPrevious();
    }
    if (event.key === HOME_KEY) {
      highlightFirst();
    }
    if (event.key === END_KEY) {
      highlightLast();
    }
    if (event.key === PAGE_UP_KEY) {
      highlightPreviousPage();
    }
    if (event.key === PAGE_DOWN_KEY) {
      highlightNextPage();
    }
  }
  if (!event.altKey && !modifierKeyPressed(event, util)) {
    if (event.key.length === 1 && event.key !== ACTION_KEY) {
      highlightFirstLetter(event.key);
    }
  }
}

function onFoldersKeyUp(
  event,
  {
    disabledBack,
    disabledForward,
    selectedFolder,
    highlightedIds,
    setFlashingButton,
    navigateBack,
    navigateForward,
    goIntoFolder,
    util,
    constants
  }
) {
  const {
    LEFT_KEY,
    RIGHT_KEY,
    BACK_KEY,
    FORWARD_KEY,
    BACK_BUTTON_NAME,
    FORWARD_BUTTON_NAME
  } = constants;
  if (event.altKey) {
    if (event.key === BACK_KEY && !disabledBack) {
      setFlashingButton({
        name: BACK_BUTTON_NAME,
        callback: navigateBack
      });
    }
    if (event.key === FORWARD_KEY && !disabledForward) {
      setFlashingButton({
        name: FORWARD_BUTTON_NAME,
        callback: navigateForward
      });
    }
  }
  if (!event.altKey && !modifierKeyPressed(event, util) && !event.shiftKey) {
    if (event.key === LEFT_KEY && selectedFolder.parent) {
      goIntoFolder(selectedFolder.parent);
    }
    if (event.key === RIGHT_KEY && highlightedIds.length === 1) {
      const highlightedEntry = getHighlightedEntry({
        selectedFolder,
        highlightedIds
      });
      if (highlightedEntry && highlightedEntry.directory) {
        goIntoFolder(highlightedEntry);
      }
    }
  }
}

function onHighlightedEntriesKeyUp(
  event,
  {
    disabledDelete,
    disabledEnter,
    selectedFolder,
    highlightedIds,
    setFlashingButton,
    openConfirmDeleteEntry,
    enter,
    util,
    constants
  }
) {
  const { ACTION_KEY, DELETE_KEYS, DELETE_ENTRY_BUTTON_NAME } = constants;
  if (!event.altKey && !modifierKeyPressed(event, util) && !event.shiftKey) {
    if (DELETE_KEYS.includes(event.key) && !disabledDelete) {
      setFlashingButton({
        name: DELETE_ENTRY_BUTTON_NAME,
        callback: openConfirmDeleteEntry
      });
    }
    if (event.key === ACTION_KEY && !disabledEnter) {
      enter(
        getHighlightedEntry({ selectedFolder, highlightedIds }) ||
          selectedFolder.parent
      );
      event.preventDefault();
    }
  }
}

function onEntriesKeyDown(event, { highlightAll, util, constants }) {
  const {
    SELECT_ALL_KEY,
    DOWN_KEY,
    UP_KEY,
    PAGE_DOWN_KEY,
    PAGE_UP_KEY,
    HOME_KEY,
    END_KEY
  } = constants;
  if (modifierKeyPressed(event, util)) {
    if (event.key === SELECT_ALL_KEY) {
      event.preventDefault();
      highlightAll();
    }
  }
  if (!event.altKey && !modifierKeyPressed(event, util)) {
    if (
      event.key === DOWN_KEY ||
      event.key === UP_KEY ||
      event.key === PAGE_DOWN_KEY ||
      event.key === PAGE_UP_KEY ||
      event.key === HOME_KEY ||
      event.key === END_KEY
    ) {
      event.preventDefault();
    }
  }
}

function onHighlightedEntriesKeyDown(
  event,
  {
    disabledCut,
    disabledCopy,
    disabledRename,
    disabledPaste,
    setFlashingButton,
    cut,
    copy,
    openPromptRename,
    paste,
    util,
    constants
  }
) {
  const {
    CUT_KEY,
    COPY_KEY,
    RENAME_KEY,
    PASTE_KEY,
    CUT_BUTTON_NAME,
    COPY_BUTTON_NAME,
    PASTE_BUTTON_NAME,
    RENAME_BUTTON_NAME
  } = constants;
  if (modifierKeyPressed(event, util)) {
    if (event.key === COPY_KEY && !disabledCopy) {
      setFlashingButton({
        name: COPY_BUTTON_NAME,
        callback: copy
      });
      event.preventDefault();
    }
    if (event.key === CUT_KEY && !disabledCut) {
      setFlashingButton({
        name: CUT_BUTTON_NAME,
        callback: cut
      });
      event.preventDefault();
    }
    if (event.key === PASTE_KEY && !disabledPaste) {
      setFlashingButton({
        name: PASTE_BUTTON_NAME,
        callback: paste
      });
      event.preventDefault();
    }
    if (event.key === RENAME_KEY && !disabledRename) {
      setFlashingButton({
        name: RENAME_BUTTON_NAME,
        callback: openPromptRename
      });
      event.preventDefault();
    }
  }
}

function onSelectedFolderKeyDown(
  event,
  {
    openPromptCreateFolder,
    openPromptExportZip,
    addFilesButton,
    importZipButton,
    disabledExportZip,
    setFlashingButton,
    util,
    constants
  }
) {
  const {
    CREATE_FOLDER_KEY,
    ADD_FILES_KEY,
    IMPORT_ZIP_KEY,
    EXPORT_ZIP_KEY,
    CREATE_FOLDER_BUTTON_NAME,
    ADD_FILES_BUTTON_NAME,
    IMPORT_ZIP_BUTTON_NAME,
    EXPORT_ZIP_BUTTON_NAME
  } = constants;
  const openPromptAddFiles = () => util.dispatchClick(addFilesButton);
  const openPromptImportZip = () => util.dispatchClick(importZipButton);
  if (modifierKeyPressed(event, util)) {
    if (event.key === CREATE_FOLDER_KEY) {
      setFlashingButton({
        name: CREATE_FOLDER_BUTTON_NAME,
        callback: openPromptCreateFolder
      });
      event.preventDefault();
    }
    if (event.key === ADD_FILES_KEY) {
      setFlashingButton({
        name: ADD_FILES_BUTTON_NAME,
        callback: openPromptAddFiles
      });
      event.preventDefault();
    }
    if (event.key === IMPORT_ZIP_KEY) {
      setFlashingButton({
        name: IMPORT_ZIP_BUTTON_NAME,
        callback: openPromptImportZip
      });
      event.preventDefault();
    }
    if (event.key === EXPORT_ZIP_KEY && !disabledExportZip) {
      setFlashingButton({
        name: EXPORT_ZIP_BUTTON_NAME,
        callback: openPromptExportZip
      });
      event.preventDefault();
    }
  }
}

function getHighlightedEntry({ selectedFolder, highlightedIds }) {
  return selectedFolder.children.find(
    (entry) => entry.id === highlightedIds[highlightedIds.length - 1]
  );
}

function modifierKeyPressed(event, { isMacOSPlatform }) {
  return isMacOSPlatform() ? event.metaKey : event.ctrlKey;
}

export default getEventHandlers;
