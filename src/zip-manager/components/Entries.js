import "./styles/Entries.css";

import { useEffect, useRef, useState } from "react";

function Entries({
  entries,
  selectedFolder,
  highlightedIds,
  onHighlight,
  onToggle,
  onToggleRange,
  onEnter,
  entriesHeightRef,
  highlightedEntryRef,
  util,
  constants,
  messages
}) {
  const entriesRef = useRef(null);
  const [selectModeEnabled, setSelectModeEnabled] = useState(false);
  const touchEndTimeout = useRef(null);

  function getEntryClassName(entry) {
    const classes = [];
    if (entry.directory) {
      classes.push("directory");
    }
    if (highlightedIds.includes(entry.id)) {
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
        Math.ceil(
          util.getHeight(entriesRef.current) /
            util.getHeight(highlightedEntryRef.current)
        ),
        1
      );
    }
  }

  function handleTouchStart() {
    if (touchEndTimeout.current) {
      util.clearTimeout(touchEndTimeout.current);
    }
    touchEndTimeout.current = util.setTimeout(() => {
      touchEndTimeout.current = null;
      setSelectModeEnabled(!selectModeEnabled);
    }, constants.LONG_TOUCH_DELAY);
  }

  function handleTouchEnd() {
    if (touchEndTimeout.current) {
      util.clearTimeout(touchEndTimeout.current);
      touchEndTimeout.current = null;
    }
  }

  function handleContextMenu(event) {
    event.preventDefault();
  }

  useEffect(computeEntriesHeight);

  return (
    <div className="entries" aria-label="Folder entries" ref={entriesRef}>
      <ol
        onKeyDown={handleKeyDown}
        onMouseDown={handleTouchStart}
        onMouseUp={handleTouchEnd}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onContextMenu={handleContextMenu}
      >
        {entries.map((entry) => {
          if (highlightedIds.includes(entry.id)) {
            return (
              <li
                key={entry.id}
                ref={
                  highlightedIds[highlightedIds.length - 1] === entry.id
                    ? highlightedEntryRef
                    : null
                }
                className={getEntryClassName(entry)}
                tabIndex={0}
              >
                <Entry
                  entry={entry}
                  selectedFolder={selectedFolder}
                  highlighted={true}
                  selectModeEnabled={selectModeEnabled}
                  onHighlight={onHighlight}
                  onToggle={onToggle}
                  onToggleRange={onToggleRange}
                  onEnter={onEnter}
                  util={util}
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
                  highlighted={false}
                  selectModeEnabled={selectModeEnabled}
                  onHighlight={onHighlight}
                  onToggle={onToggle}
                  onToggleRange={onToggleRange}
                  onEnter={onEnter}
                  util={util}
                  messages={messages}
                />
              </li>
            );
          }
        })}
      </ol>
    </div>
  );
}

function Entry({
  entry,
  selectedFolder,
  highlighted,
  selectModeEnabled,
  onHighlight,
  onToggle,
  onToggleRange,
  onEnter,
  util,
  messages
}) {
  return (
    <>
      {selectModeEnabled && (
        <input
          className="entry-select"
          type="checkbox"
          checked={highlighted}
          onChange={() => onToggle(entry)}
        ></input>
      )}
      <EntryName
        entry={entry}
        selectedFolder={selectedFolder}
        onHighlight={() =>
          selectModeEnabled ? onToggle(entry) : onHighlight(entry)
        }
        onToggle={onToggle}
        onToggleRange={onToggleRange}
        onEnter={onEnter}
        util={util}
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

function EntryName({
  entry,
  selectedFolder,
  onHighlight,
  onToggle,
  onToggleRange,
  onEnter,
  util,
  messages
}) {
  const {
    PARENT_FOLDER_TOOLTIP,
    LAST_MOD_DATE_LABEL,
    SIZE_LABEL,
    COMPRESSED_SIZE_LABEL,
    UNCOMPRESSED_SIZE_LABEL
  } = messages;
  const entryIsParentFolder = entry === selectedFolder.parent;

  function getEntryNameTitle() {
    const tooltip = [entryIsParentFolder ? PARENT_FOLDER_TOOLTIP : entry.name];
    if (entry.data) {
      const { compressedSize, lastModified, lastModDate, size } = entry.data;
      const uncompressedSize = size || entry.data.uncompressedSize;
      tooltip.push(
        LAST_MOD_DATE_LABEL +
          util.formatDate(
            lastModified === undefined ? lastModDate : new Date(lastModified)
          )
      );
      if (uncompressedSize && compressedSize) {
        tooltip.push(COMPRESSED_SIZE_LABEL + util.formatSize(compressedSize));
      }
      if (uncompressedSize) {
        tooltip.push(
          (compressedSize ? UNCOMPRESSED_SIZE_LABEL : SIZE_LABEL) +
            util.formatSize(uncompressedSize)
        );
      }
    }
    return tooltip.join("\n");
  }

  function handleClick(event) {
    if (event.metaKey) {
      onToggle(entry);
    } else if (event.shiftKey) {
      onToggleRange(entry);
    } else {
      onHighlight(entry);
    }
  }

  function handleDoubleClick(event) {
    if (!event.metaKey) {
      onEnter(entry);
    }
  }

  return (
    <span
      className="list-item-name entry-name"
      title={getEntryNameTitle()}
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
