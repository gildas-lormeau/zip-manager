function getAppHandlers({ goIntoFolder, download }) {
  function enter(entry) {
    if (entry.directory) {
      goIntoFolder(entry);
    } else {
      download(entry);
    }
  }

  return { enter };
}

export default getAppHandlers;
