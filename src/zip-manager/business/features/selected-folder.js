function getSelectedFolderFeatures({
  selectedFolder,
  rootZipFilename,
  setExportZipDialog,
  setCreateFolderDialog,
  updateSelectedFolder,
  highlightEntries,
  removeDownload,
  downloadFile,
  openDisplayError,
  constants
}) {
  const { DEFAULT_MIME_TYPE, ZIP_EXTENSION } = constants;

  function openPromptCreateFolder() {
    setCreateFolderDialog({ opened: true });
  }

  function createFolder({ folderName }) {
    try {
      const entry = selectedFolder.addDirectory(folderName);
      highlightEntries([entry]);
      updateSelectedFolder();
    } catch (error) {
      openDisplayError(error.message);
    }
  }

  function closePromptCreateFolder() {
    setCreateFolderDialog({ opened: false });
  }

  function addFiles(files) {
    const addedEntries = [];
    files.forEach((file) => {
      try {
        addedEntries.push(
          selectedFolder.addBlob(file.name, file, {
            lastModDate: new Date(file.lastModified)
          })
        );
      } catch (error) {
        openDisplayError(error.message);
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
        openDisplayError(error.message);
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

  function openPromptExportZip() {
    setExportZipDialog({
      filename: selectedFolder.name
        ? selectedFolder.name + ZIP_EXTENSION
        : rootZipFilename,
      password: "",
      opened: true
    });
  }

  function closePromptExportZip() {
    setExportZipDialog({ opened: false, filename: "", password: "" });
  }

  function exportZip({ filename, password }) {
    async function exportZip() {
      try {
        await downloadFile(
          filename,
          { mimeType: DEFAULT_MIME_TYPE },
          async (download, options) => {
            try {
              return await selectedFolder.exportBlob({
                ...options,
                bufferedWrite: true,
                keepOrder: true,
                password
              });
            } finally {
              removeDownload(download);
            }
          }
        );
      } catch (error) {
        openDisplayError(error.message);
      }
    }

    exportZip();
  }

  return {
    openPromptCreateFolder,
    createFolder,
    closePromptCreateFolder,
    addFiles,
    importZipFile,
    openPromptExportZip,
    exportZip,
    closePromptExportZip
  };
}

export default getSelectedFolderFeatures;
