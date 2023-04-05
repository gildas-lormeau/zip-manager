function getSelectedFolderFeatures({
  zipFilesystem,
  selectedFolder,
  rootZipFilename,
  setImportPasswordDialog,
  setExportZipDialog,
  setCreateFolderDialog,
  updateSelectedFolder,
  highlightEntries,
  removeDownload,
  downloadFile,
  getOptions,
  openDisplayError,
  constants
}) {
  const { DEFAULT_MIME_TYPE, ZIP_EXTENSION } = constants;

  function openPromptCreateFolder() {
    setCreateFolderDialog({});
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
    setCreateFolderDialog(null);
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

  function importZipFile(zipFile, options = {}) {
    async function updateZipFile() {
      let addedEntries = [];
      try {
        const importedEntries = await selectedFolder.importBlob(
          zipFile,
          options
        );
        addedEntries = selectedFolder.children.filter((entry) =>
          importedEntries.includes(entry)
        );
        const isPasswordProtected = (
          await Promise.all(
            importedEntries.map(
              (entry) => !entry.directory && entry.isPasswordProtected()
            )
          )
        ).includes(true);
        if (isPasswordProtected && !options.password) {
          addedEntries.forEach((entry) => zipFilesystem.remove(entry));
          const { password } = await new Promise((resolve) =>
            setImportPasswordDialog({ onSetImportPassword: resolve })
          );
          const isValidPassword = !(
            await Promise.all(
              importedEntries.map(
                (entry) => entry.directory || entry.checkPassword(password)
              )
            )
          ).includes(false);
          importZipFile(zipFile, isValidPassword ? { password } : {});
        } else {
          highlightSortedEntries(addedEntries);
          updateSelectedFolder();
        }
      } catch (error) {
        openDisplayError(error.message);
      }
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
      password: ""
    });
  }

  function closePromptExportZip() {
    setExportZipDialog(null);
  }

  function exportZip({ filename, password }) {
    async function exportZip() {
      try {
        await downloadFile(
          filename,
          { mimeType: DEFAULT_MIME_TYPE },
          async (download, options) => {
            try {
              const { bufferedWrite, keepOrder } = getOptions();
              return await selectedFolder.exportBlob({
                ...options,
                bufferedWrite,
                keepOrder,
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

  function closePromptImportPassword() {
    setImportPasswordDialog(null);
  }

  return {
    openPromptCreateFolder,
    createFolder,
    closePromptCreateFolder,
    addFiles,
    importZipFile,
    openPromptExportZip,
    exportZip,
    closePromptExportZip,
    closePromptImportPassword
  };
}

export default getSelectedFolderFeatures;
