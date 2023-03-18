function getHighlightedEntriesFeatures({
  zipFilesystem,
  entries,
  history,
  historyIndex,
  highlightedIds,
  selectedFolder,
  clipboardData,
  getImportPassword,
  setHistory,
  setHistoryIndex,
  setClipboardData,
  setHighlightedIds,
  setPreviousHighlightedEntry,
  setImportPassword,
  removeDownload,
  updateSelectedFolder,
  downloadFile,
  util,
  constants,
  messages
}) {
  const { DEFAULT_MIME_TYPE } = constants;
  const { RENAME_MESSAGE, DELETE_MESSAGE } = messages;

  function copy() {
    setClipboardData({
      entries: highlightedIds.map((entryId) =>
        zipFilesystem.getById(entryId).clone(true)
      )
    });
  }

  function cut() {
    setClipboardData({
      entries: highlightedIds.map((entryId) => zipFilesystem.getById(entryId)),
      cut: true
    });
  }

  function paste() {
    try {
      const { entries, cut } = clipboardData;
      if (cut) {
        entries.forEach((entry) => {
          zipFilesystem.move(entry, selectedFolder);
        });
      } else {
        const clones = entries.map((entry) => {
          let clone = entry.clone(true);
          zipFilesystem.move(entry, selectedFolder);
          return clone;
        });
        setClipboardData({ entries: clones });
      }
      setHighlightedIds(entries.map((entry) => entry.id));
      updateSelectedFolder();
    } catch (error) {
      util.alert(error.message);
    }
  }

  function rename() {
    try {
      const highlightedEntry = zipFilesystem.getById(highlightedIds[0]);
      const entryName = util.prompt(RENAME_MESSAGE, highlightedEntry.name);
      if (entryName && entryName !== highlightedEntry.name) {
        highlightedEntry.rename(entryName);
        updateSelectedFolder();
      }
    } catch (error) {
      util.alert(error.message);
    }
  }

  function remove() {
    if (util.confirm(DELETE_MESSAGE)) {
      highlightedIds.forEach((id) =>
        zipFilesystem.remove(zipFilesystem.getById(id))
      );
      if (selectedFolder.children.length) {
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
        setPreviousHighlightedEntry(entries[indexNextEntry]);
        setHighlightedIds([entries[indexNextEntry].id]);
      } else {
        setPreviousHighlightedEntry(null);
        setHighlightedIds([]);
      }
      updateHistoryData();
      updateSelectedFolder();
    }
  }

  function download(entry) {
    async function download() {
      try {
        await downloadFile(
          entry.name,
          {},
          getImportPassword(),
          setImportPassword,
          async (download, options) => {
            try {
              return await entry.getBlob(DEFAULT_MIME_TYPE, options);
            } finally {
              removeDownload(download);
            }
          }
        );
      } catch (error) {
        util.alert(error.message);
      }
    }

    download();
  }

  function updateHistoryData() {
    let offsetIndex = 0;
    let previousEntry;
    const highlightedEntry = entries.find(
      (entry) => entry.id === highlightedIds[0]
    );
    const newHistory = history.filter((entry, indexEntry) => {
      const entryRemoved =
        previousEntry === entry ||
        entry === highlightedEntry ||
        entry.isDescendantOf(highlightedEntry);
      if (entryRemoved) {
        if (indexEntry <= historyIndex) {
          offsetIndex++;
        }
      } else {
        previousEntry = entry;
      }
      return !entryRemoved;
    });
    const newHistoryIndex = historyIndex - offsetIndex;
    setHistory(newHistory);
    setHistoryIndex(newHistoryIndex);
  }

  return {
    copy,
    cut,
    paste,
    rename,
    remove,
    download
  };
}

export default getHighlightedEntriesFeatures;
