import "./styles/Breadcrumb.css";

import {
  ENTER_KEY,
  ROOT_FOLDER_LABEL
} from "./../business/constants.js";

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

export default Breadcrumb;
