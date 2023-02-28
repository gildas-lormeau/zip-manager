import "./styles/Entries.css";

import { useEffect, useRef } from "react";

function Entries({
  entries,
  selectedFolder,
  highlightedEntry,
  onHighlight,
  onEnter,
  entriesHeightRef,
  highlightedEntryRef,
  util,
  constants,
  messages
}) {
  const entriesRef = useRef(null);

  function getEntryClassName(entry) {
    const classes = [];
    if (entry.directory) {
      classes.push("directory");
    }
    if (entry === highlightedEntry) {
      classes.push("entry-highlighted");
    }
    return classes.join(" ");
  }

  function handleKeyDown(event) {
    if (event.key !== constants.TAB_KEY) {
      event.preventDefault();
    }
  }

  function computeEntriesHeight() {
    if (highlightedEntryRef && highlightedEntryRef.current) {
      entriesHeightRef.current = Math.max(
        Math.floor(
          util.getHeight(entriesRef.current) /
            util.getHeight(highlightedEntryRef.current)
        ),
        1
      );
    }
  }

  useEffect(computeEntriesHeight);

  return (
    <ol className="entries" onKeyDown={handleKeyDown} ref={entriesRef}>
      {entries.map((entry) => {
        if (entry === highlightedEntry) {
          return (
            <li
              key={entry.id}
              ref={highlightedEntryRef}
              className={getEntryClassName(entry)}
              tabIndex={0}
            >
              <Entry
                entry={entry}
                selectedFolder={selectedFolder}
                onHighlight={onHighlight}
                onEnter={onEnter}
                messages={messages}
              />
            </li>
          );
        } else {
          return (
            <li key={entry.id} className={getEntryClassName(entry)}>
              <Entry
                entry={entry}
                selectedFolder={selectedFolder}
                onHighlight={onHighlight}
                onEnter={onEnter}
                messages={messages}
              />
            </li>
          );
        }
      })}
    </ol>
  );
}

function Entry({
  entry,
  selectedFolder,
  onHighlight,
  onEnter,
  messages
}) {
  return (
    <>
      <EntryName
        entry={entry}
        selectedFolder={selectedFolder}
        onHighlight={onHighlight}
        onEnter={onEnter}
        messages={messages}
      />
      <EntryButton
        entry={entry}
        onEnter={onEnter}
        messages={messages}
      />
    </>
  );
}

function EntryName({
  entry,
  selectedFolder,
  onHighlight,
  onEnter,
  messages
}) {
  const entryLabel =
    entry === selectedFolder.parent ? messages.PARENT_FOLDER_LABEL : entry.name;

  function handleClick() {
    onHighlight(entry);
  }

  function handleDoubleClick() {
    onEnter(entry);
  }

  return (
    <span
      className="list-item-name entry-name"
      title={entryLabel}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      {entryLabel}
    </span>
  );
}

function EntryButton({ entry, onEnter, messages }) {
  function handleClick() {
    onEnter(entry);
  }

  return (
    <span
      className="list-item-button"
      onClick={handleClick}
      title={messages.SHORTCUT_LABEL + messages.SPACE_KEY_LABEL}
    >
      {entry.directory
        ? messages.DOWNLOAD_BUTTON_LABEL
        : messages.ENTER_FOLDER_BUTTON_LABEL}
    </span>
  );
}

export default Entries;
