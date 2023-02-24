import "./styles/NavigationBar.css";
import {
  ENTER_KEY,
  ROOT_FOLDER_LABEL,
  SHORTCUT_LABEL,
  ALT_KEY_LABEL,
  ARROW_LEFT_KEY_LABEL,
  ARROW_RIGHT_KEY_LABEL
} from "./../business/constants.js";

function NavigationBar({
  selectedFolder,
  disabledHistoryBackButton,
  disabledHistoryForwardButton,
  onNavigateHistoryBack,
  onNavigateHistoryForward,
  onGoIntoFolder
}) {
  return (
    <span className="navigation-bar">
      <HistoryButtons
        disabledHistoryBackButton={disabledHistoryBackButton}
        disabledHistoryForwardButton={disabledHistoryForwardButton}
        onNavigateHistoryBack={onNavigateHistoryBack}
        onNavigateHistoryForward={onNavigateHistoryForward}
      />
      <Breadcrumb folder={selectedFolder} onGoIntoFolder={onGoIntoFolder} />
    </span>
  );
}

function HistoryButtons({
  disabledHistoryBackButton,
  disabledHistoryForwardButton,
  onNavigateHistoryBack,
  onNavigateHistoryForward
}) {
  return (
    <span className="history-buttons">
      <HistoryBackButton
        disabled={disabledHistoryBackButton}
        onNavigateHistoryBack={onNavigateHistoryBack}
      />
      <HistoryForwardButton
        disabled={disabledHistoryForwardButton}
        onNavigateHistoryForward={onNavigateHistoryForward}
      />
    </span>
  );
}

function HistoryBackButton({
  disabled,
  onNavigateHistoryBack
}) {
  return (
    <button
      disabled={disabled}
      onClick={onNavigateHistoryBack}
      title={SHORTCUT_LABEL + ALT_KEY_LABEL + ARROW_LEFT_KEY_LABEL}
    >
      &lt;
    </button>
  );
}

function HistoryForwardButton({
  disabled,
  onNavigateHistoryForward
}) {
  return (
    <button
      disabled={disabled}
      onClick={onNavigateHistoryForward}
      title={SHORTCUT_LABEL + ALT_KEY_LABEL + ARROW_RIGHT_KEY_LABEL}
    >
      &gt;
    </button>
  );
}

function Breadcrumb({ folder, onGoIntoFolder }) {
  const lastItemFolder = folder;
  const ancestors = getAncestors(folder);
  return (
    <ol className="breadcrumb">
      {ancestors.map((folder) => (
        <li key={folder.id}>
          <BreadcrumbItem
            folder={folder}
            onGoIntoFolder={onGoIntoFolder}
            active={ancestors.length > 1 && folder !== lastItemFolder}
          />
        </li>
      ))}
    </ol>
  );
}

function getAncestors(folder) {
  const ancestors = [];
  while (folder && folder.parent) {
    ancestors.unshift(folder);
    folder = folder.parent;
  }
  if (folder) {
    ancestors.unshift(folder);
  }
  return ancestors;
}

function BreadcrumbItem({ folder, onGoIntoFolder, active }) {
  function getBreadcrumbItemClassName() {
    const classes = ["breadcrumb-item"];
    if (active) {
      classes.push("breadcrumb-item-active");
    }
    return classes.join(" ");
  }

  function handleClick() {
    onGoIntoFolder(folder);
  }

  function handleKeyUp({ event, folder }) {
    if (event.key === ENTER_KEY) {
      handleClick(folder);
    }
  }

  return (
    <span
      className={getBreadcrumbItemClassName()}
      onClick={handleClick}
      onKeyUp={(event) => handleKeyUp({ event, folder })}
      tabIndex={active ? 0 : null}
    >
      {folder.parent ? folder.name : ROOT_FOLDER_LABEL}
    </span>
  );
}

export default NavigationBar;
