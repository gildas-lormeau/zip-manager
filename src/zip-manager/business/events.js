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
  disabledSetZipPassword,
  disabledEnter,
  cut,
  copy,
  rename,
  paste,
  remove,
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
  createFolder,
  exportZipFile,
  setZipPassword,
  navigateBack,
  navigateForward,
  goIntoFolder,
  addFilesButton,
  importZipButton,
  util,
  constants
}) {
  function handleKeyUp(event) {
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
      remove,
      enter,
      util,
      constants
    });
  }

  function handleKeyDown(event) {
    onEntriesKeyDown(event, { highlightAll, util, constants });
    onHighlightedEntriesKeyDown(event, {
      disabledCut,
      disabledCopy,
      disabledRename,
      disabledPaste,
      cut,
      copy,
      rename,
      paste,
      util,
      constants
    });
    onSelectedFolderKeyDown(event, {
      disabledExportZip,
      disabledSetZipPassword,
      createFolder,
      exportZipFile,
      setZipPassword,
      addFilesButton,
      importZipButton,
      util,
      constants
    });
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
    navigateBack,
    navigateForward,
    goIntoFolder,
    util,
    constants
  }
) {
  const { LEFT_KEY, RIGHT_KEY, BACK_KEY, FORWARD_KEY } = constants;
  if (event.altKey) {
    if (event.key === BACK_KEY && !disabledBack) {
      navigateBack();
    }
    if (event.key === FORWARD_KEY && !disabledForward) {
      navigateForward();
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
    remove,
    enter,
    util,
    constants
  }
) {
  const { ACTION_KEY, DELETE_KEYS } = constants;
  if (!event.altKey && !modifierKeyPressed(event, util) && !event.shiftKey) {
    if (DELETE_KEYS.includes(event.key) && !disabledDelete) {
      remove();
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
  if (!event.altKey && !modifierKeyPressed(event, util) && !event.shiftKey) {
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
    cut,
    copy,
    rename,
    paste,
    util,
    constants
  }
) {
  const { CUT_KEY, COPY_KEY, RENAME_KEY, PASTE_KEY } = constants;
  if (modifierKeyPressed(event, util)) {
    if (event.key === CUT_KEY && !disabledCut) {
      event.preventDefault();
      cut();
    }
    if (event.key === COPY_KEY && !disabledCopy) {
      event.preventDefault();
      copy();
    }
    if (event.key === RENAME_KEY && !disabledRename) {
      event.preventDefault();
      rename();
    }
    if (event.key === PASTE_KEY && !disabledPaste) {
      event.preventDefault();
      paste();
    }
  }
}

function onSelectedFolderKeyDown(
  event,
  {
    createFolder,
    exportZipFile,
    setZipPassword,
    addFilesButton,
    importZipButton,
    disabledExportZip,
    disabledSetZipPassword,
    util,
    constants
  }
) {
  const {
    CREATE_FOLDER_KEY,
    ADD_FILES_KEY,
    IMPORT_ZIP_KEY,
    EXPORT_ZIP_KEY,
    SET_ZIP_PASSWORD_KEY
  } = constants;
  if (modifierKeyPressed(event, util)) {
    if (event.key === CREATE_FOLDER_KEY) {
      event.preventDefault();
      createFolder();
    }
    if (event.key === ADD_FILES_KEY) {
      event.preventDefault();
      util.dispatchClick(addFilesButton);
    }
    if (event.key === IMPORT_ZIP_KEY) {
      event.preventDefault();
      util.dispatchClick(importZipButton);
    }
    if (event.key === EXPORT_ZIP_KEY && !disabledExportZip) {
      event.preventDefault();
      exportZipFile();
    }
    if (event.key === SET_ZIP_PASSWORD_KEY && !disabledSetZipPassword) {
      event.preventDefault();
      setZipPassword();
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
