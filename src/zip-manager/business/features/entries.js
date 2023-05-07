function getEntriesFeatures({
  entries,
  selectedFolderEntries,
  previousHighlight,
  highlightedIds,
  toggleNavigationDirection,
  dialogDisplayed,
  entriesElementHeight,
  entriesDeltaHeight,
  entriesElement,
  getHighlightedEntryElement,
  entriesHeight,
  setHighlightedIds,
  setPreviousHighlight,
  setToggleNavigationDirection,
  setOptions,
  setEntriesHeight,
  setEntriesElementHeight,
  setEntriesDeltaHeight,
  getOptions,
  util
}) {
  function getEntriesElementHeight() {
    return util.getHeight(entriesElement);
  }

  function getHightlightedEntryHeight() {
    if (getHighlightedEntryElement()) {
      return (
        util.getHeight(getHighlightedEntryElement()) +
        util.getRowGap(entriesElement.firstElementChild)
      );
    }
  }

  function highlightPrevious() {
    const indexEntry = getHighlightedEntryIndex();
    const previousEntry =
      entries[(indexEntry - 1 + entries.length) % entries.length];
    highlightEntry(previousEntry);
  }

  function highlightNext() {
    const indexEntry = getHighlightedEntryIndex();
    const nextEntry = entries[(indexEntry + 1) % entries.length];
    highlightEntry(nextEntry);
  }

  function highlightPreviousPage() {
    const indexEntry = getHighlightedEntryIndex();
    const previousEntry = getPreviousPageEntry(indexEntry);
    highlightEntry(previousEntry);
  }

  function highlightNextPage() {
    const indexEntry = getHighlightedEntryIndex();
    const nextEntry = getNextPageEntry(indexEntry);
    highlightEntry(nextEntry);
  }

  function highlightFirst() {
    highlightEntry(entries[0]);
  }

  function highlightLast() {
    highlightEntry(entries[entries.length - 1]);
  }

  function highlightFirstLetter(letter) {
    const filteredEntries = entries.filter(
      (entry) =>
        entry.name &&
        entry.name.toLocaleLowerCase().startsWith(letter.toLocaleLowerCase())
    );
    if (filteredEntries.length) {
      const firstEntry = filteredEntries[0];
      if (filteredEntries.length === 1) {
        highlightEntry(firstEntry);
      } else {
        setPreviousHighlight(firstEntry);
        setToggleNavigationDirection(0);
        setHighlightedIds(filteredEntries.reverse().map((entry) => entry.id));
      }
    }
  }

  function highlight(entry) {
    highlightEntry(entry);
  }

  function highlightEntries(entries) {
    setPreviousHighlight(entries[entries.length - 1]);
    setToggleNavigationDirection(0);
    setHighlightedIds(entries.map((entry) => entry.id));
  }

  function highlightAll() {
    const selectedFolderHighlightedIds = highlightedIds.filter((id) =>
      selectedFolderEntries.find((entry) => entry.id === id)
    );
    setHighlightedIds(
      entries
        .filter((entry) => !selectedFolderHighlightedIds.includes(entry.id))
        .filter((entry) => selectedFolderEntries.includes(entry))
        .map((entry) => entry.id)
        .concat(...selectedFolderHighlightedIds)
    );
  }

  function toggle(entry) {
    let newIds = getToggledHighlightedIds(highlightedIds, entry);
    setPreviousHighlight(entry);
    setToggleNavigationDirection(0);
    setHighlightedIds(newIds);
  }

  function highlightEntry(entry) {
    setPreviousHighlight(entry);
    setToggleNavigationDirection(0);
    setHighlightedIds([entry.id]);
  }

  function toggleRange(
    targetEntry,
    previousHighlightedEntryIndex = getPreviousHighlightedEntryIndex()
  ) {
    const highlightedEntryIndex = entries.findIndex(
      (entry) => entry.id === targetEntry.id
    );
    let newIds = [...highlightedIds];
    if (previousHighlightedEntryIndex < highlightedEntryIndex) {
      for (
        let indexEntry = previousHighlightedEntryIndex + 1;
        indexEntry <= highlightedEntryIndex;
        indexEntry++
      ) {
        newIds = getToggledHighlightedIds(newIds, entries[indexEntry]);
      }
    } else if (previousHighlightedEntryIndex > highlightedEntryIndex) {
      for (
        let indexEntry = previousHighlightedEntryIndex - 1;
        indexEntry >= highlightedEntryIndex;
        indexEntry--
      ) {
        newIds = getToggledHighlightedIds(newIds, entries[indexEntry]);
      }
    }
    setPreviousHighlight(targetEntry);
    setToggleNavigationDirection(0);
    setHighlightedIds(newIds);
  }

  function getToggledHighlightedIds(highlightedIds, entry) {
    if (highlightedIds.includes(entry.id)) {
      if (highlightedIds.length > 1) {
        return highlightedIds.filter((id) => id !== entry.id);
      }
    } else {
      return [...highlightedIds, entry.id];
    }
    return highlightedIds;
  }

  function togglePrevious() {
    if (previousHighlight) {
      const indexEntry = getPreviousHighlightedEntryIndex();
      if (toggleNavigationDirection === 1) {
        toggle(previousHighlight);
      } else if (indexEntry > 0) {
        const previousEntry = entries[indexEntry - 1];
        if (
          highlightedIds.length === 1 &&
          highlightedIds.includes(previousEntry.id)
        ) {
          if (indexEntry > 1) {
            toggle(entries[indexEntry - 2]);
          }
        } else {
          toggle(previousEntry);
        }
      }
      setToggleNavigationDirection(-1);
    }
  }

  function toggleNext() {
    if (previousHighlight) {
      const indexEntry = getPreviousHighlightedEntryIndex();
      if (toggleNavigationDirection === -1) {
        toggle(previousHighlight);
      } else if (indexEntry < entries.length - 1) {
        const nextEntry = entries[indexEntry + 1];
        if (
          highlightedIds.length === 1 &&
          highlightedIds.includes(nextEntry.id)
        ) {
          if (indexEntry < entries.length - 2) {
            toggle(entries[indexEntry + 2]);
          }
        } else {
          toggle(nextEntry);
        }
      }
      setToggleNavigationDirection(1);
    }
  }

  function togglePreviousPage() {
    if (previousHighlight) {
      const indexEntry = getPreviousHighlightedEntryIndex();
      const previousPageEntry = getPreviousPageEntry(indexEntry);
      if (toggleNavigationDirection !== 1) {
        toggleRange(previousPageEntry);
      } else {
        toggleRange(previousPageEntry, indexEntry + 1);
      }
      setToggleNavigationDirection(-1);
    }
  }

  function toggleNextPage() {
    if (previousHighlight) {
      const indexEntry = getPreviousHighlightedEntryIndex();
      const nextPageEntry = getNextPageEntry(indexEntry);
      if (toggleNavigationDirection !== -1) {
        toggleRange(nextPageEntry);
      } else {
        toggleRange(nextPageEntry, indexEntry - 1);
      }
      setToggleNavigationDirection(1);
    }
  }

  function toggleFirst() {
    if (previousHighlight) {
      const indexEntry = getPreviousHighlightedEntryIndex();
      const firstEntry = entries[0];
      if (toggleNavigationDirection !== 1) {
        toggleRange(firstEntry);
      } else {
        toggleRange(firstEntry, indexEntry + 1);
      }
      setToggleNavigationDirection(-1);
    }
  }

  function toggleLast() {
    if (previousHighlight) {
      const indexEntry = getPreviousHighlightedEntryIndex();
      const lastEntry = entries[entries.length - 1];
      if (toggleNavigationDirection !== -1) {
        toggleRange(lastEntry);
      } else {
        toggleRange(lastEntry, indexEntry - 1);
      }
      setToggleNavigationDirection(1);
    }
  }

  function getPreviousPageEntry(indexEntry) {
    return entries[Math.max(indexEntry - entriesHeight, 0)];
  }

  function getNextPageEntry(indexEntry) {
    return entries[Math.min(indexEntry + entriesHeight, entries.length - 1)];
  }

  function getPreviousHighlightedEntryIndex() {
    return entries.findIndex(
      (highlightedEntry) => highlightedEntry === previousHighlight
    );
  }

  function getHighlightedEntryIndex() {
    const entryId = highlightedIds[highlightedIds.length - 1];
    return entries.findIndex((entry) => entry.id === entryId);
  }

  function moveBottomBar(deltaY) {
    setEntriesDeltaHeight(deltaY);
  }

  function updateEntriesHeight() {
    if (entriesElement && getHighlightedEntryElement()) {
      setEntriesHeight(
        Math.max(
          Math.ceil(getEntriesElementHeight() / getHightlightedEntryHeight()),
          1
        )
      );
    }
  }

  function updateEntriesElementHeight() {
    if (!dialogDisplayed) {
      let height = entriesElementHeight;
      const options = getOptions();
      if (!height && options.entriesHeight) {
        height = options.entriesHeight;
      }
      setEntriesElementHeight(height);
    }
  }

  function updateEntriesElementHeightEnd() {
    const entriesElementHeight = getEntriesElementHeight();
    setEntriesElementHeight(
      Math.max(
        Math.min(
          entriesElementHeight + entriesDeltaHeight,
          entriesElementHeight
        ),
        entriesElementHeight
      )
    );
    setEntriesDeltaHeight(0);
  }

  function registerResizeEntriesHandler() {
    if (entriesElement) {
      const observer = util.addResizeObserver(entriesElement, () => {
        let height = getEntriesElementHeight();
        const options = getOptions();
        if (height || !options.entriesHeight) {
          options.entriesHeight = height;
          setOptions(options);
        }
      });
      util.addResizeListener(updateEntriesElementHeight);
      return () => {
        observer.disconnect();
        util.removeResizeListener(updateEntriesElementHeight);
      };
    }
  }

  function updateHighlightedEntries() {
    if (getHighlightedEntryElement()) {
      util.scrollIntoView(getHighlightedEntryElement());
    }
  }

  return {
    highlightPrevious,
    highlightNext,
    highlightPreviousPage,
    highlightNextPage,
    highlightFirst,
    highlightLast,
    highlightFirstLetter,
    highlight,
    highlightEntries,
    highlightAll,
    toggle,
    toggleRange,
    togglePrevious,
    toggleNext,
    togglePreviousPage,
    toggleNextPage,
    toggleFirst,
    toggleLast,
    moveBottomBar,
    updateEntriesHeight,
    updateEntriesElementHeight,
    updateEntriesElementHeightEnd,
    updateHighlightedEntries,
    registerResizeEntriesHandler
  };
}

export default getEntriesFeatures;
