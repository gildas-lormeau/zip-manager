import "./styles/NavigationBar.css";

function Breadcrumb({
  folder,
  ancestorFolders,
  onGoIntoFolder,
  constants,
  messages
}) {
  const selectedFolder = folder;
  return (
    <nav className="breadcrumb">
      <ol>
        {ancestorFolders.map((folder) => (
          <li key={folder.id}>
            <BreadcrumbItem
              folder={folder}
              onGoIntoFolder={onGoIntoFolder}
              active={ancestorFolders.length > 1 && folder !== selectedFolder}
              isSelectedFolder={folder === selectedFolder}
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
      aria-label={isSelectedFolder ? null : messages.GO_INTO_FOLDER_LABEL}
      onClick={handleClick}
      onKeyUp={(event) => handleKeyUp({ event, folder })}
      tabIndex={active ? 0 : null}
    >
      {folder.parent ? folder.name : messages.ROOT_FOLDER_LABEL}
    </span>
  );
}

export default Breadcrumb;
