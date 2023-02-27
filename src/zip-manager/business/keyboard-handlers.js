function getKeyUpHandler({
  highlightedEntry,
  selectedFolder,
  disabledCut,
  disabledCopy,
  disabledRename,
  disabledPaste,
  disabledDelete,
  disabledBack,
  disabledForward,
  disabledExportZip,
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
  createFolder,
  exportZipFile,
  navigateBack,
  navigateForward,
  goIntoFolder,
  addFilesButton,
  importZipButton,
  util,
  constants
}) {
  const {
    ACTION_KEY,
    CUT_KEY,
    COPY_KEY,
    RENAME_KEY,
    PASTE_KEY,
    CREATE_FOLDER_KEY,
    ADD_FILES_KEY,
    IMPORT_ZIP_KEY,
    EXPORT_ZIP_KEY,
    DELETE_KEYS,
    DOWN_KEY,
    UP_KEY,
    LEFT_KEY,
    RIGHT_KEY,
    PAGE_UP_KEY,
    PAGE_DOWN_KEY,
    HOME_KEY,
    END_KEY,
    BACK_KEY,
    FORWARD_KEY
  } = constants;

  function handleKeyUp(event) {
    entriesNavigationHandler(event, {
      highlightNext,
      highlightPrevious,
      highlightPreviousPage,
      highlightNextPage,
      highlightFirst,
      highlightLast
    });
    folderNavigationHandler(event, {
      navigateBack,
      navigateForward,
      goIntoFolder,
      disabledBack,
      disabledForward
    });
    highlightedEntryHandler(event, {
      cut,
      copy,
      rename,
      paste,
      remove,
      enter,
      disabledCut,
      disabledCopy,
      disabledRename,
      disabledPaste,
      disabledDelete
    });
    selectedFolderHandler(event, {
      event,
      createFolder,
      exportZipFile,
      addFilesButton,
      importZipButton,
      disabledExportZip,
      util
    });
  }

  function entriesNavigationHandler(
    event,
    {
      highlightPrevious,
      highlightNext,
      highlightPreviousPage,
      highlightNextPage,
      highlightFirst,
      highlightLast
    }
  ) {
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
    if (event.key === HOME_KEY) {
      highlightFirst();
    }
    if (event.key === END_KEY) {
      highlightLast();
    }
  }

  function folderNavigationHandler(
    event,
    {
      navigateBack,
      navigateForward,
      goIntoFolder,
      disabledBack,
      disabledForward
    }
  ) {
    if (event.altKey) {
      if (event.key === BACK_KEY && !disabledBack) {
        navigateBack();
      }
      if (event.key === FORWARD_KEY && !disabledForward) {
        navigateForward();
      }
    }
    if (event.key === LEFT_KEY && selectedFolder.parent) {
      goIntoFolder(selectedFolder.parent, selectedFolder);
    }
    if (
      event.key === RIGHT_KEY &&
      highlightedEntry &&
      highlightedEntry.directory &&
      highlightedEntry !== selectedFolder.parent
    ) {
      goIntoFolder(highlightedEntry, selectedFolder);
    }
  }

  function highlightedEntryHandler(
    event,
    {
      disabledCut,
      disabledCopy,
      disabledRename,
      disabledPaste,
      disabledDelete,
      cut,
      copy,
      rename,
      paste,
      remove,
      enter
    }
  ) {
    if (event.ctrlKey) {
      if (event.key === CUT_KEY && !disabledCut) {
        cut();
      }
      if (event.key === COPY_KEY && !disabledCopy) {
        copy();
      }
      if (event.key === RENAME_KEY && !disabledRename) {
        rename();
      }
      if (event.key === PASTE_KEY && !disabledPaste) {
        paste();
      }
    }
    if (DELETE_KEYS.includes(event.key) && !disabledDelete) {
      remove();
    }
    if (event.key === ACTION_KEY) {
      enter(highlightedEntry, selectedFolder);
      event.preventDefault();
    }
  }

  function selectedFolderHandler(
    event,
    {
      createFolder,
      exportZipFile,
      addFilesButton,
      importZipButton,
      disabledExportZip,
      util
    }
  ) {
    if (event.ctrlKey) {
      if (event.key === CREATE_FOLDER_KEY) {
        createFolder();
      }
      if (event.key === ADD_FILES_KEY) {
        util.dispatchClick(addFilesButton);
      }
      if (event.key === IMPORT_ZIP_KEY) {
        util.dispatchClick(importZipButton);
      }
      if (event.key === EXPORT_ZIP_KEY && !disabledExportZip) {
        exportZipFile();
      }
    }
  }

  return {
    handleKeyUp
  };
}

export { getKeyUpHandler };
