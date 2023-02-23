import "./styles/Breadcrumb.css";

import {
  ENTER_KEY,
  ACTION_KEY,
  ROOT_FOLDER_LABEL
} from "./../business/constants.js";

function Breadcrumb({ folder, onGoIntoFolder }) {
  const folderAncestors = [];
  const lastItemFolder = folder;

  function getBreadcrumbItemClassName(itemFolder) {
    const classes = ["breadcrumb-item"];
    if (folderAncestors.length > 1 && itemFolder !== lastItemFolder) {
      classes.push("breadcrumb-item-active");
    }
    return classes.join(" ");
  }

  function getTabIndex(itemFolder) {
    if (folderAncestors.length > 1 && itemFolder !== lastItemFolder) {
      return 0;
    } else {
      return null;
    }
  }

  function handleClick(folder) {
    onGoIntoFolder(folder);
  }

  function handleKeyUp({ event, folder }) {
    if (event.key === ENTER_KEY || event.key === ACTION_KEY) {
      handleClick(folder);
    }
  }

  while (folder && folder.parent) {
    folderAncestors.unshift(folder);
    folder = folder.parent;
  }
  if (folder) {
    folderAncestors.unshift(folder);
  }
  return (
    <ol className="breadcrumb">
      {folderAncestors.map((folder) => (
        <li key={folder.id}>
          <span
            className={getBreadcrumbItemClassName(folder)}
            onClick={() => handleClick(folder)}
            onKeyUp={(event) => handleKeyUp({ event, folder })}
            tabIndex={getTabIndex(folder)}
          >
            {folder.parent ? folder.name : ROOT_FOLDER_LABEL}
          </span>
        </li>
      ))}
    </ol>
  );
}

export default Breadcrumb;
