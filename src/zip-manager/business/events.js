function getEventHandlers({
  entries,
  downloads,
  dialogDisplayed,
  onEntriesKeyUp,
  onFoldersKeyUp,
  onHighlightedEntriesKeyUp,
  onAppKeyUp,
  onEntriesKeyDown,
  onHighlightedEntriesKeyDown,
  onSelectedFolderKeyDown
}) {
  function handleKeyUp(event) {
    if (!dialogDisplayed) {
      onEntriesKeyUp(event);
      onFoldersKeyUp(event);
      onHighlightedEntriesKeyUp(event);
      onAppKeyUp(event);
    }
  }

  function handleKeyDown(event) {
    if (!dialogDisplayed) {
      onEntriesKeyDown(event);
      onHighlightedEntriesKeyDown(event);
      onSelectedFolderKeyDown(event);
    }
  }

  function handlePageUnload(event) {
    if (entries.length || downloads.length) {
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

export default getEventHandlers;
