import "./styles/Entries.css";

import { useEffect, useRef, useState } from "react";

function Entries({
  entries,
  selectedFolder,
  highlightedIds,
  deltaEntriesHeight,
  entriesHeight,
  clipboardData,
  onAddFiles,
  onHighlight,
  onToggle,
  onToggleRange,
  onEnter,
  onSetEntriesHeight,
  entriesRef,
  entriesHeightRef,
  highlightedEntryRef,
  util,
  constants,
  messages
}) {
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
    if (
      clipboardData &&
      clipboardData.cut &&
      clipboardData.entries.includes(entry)
    ) {
      classes.push("entry-cut");
    }
    return classes.join(" ");
  }

  function handleKeyDown(event) {
    if (event.key !== constants.TAB_KEY) {
      event.preventDefault();
    }
  }

  function getEntriesStyle() {
    if (entriesHeight) {
      return { height: entriesHeight + deltaEntriesHeight + "px" };
    }
  }

  function computeEntriesListHeight() {
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

  function computeEntriesHeight() {
    onSetEntriesHeight(util.getHeight(entriesRef.current));
  }

  function setTouchEndEventTimeout() {
    clearTouchEndEventTimeout();
    touchEndTimeout.current = util.setTimeout(() => {
      touchEndTimeout.current = null;
      setSelectModeEnabled(!selectModeEnabled);
    }, constants.LONG_TOUCH_DELAY);
  }

  function clearTouchEndEventTimeout(event) {
    if (touchEndTimeout.current) {
      util.clearTimeout(touchEndTimeout.current);
      touchEndTimeout.current = null;
    }
  }

  function handleMouseMove(event) {
    if (event.movementX > 1 || event.movementY > 1) {
      clearTouchEndEventTimeout();
    }
  }

  function handleContextMenu(event) {
    event.preventDefault();
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDrop(event) {
    if (event.dataTransfer.files) {
      event.preventDefault();
      onAddFiles(Array.from(event.dataTransfer.files));
    }
  }

  function registerResizeHandler() {
    util.addResizeListener(computeEntriesHeight);
    return () => util.removeResizeListener(computeEntriesHeight);
  }

  useEffect(computeEntriesListHeight);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(computeEntriesHeight, []);
  useEffect(registerResizeHandler);

  return (
    <div
      className="entries"
      aria-label="Folder entries"
      role="navigation"
      ref={entriesRef}
      style={getEntriesStyle()}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <ol
        onKeyDown={handleKeyDown}
        onMouseDown={setTouchEndEventTimeout}
        onMouseMove={handleMouseMove}
        onMouseUp={clearTouchEndEventTimeout}
        onTouchStart={setTouchEndEventTimeout}
        onTouchMove={clearTouchEndEventTimeout}
        onTouchEnd={clearTouchEndEventTimeout}
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
  function onHighlightEntry() {
    selectModeEnabled ? onToggle(entry) : onHighlight(entry);
  }

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
        selectModeEnabled={selectModeEnabled}
        onHighlight={onHighlightEntry}
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
  selectModeEnabled,
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
    if (!selectModeEnabled && !event.metaKey) {
      onEnter(entry);
    }
  }

  return (
    <span
      className="entry-name"
      title={getEntryNameTitle()}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      <span className="list-item-name">
        {entryIsParentFolder ? messages.PARENT_FOLDER_LABEL : entry.name}
      </span>
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
