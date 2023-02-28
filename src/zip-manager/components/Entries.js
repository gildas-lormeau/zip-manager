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

function Entry({ entry, selectedFolder, onHighlight, onEnter, messages }) {
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
        selectedFolder={selectedFolder}
        onEnter={onEnter}
        messages={messages}
      />
    </>
  );
}

function EntryName({ entry, selectedFolder, onHighlight, onEnter, messages }) {
  const entryIsParentFolder = entry === selectedFolder.parent;

  function handleClick() {
    onHighlight(entry);
  }

  function handleDoubleClick() {
    onEnter(entry);
  }

  return (
    <span
      className="list-item-name entry-name"
      title={entryIsParentFolder ? messages.PARENT_FOLDER_TOOLTIP : entry.name}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      {entryIsParentFolder ? messages.PARENT_FOLDER_LABEL : entry.name}
    </span>
  );
}

function EntryButton({ entry, selectedFolder, onEnter, messages }) {
  function getEntryButtonTitle() {
    const keys = [messages.SPACE_KEY_LABEL];
    if (entry === selectedFolder.parent) {
      keys.push(messages.ARROW_LEFT_KEY_LABEL);
    } else if (entry.directory) {
      keys.push(messages.ARROW_RIGHT_KEY_LABEL);
    }
    return messages.SHORTCUT_LABEL + keys.join(messages.KEYS_SEPARATOR_LABEL);
  }

  function handleClick() {
    onEnter(entry);
  }

  return (
    <span
      className="list-item-button"
      onClick={handleClick}
      title={getEntryButtonTitle()}
    >
      {entry.directory
        ? messages.DOWNLOAD_BUTTON_LABEL
        : messages.ENTER_FOLDER_BUTTON_LABEL}
    </span>
  );
}

export default Entries;
