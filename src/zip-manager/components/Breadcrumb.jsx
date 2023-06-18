function Breadcrumb({
  folder: selectedFolder,
  ancestorFolders,
  onGoIntoFolder,
  constants,
  messages
}) {
  return (
    <nav className="breadcrumb">
      <ol>
        {ancestorFolders.map((folder) => {
          const isSelectedFolder = folder === selectedFolder;
          return (
            <li key={folder.id}>
              <BreadcrumbItem
                folder={folder}
                disabled={!ancestorFolders.length || isSelectedFolder}
                isSelectedFolder={isSelectedFolder}
                onGoIntoFolder={onGoIntoFolder}
                constants={constants}
                messages={messages}
              />
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function BreadcrumbItem({
  folder,
  onGoIntoFolder,
  disabled,
  isSelectedFolder,
  constants,
  messages
}) {
  function getBreadcrumbItemClassName() {
    const classes = ["breadcrumb-item"];
    if (!disabled) {
      classes.push("breadcrumb-item-active");
    }
    return classes.join(" ");
  }

  function handleClick() {
    if (!disabled) {
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
      aria-label={isSelectedFolder ? null : messages.GO_INTO_FOLDER_LABEL}
      onClick={handleClick}
      onKeyUp={(event) => handleKeyUp({ event, folder })}
      tabIndex={disabled ? null : 0}
    >
      {folder.parent ? folder.name : messages.ROOT_FOLDER_LABEL}
    </span>
  );
}

export default Breadcrumb;
