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
  disabledCutEntryButton,
  disabledCopyEntryButton,
  disabledRenameEntryButton,
  disabledPasteEntryButton,
  disabledDeleteEntryButton,
  disabledHistoryBackButton,
  disabledHistoryForwardButton,
  disabledExportZipButton,
  addFilesButtonRef,
  importZipButtonRef
}) {
  onHighlightedEntryKeyUp({
    event,
    onCutEntry,
    onCopyEntry,
    onRenameEntry,
    onPasteEntry,
    onDeleteEntry,
    onActionEntry,
    onHighlightNextEntry,
    onHighlightPreviousEntry,
    onHighlightFirstEntry,
    onHighlightPreviousPageEntry,
    onHighlightNextPageEntry,
    onHighlightLastEntry,
    disabledCutEntryButton,
    disabledCopyEntryButton,
    disabledRenameEntryButton,
    disabledPasteEntryButton,
    disabledDeleteEntryButton
  });
  onSelectedFolderKeyUp({
    event,
    onCreateFolder,
    onExportZipFile,
    addFilesButtonRef,
    importZipButtonRef,
    disabledExportZipButton
  });
  onFolderNavigationKeyUp({
    event,
    onNavigateHistoryBack,
    onNavigateHistoryForward,
    disabledHistoryBackButton,
    disabledHistoryForwardButton
  });
  onEntryNavigationKeyUp({
    event,
    onHighlightNextEntry,
    onHighlightPreviousEntry,
    onHighlightFirstEntry,
    onHighlightLastEntry
  });
}

function onHighlightedEntryKeyUp({
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
  disabledCutEntryButton,
  disabledCopyEntryButton,
  disabledRenameEntryButton,
  disabledPasteEntryButton,
  disabledDeleteEntryButton
}) {
  if (event.ctrlKey) {
    if (event.key === CUT_KEY && !disabledCutEntryButton) {
      onCutEntry();
    }
    if (event.key === COPY_KEY && !disabledCopyEntryButton) {
      onCopyEntry();
    }
    if (event.key === RENAME_KEY && !disabledRenameEntryButton) {
      onRenameEntry();
    }
    if (event.key === PASTE_KEY && !disabledPasteEntryButton) {
      onPasteEntry();
    }
  }
  if (DELETE_KEYS.includes(event.key) && !disabledDeleteEntryButton) {
    onDeleteEntry();
  }
  if (event.key === ACTION_KEY) {
    onActionEntry();
  }
  if (event.key === DOWN_KEY) {
    onHighlightNextEntry();
  }
  if (event.key === PAGE_UP_KEY) {
    onHighlightPreviousPageEntry();
  }
  if (event.key === PAGE_DOWN_KEY) {
    onHighlightNextPageEntry();
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
}

function onSelectedFolderKeyUp({
  event,
  onCreateFolder,
  onExportZipFile,
  addFilesButtonRef,
  importZipButtonRef,
  disabledExportZipButton
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
    if (event.key === EXPORT_ZIP_KEY && !disabledExportZipButton) {
      onExportZipFile();
    }
  }
}

function onFolderNavigationKeyUp({
  event,
  onNavigateHistoryBack,
  onNavigateHistoryForward,
  disabledHistoryBackButton,
  disabledHistoryForwardButton
}) {
  if (event.altKey) {
    if (event.key === NAVIGATION_BACK_KEY && !disabledHistoryBackButton) {
      onNavigateHistoryBack();
    }
    if (event.key === NAVIGATION_FORWARD_KEY && !disabledHistoryForwardButton) {
      onNavigateHistoryForward();
    }
  }
}

function onEntryNavigationKeyUp({
  event,
  onHighlightNextEntry,
  onHighlightPreviousEntry,
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
}

export { onKeyUp };
