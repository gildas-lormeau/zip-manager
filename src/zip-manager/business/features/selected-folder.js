function getSelectedFolderFeatures({
  zipFilesystem,
  selectedFolder,
  rootZipFilename,
  clipboardData,
  addFilePickerElement,
  importZipFilePickerElement,
  chooseActionDialog,
  setHighlightedIds,
  setClipboardData,
  setImportPasswordDialog,
  setExportZipDialog,
  setCreateFolderDialog,
  setChooseActionDialog,
  refreshSelectedFolder,
  highlightEntries,
  saveEntry,
  getOptions,
  openDisplayError,
  filesystemService,
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
      refreshSelectedFolder();
    } catch (error) {
      openDisplayError(error.message);
    }
  }

  function closePromptCreateFolder() {
    setCreateFolderDialog(null);
  }

  function addFiles(files, options = {}) {
    const addFilesPrevented = handleZipFile(files, addFiles, options);
    if (!addFilesPrevented) {
      const addedEntries = [];
      try {
        files.forEach((file) => {
          try {
            addedEntries.push(
              selectedFolder.addBlob(file.name, file, {
                lastModDate: new Date(file.lastModified)
              })
            );
          } catch (error) {
            const message =
              error.message + (file ? " (" + file.name + ")" : "");
            throw new Error(message);
          }
        });
      } catch (error) {
        openDisplayError(error.message);
      } finally {
        if (addedEntries.length) {
          highlightSortedEntries(addedEntries);
        }
        refreshSelectedFolder();
      }
    }
  }

  function dropFiles(items, options = {}) {
    async function dropFiles() {
      const handles = await filesystemService.getFilesystemHandles(items);
      const droppedEntries = [];
      const firstHandle = handles[0];
      try {
        const dropFilesPrevented =
          firstHandle.kind === filesystemService.FILESYSTEM_FILE_KIND &&
          handles.length === 1 &&
          handleZipFile([await firstHandle.getFile()], dropFiles, options);
        if (!dropFilesPrevented) {
          const results = await Promise.allSettled(
            handles.map((handle) =>
              addFile(handle, selectedFolder, droppedEntries)
            )
          );
          const errorResult = results.find(
            (result) => result.status === "rejected"
          );
          if (errorResult) {
            throw errorResult.reason;
          }
        }
      } catch (error) {
        openDisplayError(error.message);
      } finally {
        const addedEntries = selectedFolder.children.filter((entry) =>
          droppedEntries.includes(entry)
        );
        if (addedEntries.length) {
          highlightSortedEntries(addedEntries);
        }
        refreshSelectedFolder();
      }
    }

    async function addFile(entry, parentEntry, addedEntries) {
      try {
        if (entry.kind === filesystemService.FILESYSTEM_FILE_KIND) {
          const file = await entry.getFile();
          const fileEntry = parentEntry.addBlob(entry.name, file);
          addedEntries.push(fileEntry);
        } else if (entry.kind === filesystemService.FILESYSTEM_DIRECTORY_KIND) {
          const directoryEntry = parentEntry.addDirectory(entry.name);
          addedEntries.push(directoryEntry);
          for await (const value of entry.values()) {
            await addFile(value, directoryEntry, addedEntries);
          }
        }
      } catch (error) {
        const message = error.message + (entry ? " (" + entry.name + ")" : "");
        throw new Error(message);
      }
      return addedEntries;
    }

    dropFiles();
  }

  function handleZipFile(files, callback, { forceAddFiles }) {
    const zipFileDetected =
      files.length === 1 &&
      constants.ZIP_EXTENSIONS.find((extension) =>
        files[0].name.endsWith(extension)
      ) &&
      !forceAddFiles;
    if (zipFileDetected) {
      if (chooseActionDialog) {
        callback(files, { forceAddFiles: true });
      } else {
        setChooseActionDialog({ files });
      }
    }
    return zipFileDetected;
  }

  function closeChooseAction() {
    setChooseActionDialog(null);
  }

  function importZipFile(zipFile, options = {}) {
    async function updateZipFile() {
      let importedEntries = [],
        addedEntries = [];
      try {
        importedEntries = await selectedFolder.importBlob(zipFile, options);
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
        }
      } catch (error) {
        cleanup(importedEntries);
        const entry = error?.cause?.entry;
        const paths = entry && entry.filename.split("/");
        const message =
          error.message +
          (paths && paths.length ? " (" + paths.pop() + ")" : "");
        openDisplayError(message);
      } finally {
        addedEntries = selectedFolder.children.filter((entry) =>
          importedEntries.includes(entry)
        );
        if (addedEntries.length) {
          highlightSortedEntries(addedEntries);
        }
        refreshSelectedFolder();
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
    const options = getOptions();
    const password = options.defaultExportPassword;
    if (
      !filesystemService.savePickersSupported() ||
      options.promptForExportPassword
    ) {
      setExportZipDialog({
        filename,
        filenameHidden: filesystemService.savePickersSupported(),
        password
      });
    } else {
      exportZip({ filename, password });
    }
  }

  function showAddFilesPicker() {
    async function showAddFilesPicker() {
      if (filesystemService.openFilePickerSupported()) {
        const files = await filesystemService.showOpenFilePicker({
          multiple: true
        });
        addFiles(files);
      } else {
        util.dispatchClick(addFilePickerElement);
      }
    }

    showAddFilesPicker();
  }

  function showImportZipFilePicker({ description }) {
    async function showImportZipFilePicker() {
      if (filesystemService.openFilePickerSupported()) {
        const files = await filesystemService.showOpenFilePicker({
          multiple: false,
          description,
          accept: constants.ZIP_EXTENSIONS_ACCEPT
        });
        if (files.length) {
          importZipFile(files[0]);
        }
      } else {
        util.dispatchClick(importZipFilePickerElement);
      }
    }

    showImportZipFilePicker();
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
          password,
          readerOptions: {
            checkSignature: options.checkSignature
          }
        });
      } catch (error) {
        openDisplayError(error.message);
      }
    }

    exportZip();
  }

  function paste() {
    let pastedEntries = [];
    try {
      const { entries, cut } = clipboardData;
      if (cut) {
        entries.forEach((entry) => {
          try {
            zipFilesystem.move(entry, selectedFolder);
            pastedEntries.push(entry);
          } catch (error) {
            const message = error.message + (" (" + entry.name + ")");
            throw new Error(message);
          }
        });
      } else {
        const clones = entries.map((entry) => {
          let clone = entry.clone(true);
          try {
            zipFilesystem.move(entry, selectedFolder);
            pastedEntries.push(entry);
          } catch (error) {
            const message = error.message + (" (" + entry.name + ")");
            throw new Error(message);
          }
          return clone;
        });
        setClipboardData({ entries: clones });
      }
    } catch (error) {
      openDisplayError(error.message);
    } finally {
      if (pastedEntries.length) {
        setHighlightedIds(pastedEntries.map((entry) => entry.id));
      }
      refreshSelectedFolder();
    }
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
    closeChooseAction,
    importZipFile,
    openPromptExportZip,
    exportZip,
    paste,
    closePromptExportZip,
    closePromptImportPassword,
    showAddFilesPicker,
    showImportZipFilePicker
  };
}

export default getSelectedFolderFeatures;
