function getSelectedFolderFeatures({
  zipFilesystem,
  selectedFolder,
  rootZipFilename,
  setImportPasswordDialog,
  setExportZipDialog,
  setCreateFolderDialog,
  updateSelectedFolder,
  highlightEntries,
  saveEntry,
  getOptions,
  openDisplayError,
  util,
  constants
}) {
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

  function dropFiles(handles) {
    async function dropFiles() {
      const addedEntries = await addFiles(handles, selectedFolder);
      const addedChildEntries = selectedFolder.children.filter((entry) =>
        addedEntries.includes(entry)
      );
      highlightSortedEntries(addedChildEntries);
      updateSelectedFolder();
    }

    async function addFiles(handle, parentEntry, addedEntries = []) {
      for await (const value of handle.values()) {
        if (value.kind === "file") {
          const file = await value.getFile();
          const fileEntry = parentEntry.addBlob(value.name, file);
          addedEntries.push(fileEntry);
        } else if (value.kind === "directory") {
          const directoryEntry = parentEntry.addDirectory(value.name);
          addedEntries.push(directoryEntry);
          await addFiles(value, directoryEntry, addedEntries);
        }
      }
      return addedEntries;
    }

    dropFiles();
  }

  function importZipFile(zipFile, options = {}) {
    async function updateZipFile() {
      let importedEntries = [];
      try {
        const importedEntries = await selectedFolder.importBlob(
          zipFile,
          options
        );
        const isPasswordProtected = (
          await Promise.all(
            importedEntries.map(
              (entry) => !entry.directory && entry.isPasswordProtected()
            )
          )
        ).includes(true);
        if (isPasswordProtected && !options.password) {
          cleanup(importedEntries);
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
          const addedChildEntries = selectedFolder.children.filter((entry) =>
            importedEntries.includes(entry)
          );
          highlightSortedEntries(addedChildEntries);
          updateSelectedFolder();
        }
      } catch (error) {
        cleanup(importedEntries);
        openDisplayError(error.message);
      }
    }

    function cleanup(importedEntries) {
      importedEntries.forEach(
        (entry) => !entry.directory && zipFilesystem.remove(entry)
      );
      importedEntries.forEach(
        (entry) =>
          entry.directory &&
          !entry.children.length &&
          zipFilesystem.remove(entry)
      );
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
    const filename = selectedFolder.name
      ? selectedFolder.name + constants.ZIP_EXTENSION
      : rootZipFilename;
    setExportZipDialog({
      filename,
      filenameHidden: util.savePickersSupported(),
      password: ""
    });
  }

  function closePromptExportZip() {
    setExportZipDialog(null);
  }

  function exportZip({ filename, password }) {
    function getWritable(writable, options) {
      return selectedFolder.exportWritable(writable, options);
    }

    async function exportZip() {
      try {
        const options = getOptions();
        await saveEntry({ filename, getWritable }, filename, {
          ...options,
          password
        });
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
    dropFiles,
    importZipFile,
    openPromptExportZip,
    exportZip,
    closePromptExportZip,
    closePromptImportPassword
  };
}

export default getSelectedFolderFeatures;
