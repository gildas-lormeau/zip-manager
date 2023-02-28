import "./styles/NavigationBar.css";

function NavigationBar({
  selectedFolder,
  disabledBackButton,
  disabledForwardButton,
  onNavigateBack,
  onNavigateForward,
  onGoIntoFolder,
  constants,
  messages
}) {
  return (
    <div className="navigation-bar" role="toolbar">
      <HistoryButtons
        disabledBackButton={disabledBackButton}
        disabledForwardButton={disabledForwardButton}
        onNavigateBack={onNavigateBack}
        onNavigateForward={onNavigateForward}
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
  disabledBackButton,
  disabledForwardButton,
  onNavigateBack,
  onNavigateForward,
  messages
}) {
  return (
    <span className="history-buttons" aria-label="History commands">
      <BackButton
        disabled={disabledBackButton}
        onNavigateBack={onNavigateBack}
        messages={messages}
      />
      <ForwardButton
        disabled={disabledForwardButton}
        onNavigateForward={onNavigateForward}
        messages={messages}
      />
    </span>
  );
}

function BackButton({ disabled, onNavigateBack, messages }) {
  return (
    <button
      disabled={disabled}
      onClick={onNavigateBack}
      title={messages.BACK_BUTTON_TOOLTIP}
    >
      {messages.BACK_BUTTON_LABEL}
    </button>
  );
}

function ForwardButton({ disabled, onNavigateForward, messages }) {
  return (
    <button
      disabled={disabled}
      onClick={onNavigateForward}
      title={messages.FORWARD_BUTTON_TOOLTIP}
    >
      {messages.FORWARD_BUTTON_LABEL}
    </button>
  );
}

function Breadcrumb({ folder, onGoIntoFolder, constants, messages }) {
  const lastItemFolder = folder;
  const ancestors = getAncestors(folder);
  return (
    <nav className="breadcrumb" aria-label="Selected folder ancestors">
      <ol>
        {ancestors.map((folder) => (
          <li key={folder.id}>
            <BreadcrumbItem
              folder={folder}
              onGoIntoFolder={onGoIntoFolder}
              active={ancestors.length > 1 && folder !== lastItemFolder}
              isSelectedFolder={folder === lastItemFolder}
              constants={constants}
              messages={messages}
            />
          </li>
        ))}
      </ol>
    </nav>
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
  isSelectedFolder,
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
      role="button"
      aria-current={isSelectedFolder ? "location" : null}
      onClick={handleClick}
      onKeyUp={(event) => handleKeyUp({ event, folder })}
      tabIndex={active ? 0 : null}
    >
      {folder.parent ? folder.name : messages.ROOT_FOLDER_LABEL}
    </span>
  );
}

export default NavigationBar;
