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
    SET_ZIP_PASSWORD_KEY,
    SELECT_ALL_KEY,
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
    entriesHandler(event, {
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
      toggleLast
    });
    foldersHandler(event, {
      navigateBack,
      navigateForward,
      goIntoFolder,
      disabledBack,
      disabledForward
    });
    highlightedEntriesHandler(event, {
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
      disabledDelete,
      disabledEnter
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

  function entriesHandler(
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
      toggleNextPage
    }
  ) {
    if (event.ctrlKey) {
      if (event.key === SELECT_ALL_KEY) {
        highlightAll();
      }
    }
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
    if (!event.altKey && !event.ctrlKey && !event.shiftKey) {
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
      if (event.key.length === 1 && event.key !== ACTION_KEY) {
        highlightFirstLetter(event.key);
      }
    }
  }

  function foldersHandler(
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
    if (!event.altKey && !event.ctrlKey && !event.shiftKey) {
      if (event.key === LEFT_KEY && selectedFolder.parent) {
        goIntoFolder(selectedFolder.parent);
      }
      if (event.key === RIGHT_KEY && highlightedIds.length === 1) {
        const highlightedEntry = getHighlightedEntry();
        if (highlightedEntry && highlightedEntry.directory) {
          goIntoFolder(highlightedEntry);
        }
      }
    }
  }

  function highlightedEntriesHandler(
    event,
    {
      disabledCut,
      disabledCopy,
      disabledRename,
      disabledPaste,
      disabledDelete,
      disabledEnter,
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
    if (!event.altKey && !event.ctrlKey && !event.shiftKey) {
      if (DELETE_KEYS.includes(event.key) && !disabledDelete) {
        remove();
      }
      if (event.key === ACTION_KEY && !disabledEnter) {
        enter(getHighlightedEntry() || selectedFolder.parent);
        event.preventDefault();
      }
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
      if (event.key === SET_ZIP_PASSWORD_KEY && !disabledSetZipPassword) {
        setZipPassword();
      }
    }
  }

  function getHighlightedEntry() {
    return selectedFolder.children.find(
      (entry) => entry.id === highlightedIds[highlightedIds.length - 1]
    );
  }

  function handlePageUnload(event) {
    if (zipFilesystem.children.length || downloads.length) {
      event.preventDefault();
      event.returnValue = "";
    }
  }

  return {
    handlePageUnload,
    handleKeyUp
  };
}

export default getEventHandlers;
