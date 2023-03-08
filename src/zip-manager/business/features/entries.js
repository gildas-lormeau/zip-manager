function getEntriesHandlers({
  entries,
  previousHighlightedEntry,
  highlightedIds,
  toggleNavigationDirection,
  getEntriesHeight,
  setHighlightedIds,
  setPreviousHighlightedEntry,
  setToggleNavigationDirection
}) {
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

  function highlight(entry) {
    highlightEntry(entry);
  }

  function highlightEntries(entries) {
    setPreviousHighlightedEntry(entries[entries.length - 1]);
    setToggleNavigationDirection(0);
    setHighlightedIds(entries.map((entry) => entry.id));
  }

  function highlightAll() {
    setPreviousHighlightedEntry(entries[0]);
    setToggleNavigationDirection(0);
    setHighlightedIds(entries.map((entry) => entry.id));
  }

  function toggle(entry) {
    let newIds = getToggledHighlightedIds(highlightedIds, entry);
    setPreviousHighlightedEntry(entry);
    setToggleNavigationDirection(0);
    setHighlightedIds(newIds);
  }

  function highlightEntry(entry) {
    setPreviousHighlightedEntry(entry);
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
    setPreviousHighlightedEntry(targetEntry);
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
    if (previousHighlightedEntry) {
      const indexEntry = getPreviousHighlightedEntryIndex();
      if (indexEntry > 0) {
        const previousEntry = entries[indexEntry - 1];
        toggle(
          toggleNavigationDirection !== 1
            ? previousEntry
            : previousHighlightedEntry
        );
        setToggleNavigationDirection(-1);
      }
    }
  }

  function toggleNext() {
    if (previousHighlightedEntry) {
      const indexEntry = getPreviousHighlightedEntryIndex();
      if (indexEntry < entries.length - 1) {
        const nextEntry = entries[indexEntry + 1];
        toggle(
          toggleNavigationDirection !== -1
            ? nextEntry
            : previousHighlightedEntry
        );
        setToggleNavigationDirection(1);
      }
    }
  }

  function togglePreviousPage() {
    if (previousHighlightedEntry) {
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
    if (previousHighlightedEntry) {
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
    if (previousHighlightedEntry) {
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
    if (previousHighlightedEntry) {
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
    return entries[Math.max(indexEntry - getEntriesHeight(), 0)];
  }

  function getNextPageEntry(indexEntry) {
    return entries[
      Math.min(indexEntry + getEntriesHeight(), entries.length - 1)
    ];
  }

  function getPreviousHighlightedEntryIndex() {
    return entries.findIndex(
      (highlightedEntry) => highlightedEntry === previousHighlightedEntry
    );
  }

  function getHighlightedEntryIndex() {
    const entryId = highlightedIds[highlightedIds.length - 1];
    return entries.findIndex((entry) => entry.id === entryId);
  }

  return {
    highlightPrevious,
    highlightNext,
    highlightPreviousPage,
    highlightNextPage,
    highlightFirst,
    highlightLast,
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
    toggleLast
  };
}

export default getEntriesHandlers;
