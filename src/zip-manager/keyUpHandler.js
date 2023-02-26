import {
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
  PAGE_UP_KEY,
  PAGE_DOWN_KEY,
  HOME_KEY,
  END_KEY,
  NAVIGATION_BACK_KEY,
  NAVIGATION_FORWARD_KEY
} from "./constants.js";

function onKeyUp({
  event,
  onCutEntry,
  onCopyEntry,
  onRenameEntry,
  onPasteEntry,
  onDeleteEntry,
  onActionEntry,
  onHighlightNextEntry,
  onHighlightPreviousEntry,
  onHighlightPreviousPageEntry,
  onHighlightNextPageEntry,
  onHighlightFirstEntry,
  onHighlightLastEntry,
  onCreateFolder,
  onExportZipFile,
  onNavigateHistoryBack,
  onNavigateHistoryForward,
  disabledCutEntry,
  disabledCopyEntry,
  disabledRenameEntry,
  disabledPasteEntry,
  disabledDeleteEntry,
  disabledHistoryBack,
  disabledHistoryForward,
  disabledExportZip,
  addFilesButtonRef,
  importZipButtonRef
}) {
  onEntriesNavigationKeyUp({
    event,
    onHighlightNextEntry,
    onHighlightPreviousEntry,
    onHighlightPreviousPageEntry,
    onHighlightNextPageEntry,
    onHighlightFirstEntry,
    onHighlightLastEntry
  });
  onFolderNavigationKeyUp({
    event,
    onNavigateHistoryBack,
    onNavigateHistoryForward,
    disabledHistoryBack,
    disabledHistoryForward
  });
  onHighlightedEntryKeyUp({
    event,
    onCutEntry,
    onCopyEntry,
    onRenameEntry,
    onPasteEntry,
    onDeleteEntry,
    onActionEntry,
    disabledCutEntry,
    disabledCopyEntry,
    disabledRenameEntry,
    disabledPasteEntry,
    disabledDeleteEntry
  });
  onSelectedFolderKeyUp({
    event,
    onCreateFolder,
    onExportZipFile,
    addFilesButtonRef,
    importZipButtonRef,
    disabledExportZip
  });
}

function onEntriesNavigationKeyUp({
  event,
  onHighlightPreviousEntry,
  onHighlightNextEntry,
  onHighlightPreviousPageEntry,
  onHighlightNextPageEntry,
  onHighlightFirstEntry,
  onHighlightLastEntry
}) {
  if (event.key === DOWN_KEY) {
    onHighlightNextEntry();
  }
  if (event.key === UP_KEY) {
    onHighlightPreviousEntry();
  }
  if (event.key === HOME_KEY) {
    onHighlightFirstEntry();
  }
  if (event.key === END_KEY) {
    onHighlightLastEntry();
  }
  if (event.key === PAGE_UP_KEY) {
    onHighlightPreviousPageEntry();
  }
  if (event.key === PAGE_DOWN_KEY) {
    onHighlightNextPageEntry();
  }
  if (event.key === HOME_KEY) {
    onHighlightFirstEntry();
  }
  if (event.key === END_KEY) {
    onHighlightLastEntry();
  }
}

function onFolderNavigationKeyUp({
  event,
  onNavigateHistoryBack,
  onNavigateHistoryForward,
  disabledHistoryBack,
  disabledHistoryForward
}) {
  if (event.altKey) {
    if (event.key === NAVIGATION_BACK_KEY && !disabledHistoryBack) {
      onNavigateHistoryBack();
    }
    if (event.key === NAVIGATION_FORWARD_KEY && !disabledHistoryForward) {
      onNavigateHistoryForward();
    }
  }
}

function onHighlightedEntryKeyUp({
  event,
  onCutEntry,
  onCopyEntry,
  onRenameEntry,
  onPasteEntry,
  onDeleteEntry,
  onActionEntry,
  disabledCutEntry,
  disabledCopyEntry,
  disabledRenameEntry,
  disabledPasteEntry,
  disabledDeleteEntry
}) {
  if (event.ctrlKey) {
    if (event.key === CUT_KEY && !disabledCutEntry) {
      onCutEntry();
    }
    if (event.key === COPY_KEY && !disabledCopyEntry) {
      onCopyEntry();
    }
    if (event.key === RENAME_KEY && !disabledRenameEntry) {
      onRenameEntry();
    }
    if (event.key === PASTE_KEY && !disabledPasteEntry) {
      onPasteEntry();
    }
  }
  if (DELETE_KEYS.includes(event.key) && !disabledDeleteEntry) {
    onDeleteEntry();
  }
  if (event.key === ACTION_KEY) {
    onActionEntry();
  }
}

function onSelectedFolderKeyUp({
  event,
  onCreateFolder,
  onExportZipFile,
  addFilesButtonRef,
  importZipButtonRef,
  disabledExportZip
}) {
  if (event.ctrlKey) {
    if (event.key === CREATE_FOLDER_KEY) {
      onCreateFolder();
    }
    if (event.key === ADD_FILES_KEY) {
      addFilesButtonRef.current.click();
    }
    if (event.key === IMPORT_ZIP_KEY) {
      importZipButtonRef.current.click();
    }
    if (event.key === EXPORT_ZIP_KEY && !disabledExportZip) {
      onExportZipFile();
    }
  }
}

export { onKeyUp };
