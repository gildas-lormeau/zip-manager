function getSelectedFolderHandlers({
  selectedFolder,
  getPassword,
  updateSelectedFolder,
  highlightEntries,
  removeDownload,
  downloadFile,
  util,
  constants,
  messages
}) {
  const { DEFAULT_MIME_TYPE, ZIP_EXTENSION } = constants;
  const { ROOT_ZIP_FILENAME, CREATE_FOLDER_MESSAGE } = messages;

  function createFolder() {
    const folderName = util.prompt(CREATE_FOLDER_MESSAGE);
    if (folderName) {
      try {
        const entry = selectedFolder.addDirectory(folderName);
        highlightEntries([entry]);
        updateSelectedFolder();
      } catch (error) {
        util.alert(error.message);
      }
    }
  }

  function addFiles(files) {
    const addedEntries = [];
    files.forEach((file) => {
      try {
        addedEntries.push(selectedFolder.addBlob(file.name, file));
      } catch (error) {
        util.alert(error.message);
      }
    });
    if (addedEntries.length) {
      highlightEntries(addedEntries);
    }
    updateSelectedFolder();
  }

  function importZipFile(zipFile) {
    async function updateZipFile() {
      const children = [...selectedFolder.children];
      try {
        await selectedFolder.importBlob(zipFile);
      } catch (error) {
        util.alert(error.message);
      }
      const addedEntries = selectedFolder.children.filter(
        (entry) => !children.includes(entry)
      );
      if (addedEntries.length) {
        highlightEntries(addedEntries);
      }
      updateSelectedFolder();
    }

    updateZipFile();
  }

  function exportZipFile() {
    downloadFile(
      selectedFolder.name
        ? selectedFolder.name + ZIP_EXTENSION
        : ROOT_ZIP_FILENAME,
      { mimeType: DEFAULT_MIME_TYPE },
      async (download, options) => {
        const blob = await selectedFolder.exportBlob({
          ...options,
          password: getPassword()
        });
        removeDownload(download);
        return blob;
      }
    );
  }

  return {
    createFolder,
    addFiles,
    importZipFile,
    exportZipFile
  };
}

export default getSelectedFolderHandlers;
