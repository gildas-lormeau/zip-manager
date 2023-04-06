function getEventHandlers({
  zipFilesystem,
  downloads,
  highlightedIds,
  selectedFolder,
  disabledCut,
  disabledCopy,
  disabledHighlightAll,
  disabledExtract,
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
}) {
  function handleKeyUp(event) {
    if (!dialogDisplayed) {
      onEntriesKeyUp(event, {
        disabledNavigation,
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
        setClickedButtonName,
        goIntoFolder,
        util,
        constants
      });
      onHighlightedEntriesKeyUp(event, {
        disabledDelete,
        disabledEnter,
        selectedFolder,
        highlightedIds,
        setClickedButtonName,
        enter,
        util,
        constants
      });
    }
  }

  function handleKeyDown(event) {
    if (!dialogDisplayed) {
      onEntriesKeyDown(event, {
        disabledHighlightAll,
        setClickedButtonName,
        util,
        constants
      });
      onHighlightedEntriesKeyDown(event, {
        disabledCut,
        disabledCopy,
        disabledExtract,
        disabledRename,
        disabledPaste,
        setClickedButtonName,
        util,
        constants
      });
      onSelectedFolderKeyDown(event, {
        disabledExportZip,
        setClickedButtonName,
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
    disabledNavigation,
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
  if (!disabledNavigation) {
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
}

function onFoldersKeyUp(
  event,
  {
    disabledBack,
    disabledForward,
    selectedFolder,
    highlightedIds,
    setClickedButtonName,
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
      setClickedButtonName(BACK_BUTTON_NAME);
    }
    if (event.key === FORWARD_KEY && !disabledForward) {
      setClickedButtonName(FORWARD_BUTTON_NAME);
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
    setClickedButtonName,
    enter,
    util,
    constants
  }
) {
  const { ACTION_KEY, DELETE_KEYS, DELETE_BUTTON_NAME } = constants;
  if (!event.altKey && !modifierKeyPressed(event, util) && !event.shiftKey) {
    if (DELETE_KEYS.includes(event.key) && !disabledDelete) {
      setClickedButtonName(DELETE_BUTTON_NAME);
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

function onEntriesKeyDown(
  event,
  { disabledHighlightAll, setClickedButtonName, util, constants }
) {
  const {
    HIGHLIGHT_ALL_KEY,
    DOWN_KEY,
    UP_KEY,
    PAGE_DOWN_KEY,
    PAGE_UP_KEY,
    HOME_KEY,
    END_KEY,
    HIGHLIGHT_ALL_BUTTON_NAME
  } = constants;
  if (modifierKeyPressed(event, util)) {
    if (event.key === HIGHLIGHT_ALL_KEY) {
      event.preventDefault();
      if (!disabledHighlightAll) {
        setClickedButtonName(HIGHLIGHT_ALL_BUTTON_NAME);
      }
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
    disabledExtract,
    disabledRename,
    disabledPaste,
    setClickedButtonName,
    util,
    constants
  }
) {
  const {
    CUT_KEY,
    COPY_KEY,
    EXTRACT_KEY,
    RENAME_KEY,
    PASTE_KEY,
    CUT_BUTTON_NAME,
    COPY_BUTTON_NAME,
    PASTE_BUTTON_NAME,
    EXTRACT_BUTTON_NAME,
    RENAME_BUTTON_NAME
  } = constants;
  if (modifierKeyPressed(event, util)) {
    if (event.key === COPY_KEY && !disabledCopy) {
      setClickedButtonName(COPY_BUTTON_NAME);
      event.preventDefault();
    }
    if (event.key === CUT_KEY && !disabledCut) {
      setClickedButtonName(CUT_BUTTON_NAME);
      event.preventDefault();
    }
    if (event.key === PASTE_KEY && !disabledPaste) {
      setClickedButtonName(PASTE_BUTTON_NAME);
      event.preventDefault();
    }
    if (event.key === EXTRACT_KEY && !disabledExtract) {
      setClickedButtonName(EXTRACT_BUTTON_NAME);
      event.preventDefault();
    }
    if (event.key === RENAME_KEY && !disabledRename) {
      setClickedButtonName(RENAME_BUTTON_NAME);
      event.preventDefault();
    }
  }
}

function onSelectedFolderKeyDown(
  event,
  { disabledExportZip, setClickedButtonName, util, constants }
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
  if (modifierKeyPressed(event, util)) {
    if (event.key === CREATE_FOLDER_KEY) {
      setClickedButtonName(CREATE_FOLDER_BUTTON_NAME);
      event.preventDefault();
    }
    if (event.key === ADD_FILES_KEY) {
      setClickedButtonName(ADD_FILES_BUTTON_NAME);
      event.preventDefault();
    }
    if (event.key === IMPORT_ZIP_KEY) {
      setClickedButtonName(IMPORT_ZIP_BUTTON_NAME);
      event.preventDefault();
    }
    if (event.key === EXPORT_ZIP_KEY && !disabledExportZip) {
      setClickedButtonName(EXPORT_ZIP_BUTTON_NAME);
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
