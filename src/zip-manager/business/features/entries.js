function getEntriesFeatures({
  disabledNavigation,
  disabledHighlightAll,
  entries,
  selectedFolderEntries,
  highlightedIds,
  navigation,
  dialogDisplayed,
  entriesElementHeight,
  entriesDeltaHeight,
  entriesElement,
  setHighlightedIds,
  resetHighlightedEntryElement,
  setNavigation,
  setOptions,
  setEntriesHeight,
  setEntriesElementHeight,
  setEntriesDeltaHeight,
  setClickedButtonName,
  getEntriesHeight,
  getHighlightedEntryElement,
  getOptions,
  modifierKeyPressed,
  documentService,
  windowService,
  constants
}) {
  const {
    ACTION_KEY,
    DOWN_KEY,
    UP_KEY,
    PAGE_UP_KEY,
    PAGE_DOWN_KEY,
    HOME_KEY,
    END_KEY,
    HIGHLIGHT_ALL_KEY,
    HIGHLIGHT_ALL_BUTTON_NAME
  } = constants;

  function getEntriesElementHeight() {
    return documentService.getHeight(entriesElement);
  }

  function getHightlightedEntryHeight() {
    const highlightedEntryElement = getHighlightedEntryElement();
    if (highlightedEntryElement) {
      return documentService.getRowHeight(highlightedEntryElement);
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
        setNavigation(() => ({
          previousHighlight: firstEntry,
          direction: 0
        }));
        setHighlightedIds(filteredEntries.reverse().map((entry) => entry.id));
      }
    }
  }

  function highlight(entry) {
    highlightEntry(entry);
  }

  function highlightEntries(entries) {
    setNavigation(() => ({
      previousHighlight: entries[entries.length - 1],
      direction: 0
    }));
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
    setNavigation(() => ({
      previousHighlight: entry,
      direction: 0
    }));
    if (newIds.length < highlightedIds.length) {
      resetHighlightedEntryElement();
    }
    resetHighlightedEntryElement();
    setHighlightedIds(newIds);
  }

  function highlightEntry(entry) {
    setNavigation(() => ({
      previousHighlight: entry,
      direction: 0
    }));
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
    setNavigation(() => ({
      previousHighlight: targetEntry,
      direction: 0
    }));
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
    if (navigation.previousHighlight) {
      const indexEntry = getPreviousHighlightedEntryIndex();
      if (navigation.direction === 1) {
        toggle(navigation.previousHighlight);
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
      setNavigation((navigation) => ({
        ...navigation,
        direction: -1
      }));
    }
  }

  function toggleNext() {
    if (navigation.previousHighlight) {
      const indexEntry = getPreviousHighlightedEntryIndex();
      if (navigation.direction === -1) {
        toggle(navigation.previousHighlight);
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
      setNavigation((navigation) => ({
        ...navigation,
        direction: 1
      }));
    }
  }

  function togglePreviousPage() {
    if (navigation.previousHighlight) {
      const indexEntry = getPreviousHighlightedEntryIndex();
      const previousPageEntry = getPreviousPageEntry(indexEntry);
      if (navigation.direction !== 1) {
        toggleRange(previousPageEntry);
      } else {
        toggleRange(previousPageEntry, indexEntry + 1);
      }
      setNavigation((navigation) => ({
        ...navigation,
        direction: -1
      }));
    }
  }

  function toggleNextPage() {
    if (navigation.previousHighlight) {
      const indexEntry = getPreviousHighlightedEntryIndex();
      const nextPageEntry = getNextPageEntry(indexEntry);
      if (navigation.direction !== -1) {
        toggleRange(nextPageEntry);
      } else {
        toggleRange(nextPageEntry, indexEntry - 1);
      }
      setNavigation((navigation) => ({
        ...navigation,
        direction: 1
      }));
    }
  }

  function toggleFirst() {
    if (navigation.previousHighlight) {
      const indexEntry = getPreviousHighlightedEntryIndex();
      const firstEntry = entries[0];
      if (navigation.direction !== 1) {
        toggleRange(firstEntry);
      } else {
        toggleRange(firstEntry, indexEntry + 1);
      }
      setNavigation((navigation) => ({
        ...navigation,
        direction: -1
      }));
    }
  }

  function toggleLast() {
    if (navigation.previousHighlight) {
      const indexEntry = getPreviousHighlightedEntryIndex();
      const lastEntry = entries[entries.length - 1];
      if (navigation.direction !== -1) {
        toggleRange(lastEntry);
      } else {
        toggleRange(lastEntry, indexEntry - 1);
      }
      setNavigation((navigation) => ({
        ...navigation,
        direction: 1
      }));
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
      (highlightedEntry) => highlightedEntry === navigation.previousHighlight
    );
  }

  function getHighlightedEntryIndex() {
    const entryId = highlightedIds[highlightedIds.length - 1];
    return entries.findIndex((entry) => entry.id === entryId);
  }

  function resizeEntries(deltaY) {
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
      if (height) {
        setEntriesElementHeight(height);
      }
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
      const observer = documentService.addResizeObserver(entriesElement, () => {
        const height = getEntriesElementHeight();
        const options = getOptions();
        if (height !== options.entriesHeight) {
          options.entriesHeight = height;
          setOptions(options);
          updateEntriesHeight();
        }
      });
      windowService.addResizeListener(updateEntriesElementHeight);
      return () => {
        observer.disconnect();
        windowService.removeResizeListener(updateEntriesElementHeight);
      };
    }
  }

  function updateHighlightedEntries() {
    if (getHighlightedEntryElement()) {
      documentService.scrollIntoView(getHighlightedEntryElement());
    }
  }

  function onEntriesKeyUp(event) {
    if (!disabledNavigation) {
      if (!event.altKey && !modifierKeyPressed(event)) {
        if (event.key.length === 1 && event.key !== ACTION_KEY) {
          highlightFirstLetter(event.key);
        }
      }
    }
  }

  function onEntriesKeyDown(event) {
    if (modifierKeyPressed(event)) {
      if (event.key === HIGHLIGHT_ALL_KEY) {
        event.preventDefault();
        if (!disabledHighlightAll) {
          setClickedButtonName(HIGHLIGHT_ALL_BUTTON_NAME);
        }
      }
    }
    if (!disabledNavigation) {
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
        event.preventDefault();
      }
      if (!event.altKey && !modifierKeyPressed(event) && !event.shiftKey) {
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
        event.preventDefault();
      }
    }
  }

  return {
    highlight,
    highlightEntries,
    highlightAll,
    toggle,
    toggleRange,
    resizeEntries,
    updateEntriesHeight,
    updateEntriesElementHeight,
    updateEntriesElementHeightEnd,
    updateHighlightedEntries,
    registerResizeEntriesHandler,
    onEntriesKeyUp,
    onEntriesKeyDown
  };
}

export default getEntriesFeatures;
