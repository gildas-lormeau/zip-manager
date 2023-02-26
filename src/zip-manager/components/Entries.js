import "./styles/Entries.css";

import { useEffect, useRef } from "react";

function Entries({
  entries,
  selectedFolder,
  highlightedEntry,
  entriesHeight,
  highlightedEntryRef,
  onHighlightEntry,
  onEnterEntry,
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
      entriesHeight.current = Math.max(
        Math.floor(
          entriesRef.current.offsetHeight /
            highlightedEntryRef.current.offsetHeight
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
                onSelectEntry={onHighlightEntry}
                onEnterEntry={onEnterEntry}
                constants={constants}
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
                onSelectEntry={onHighlightEntry}
                onEnterEntry={onEnterEntry}
                constants={constants}
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
  onSelectEntry,
  onEnterEntry,
  constants,
  messages
}) {
  return (
    <>
      <EntryName
        entry={entry}
        selectedFolder={selectedFolder}
        onSelectEntry={onSelectEntry}
        onEnterEntry={onEnterEntry}
        messages={messages}
      />
      <EntryButton
        entry={entry}
        selectedFolder={selectedFolder}
        onEnterEntry={onEnterEntry}
        messages={messages}
      />
    </>
  );
}

function EntryName({
  entry,
  selectedFolder,
  onSelectEntry,
  onEnterEntry,
  messages
}) {
  const entryLabel =
    entry === selectedFolder.parent
      ? messages.PARENT_FOLDER_LABEL
      : entry.name;

  function handleClick() {
    onSelectEntry(entry);
  }

  function handleDoubleClick() {
    onEnterEntry(entry, selectedFolder);
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

function EntryButton({ entry, selectedFolder, onEnterEntry, messages }) {
  function handleClick() {
    onEnterEntry(entry, selectedFolder);
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
