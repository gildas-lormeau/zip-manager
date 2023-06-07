/* global setTimeout, clearTimeout */

import "./styles/Entries.css";

import { useEffect, useRef, useState } from "react";

function Entries({
  entries,
  selectedFolder,
  highlightedIds,
  deltaEntriesHeight,
  entriesElementHeight,
  hiddenDownloadManager,
  onDropFiles,
  onHighlight,
  onToggle,
  onToggleRange,
  onEnter,
  onUpdateEntriesHeight,
  onUpdateEntriesElementHeight,
  onRegisterResizeEntriesHandler,
  entriesElementRef,
  highlightedEntryElementRef,
  i18n,
  constants,
  messages
}) {
  const [selectModeEnabled, setSelectModeEnabled] = useState(false);
  const [draggingItems, setDraggingItems] = useState(false);
  const touchEndTimeout = useRef(null);
  const previousTouchClientX = useRef(0);
  const previousTouchClientY = useRef(0);

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

  function getEntriesStyle() {
    if (!hiddenDownloadManager && entriesElementHeight) {
      return { height: entriesElementHeight + deltaEntriesHeight + "px" };
    }
  }

  function setTouchEndEventTimeout() {
    clearTouchEndEventTimeout();
    touchEndTimeout.current = setTimeout(() => {
      touchEndTimeout.current = null;
      setSelectModeEnabled(!selectModeEnabled);
    }, constants.LONG_TOUCH_DELAY);
  }

  function clearTouchEndEventTimeout() {
    if (touchEndTimeout.current) {
      clearTimeout(touchEndTimeout.current);
      touchEndTimeout.current = null;
    }
  }

  function handleTouchMove(event) {
    const { clientX, clientY } = event.changedTouches[0];
    if (previousTouchClientY.current && previousTouchClientX.current) {
      const deltaY = Math.abs(clientY - previousTouchClientY.current);
      const deltaX = Math.abs(clientX - previousTouchClientX.current);
      if (deltaX > 1 && deltaY > 1) {
        clearTouchEndEventTimeout();
      }
    } else {
      previousTouchClientX.current = clientX;
      previousTouchClientY.current = clientY;
    }
  }

  function handleTouchEnd() {
    previousTouchClientX.current = 0;
    previousTouchClientY.current = 0;
    clearTouchEndEventTimeout();
  }

  function handleContextMenu(event) {
    event.preventDefault();
  }

  function handleDragOver(event) {
    event.preventDefault();
    setDraggingItems(draggingItems);
    if (event.dataTransfer.items) {
      setDraggingItems(true);
    }
  }

  function handleDragLeave(event) {
    event.preventDefault();
    setDraggingItems(false);
  }

  async function handleDrop(event) {
    if (event.dataTransfer.items) {
      event.preventDefault();
      setDraggingItems(false);
      onDropFiles(event.dataTransfer.items);
    }
  }

  function onEntryClick({ event, entry }) {
    if (event.metaKey) {
      onToggle(entry);
    } else if (event.shiftKey) {
      onToggleRange(entry);
    } else if (selectModeEnabled) {
      onToggle(entry);
    } else {
      onHighlight(entry);
    }
  }

  function getEntriesClassName() {
    const classes = ["entries", "scrollable"];
    if (draggingItems) {
      classes.push("dragging-items");
    }
    return classes.join(" ");
  }

  useEffect(onUpdateEntriesHeight);
  useEffect(onRegisterResizeEntriesHandler);
  useEffect(onUpdateEntriesElementHeight, []);

  return (
    <div
      className={getEntriesClassName()}
      aria-label={messages.ENTRIES_LABEL}
      role="navigation"
      ref={entriesElementRef}
      style={getEntriesStyle()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <ol
        onKeyDown={handleKeyDown}
        onTouchStart={setTouchEndEventTimeout}
        onTouchMove={handleTouchMove}
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
                    ? highlightedEntryElementRef
                    : null
                }
                className={getEntryClassName(entry)}
                tabIndex={0}
                onClick={(event) => onEntryClick({ event, entry })}
              >
                <Entry
                  entry={entry}
                  selectedFolder={selectedFolder}
                  highlighted={true}
                  selectModeEnabled={selectModeEnabled}
                  onToggle={onToggle}
                  onEnter={onEnter}
                  i18n={i18n}
                  messages={messages}
                />
              </li>
            );
          } else {
            return (
              <li
                key={entry.id}
                className={getEntryClassName(entry)}
                onClick={(event) => onEntryClick({ event, entry })}
              >
                <Entry
                  entry={entry}
                  selectedFolder={selectedFolder}
                  highlighted={false}
                  selectModeEnabled={selectModeEnabled}
                  onHighlight={onHighlight}
                  onToggle={onToggle}
                  onToggleRange={onToggleRange}
                  onEnter={onEnter}
                  i18n={i18n}
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
  onToggle,
  onEnter,
  i18n,
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
        />
      )}
      <EntryName
        entry={entry}
        selectedFolder={selectedFolder}
        selectModeEnabled={selectModeEnabled}
        onEnter={onEnter}
        i18n={i18n}
        messages={messages}
      />
      <EntrySize entry={entry} i18n={i18n} />
      <EntryButton
        entry={entry}
        selectedFolder={selectedFolder}
        onEnter={onEnter}
        messages={messages}
      />
    </>
  );
}

function getEntrySize(entry) {
  if (!entry.directory) {
    return entry.uncompressedSize;
  }
}

function EntryName({
  entry,
  selectedFolder,
  selectModeEnabled,
  onEnter,
  i18n,
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
      const { compressedSize, lastModified, lastModDate } = entry.data;
      const uncompressedSize = getEntrySize(entry);
      tooltip.push(
        LAST_MOD_DATE_LABEL +
          " " +
          i18n.formatDate(
            lastModified === undefined ? lastModDate : new Date(lastModified)
          )
      );
      if (uncompressedSize && compressedSize) {
        tooltip.push(
          COMPRESSED_SIZE_LABEL + " " + i18n.formatSize(compressedSize)
        );
      }
      if (uncompressedSize) {
        tooltip.push(
          (compressedSize ? UNCOMPRESSED_SIZE_LABEL : SIZE_LABEL) +
            " " +
            i18n.formatSize(uncompressedSize)
        );
      }
    }
    return tooltip.join("\n");
  }

  function handleDoubleClick(event) {
    if (!selectModeEnabled && !event.metaKey) {
      onEnter(entry);
    }
  }

  return (
    <span
      className="entry-name"
      title={getEntryNameTitle()}
      onDoubleClick={handleDoubleClick}
    >
      <span className="list-item-name">
        {entryIsParentFolder ? messages.PARENT_FOLDER_LABEL : entry.name}
      </span>
    </span>
  );
}

function getEntrySizelabel({ entry, i18n }) {
  const uncompressedSize = getEntrySize(entry);
  if (uncompressedSize !== undefined) {
    return i18n.formatSize(uncompressedSize);
  }
}

function EntrySize({ entry, i18n }) {
  return (
    <span className="entry-size">{getEntrySizelabel({ entry, i18n })}</span>
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

  function handleClick(event) {
    event.stopPropagation();
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
