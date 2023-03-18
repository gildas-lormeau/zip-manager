function getSelectedFolderFeatures({
  selectedFolder,
  getImportPassword,
  getExportPassword,
  setImportPassword,
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
      highlightSortedEntries(addedEntries);
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
        highlightSortedEntries(addedEntries);
      }
      updateSelectedFolder();
    }

    updateZipFile();
  }

  function highlightSortedEntries(entries) {
    highlightEntries(
      entries.sort((previousChild, nextChild) =>
        nextChild.name.localeCompare(previousChild.name)
      )
    );
  }

  function exportZipFile() {
    async function exportZipFile() {
      try {
        await downloadFile(
          selectedFolder.name
            ? selectedFolder.name + ZIP_EXTENSION
            : ROOT_ZIP_FILENAME,
          { mimeType: DEFAULT_MIME_TYPE },
          getImportPassword(),
          setImportPassword,
          async (download, options) => {
            try {
              return await selectedFolder.exportBlob({
                ...options,
                bufferedWrite: true,
                keepOrder: true,
                password: getExportPassword()
              });
            } finally {
              removeDownload(download);
            }
          }
        );
      } catch (error) {
        util.alert(error.message);
      }
    }

    exportZipFile();
  }

  return {
    createFolder,
    addFiles,
    importZipFile,
    exportZipFile
  };
}

export default getSelectedFolderFeatures;
