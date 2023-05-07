function getHighlightedEntriesFeatures({
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
  refreshSelectedFolder,
  updateHistoryData,
  saveEntries,
  getOptions,
  openDisplayError,
  filesystemService
}) {
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

  function openConfirmDeleteEntry() {
    setDeleteEntryDialog({});
  }

  function deleteEntry() {
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

  function closeConfirmDeleteEntry() {
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

  return {
    copy,
    cut,
    openPromptRename,
    rename,
    closePromptRename,
    openConfirmDeleteEntry,
    deleteEntry,
    closeConfirmDeleteEntry,
    openPromptExtract,
    extract,
    closePromptExtract
  };
}

export default getHighlightedEntriesFeatures;
