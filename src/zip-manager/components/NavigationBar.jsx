import "./styles/NavigationBar.css";

import Button from "./Button.jsx";

function NavigationBar({
  hidden,
  selectedFolder,
  ancestorFolders,
  disabledBackButton,
  disabledForwardButton,
  clickedButtonName,
  onNavigateBack,
  onNavigateForward,
  onGoIntoFolder,
  onClickedButton,
  constants,
  messages
}) {
  if (hidden) {
    return;
  } else {
    return (
      <div
        className="navigation-bar"
        role="toolbar"
        aria-label="Navigation history"
      >
        <HistoryButtons
          disabledBackButton={disabledBackButton}
          disabledForwardButton={disabledForwardButton}
          clickedButtonName={clickedButtonName}
          onNavigateBack={onNavigateBack}
          onNavigateForward={onNavigateForward}
          onClickedButton={onClickedButton}
          constants={constants}
          messages={messages}
        />
        <Breadcrumb
          folder={selectedFolder}
          ancestorFolders={ancestorFolders}
          onGoIntoFolder={onGoIntoFolder}
          constants={constants}
          messages={messages}
        />
      </div>
    );
  }
}

function HistoryButtons({
  disabledBackButton,
  disabledForwardButton,
  clickedButtonName,
  onNavigateBack,
  onNavigateForward,
  onClickedButton,
  constants,
  messages
}) {
  return (
    <span className="history-buttons">
      <BackButton
        disabled={disabledBackButton}
        clickedButtonName={clickedButtonName}
        onNavigateBack={onNavigateBack}
        onClickedButton={onClickedButton}
        constants={constants}
        messages={messages}
      />
      <ForwardButton
        disabled={disabledForwardButton}
        clickedButtonName={clickedButtonName}
        onNavigateForward={onNavigateForward}
        onClickedButton={onClickedButton}
        constants={constants}
        messages={messages}
      />
    </span>
  );
}

function BackButton({
  disabled,
  clickedButtonName,
  onNavigateBack,
  onClickedButton,
  constants,
  messages
}) {
  return (
    <Button
      name={constants.BACK_BUTTON_NAME}
      title={messages.BACK_BUTTON_TOOLTIP}
      label={messages.BACK_BUTTON_LABEL}
      ariaLabel="Go back"
      disabled={disabled}
      clickedButtonName={clickedButtonName}
      onClick={onNavigateBack}
      onClickedButton={onClickedButton}
    />
  );
}

function ForwardButton({
  disabled,
  clickedButtonName,
  onNavigateForward,
  onClickedButton,
  constants,
  messages
}) {
  return (
    <Button
      name={constants.FORWARD_BUTTON_NAME}
      title={messages.FORWARD_BUTTON_TOOLTIP}
      label={messages.FORWARD_BUTTON_LABEL}
      ariaLabel="Go forward"
      disabled={disabled}
      clickedButtonName={clickedButtonName}
      onClick={onNavigateForward}
      onClickedButton={onClickedButton}
    />
  );
}

function Breadcrumb({
  folder,
  ancestorFolders,
  onGoIntoFolder,
  constants,
  messages
}) {
  const lastItemFolder = folder;
  return (
    <nav className="breadcrumb">
      <ol>
        {ancestorFolders.map((folder) => (
          <li key={folder.id}>
            <BreadcrumbItem
              folder={folder}
              onGoIntoFolder={onGoIntoFolder}
              active={ancestorFolders.length > 1 && folder !== lastItemFolder}
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
    if (active) {
      onGoIntoFolder(folder);
    }
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
      aria-label={isSelectedFolder ? null : "Go into folder"}
      onClick={handleClick}
      onKeyUp={(event) => handleKeyUp({ event, folder })}
      tabIndex={active ? 0 : null}
    >
      {folder.parent ? folder.name : messages.ROOT_FOLDER_LABEL}
    </span>
  );
}

export default NavigationBar;
