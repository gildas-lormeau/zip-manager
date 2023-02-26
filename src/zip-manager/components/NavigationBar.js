import "./styles/NavigationBar.css";

function NavigationBar({
  selectedFolder,
  disabledHistoryBackButton,
  disabledHistoryForwardButton,
  onNavigateHistoryBack,
  onNavigateHistoryForward,
  onGoIntoFolder,
  constants,
  messages
}) {
  return (
    <div className="navigation-bar">
      <HistoryButtons
        disabledHistoryBackButton={disabledHistoryBackButton}
        disabledHistoryForwardButton={disabledHistoryForwardButton}
        onNavigateHistoryBack={onNavigateHistoryBack}
        onNavigateHistoryForward={onNavigateHistoryForward}
        messages={messages}
      />
      <Breadcrumb
        folder={selectedFolder}
        onGoIntoFolder={onGoIntoFolder}
        constants={constants}
        messages={messages}
      />
    </div>
  );
}

function HistoryButtons({
  disabledHistoryBackButton,
  disabledHistoryForwardButton,
  onNavigateHistoryBack,
  onNavigateHistoryForward,
  messages
}) {
  return (
    <span className="history-buttons">
      <HistoryBackButton
        disabled={disabledHistoryBackButton}
        onNavigateHistoryBack={onNavigateHistoryBack}
        messages={messages}
      />
      <HistoryForwardButton
        disabled={disabledHistoryForwardButton}
        onNavigateHistoryForward={onNavigateHistoryForward}
        messages={messages}
      />
    </span>
  );
}

function HistoryBackButton({ disabled, onNavigateHistoryBack, messages }) {
  return (
    <button
      disabled={disabled}
      onClick={onNavigateHistoryBack}
      title={
        messages.SHORTCUT_LABEL +
        messages.ALT_KEY_LABEL +
        messages.ARROW_LEFT_KEY_LABEL
      }
    >
      {messages.BACK_BUTTON_LABEL}
    </button>
  );
}

function HistoryForwardButton({
  disabled,
  onNavigateHistoryForward,
  messages
}) {
  return (
    <button
      disabled={disabled}
      onClick={onNavigateHistoryForward}
      title={
        messages.SHORTCUT_LABEL +
        messages.ALT_KEY_LABEL +
        messages.ARROW_RIGHT_KEY_LABEL
      }
    >
      {messages.FORWARD_BUTTON_LABEL}
    </button>
  );
}

function Breadcrumb({ folder, onGoIntoFolder, constants, messages }) {
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
            constants={constants}
            messages={messages}
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

function BreadcrumbItem({
  folder,
  onGoIntoFolder,
  active,
  constants,
  messages
}) {
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
    if (event.key === constants.ENTER_KEY) {
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
      {folder.parent ? folder.name : messages.ROOT_FOLDER_LABEL}
    </span>
  );
}

export default NavigationBar;
