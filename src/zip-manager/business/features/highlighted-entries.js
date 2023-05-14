function getHighlightedEntriesFeatures({
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
  setClipboardData,
  setHighlightedIds,
  setPreviousHighlight,
  setExtractDialog,
  setRenameDialog,
  setDeleteEntryDialog,
  setClickedButtonName,
  refreshSelectedFolder,
  updateHistoryData,
  saveEntries,
  getOptions,
  openDisplayError,
  filesystemService,
  modifierKeyPressed,
  constants
}) {
  const {
    CUT_KEY,
    COPY_KEY,
    EXTRACT_KEY,
    RENAME_KEY,
    CUT_BUTTON_NAME,
    COPY_BUTTON_NAME,
    EXTRACT_BUTTON_NAME,
    RENAME_BUTTON_NAME,
    DELETE_KEYS,
    DELETE_BUTTON_NAME
  } = constants;

  function copy() {
    setClipboardData({
      entries: highlightedEntries.map((entry) => entry.clone(true))
    });
  }

  function cut() {
    setClipboardData({
      entries: highlightedEntries,
      cut: true
    });
  }

  function openPromptRename() {
    setRenameDialog({
      filename: highlightedEntry.name
    });
  }

  function rename({ filename }) {
    try {
      if (filename !== highlightedEntry.name) {
        highlightedEntry.rename(filename);
        refreshSelectedFolder();
      }
    } catch (error) {
      openDisplayError(error.message);
    }
  }
  function closePromptRename() {
    setRenameDialog(null);
  }

  function openConfirmDeleteEntries() {
    setDeleteEntryDialog({});
  }

  function deleteEntries() {
    highlightedEntries.forEach((entry) => zipFilesystem.remove(entry));
    if (entries.length) {
      const indexEntry = Math.max(
        ...entries
          .map((entry, index) => ({ entry, index }))
          .filter(({ entry }) => highlightedIds.includes(entry.id))
          .map(({ index }) => index)
      );
      let indexNextEntry = indexEntry;
      while (
        indexNextEntry < entries.length &&
        highlightedIds.includes(entries[indexNextEntry].id)
      ) {
        indexNextEntry++;
      }
      if (indexNextEntry === entries.length) {
        indexNextEntry = indexEntry;
        while (
          indexNextEntry >= 0 &&
          highlightedIds.includes(entries[indexNextEntry].id)
        ) {
          indexNextEntry--;
        }
      }
      if (entries[indexNextEntry]) {
        setPreviousHighlight(entries[indexNextEntry]);
        setHighlightedIds([entries[indexNextEntry].id]);
      } else {
        setPreviousHighlight(null);
        setHighlightedIds([]);
      }
    }
    updateHistoryData();
    refreshSelectedFolder();
  }

  function closeConfirmDeleteEntries() {
    setDeleteEntryDialog(null);
  }

  function openPromptExtract(entry = highlightedEntry) {
    const options = {
      filename: entry.name
    };
    if (filesystemService.savePickersSupported()) {
      extract(options);
    } else {
      setExtractDialog(options);
    }
  }

  function extract({ filename } = {}) {
    async function download() {
      try {
        const options = getOptions();
        filename = highlightedEntries.length === 1 ? filename : null;
        await saveEntries(highlightedEntries, filename, options);
      } catch (error) {
        openDisplayError(error.message);
      }
    }

    download();
  }

  function closePromptExtract() {
    setExtractDialog(null);
  }

  function onHighlightedEntriesKeyUp(event) {
    if (!event.altKey && !modifierKeyPressed(event) && !event.shiftKey) {
      if (DELETE_KEYS.includes(event.key) && !disabledDelete) {
        setClickedButtonName(DELETE_BUTTON_NAME);
      }
    }
  }

  function onHighlightedEntriesKeyDown(event) {
    if (modifierKeyPressed(event)) {
      if (event.key === COPY_KEY && !disabledCopy) {
        setClickedButtonName(COPY_BUTTON_NAME);
        event.preventDefault();
      }
      if (event.key === CUT_KEY && !disabledCut) {
        setClickedButtonName(CUT_BUTTON_NAME);
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

  return {
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
  };
}

export default getHighlightedEntriesFeatures;
