function getSelectedFolderFeatures({
  disabledPaste,
  disabledExportZip,
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
  setClickedButtonName,
  refreshSelectedFolder,
  highlightEntries,
  saveEntry,
  getOptions,
  openDisplayError,
  filesystemService,
  modifierKeyPressed,
  util,
  constants
}) {
  function initSelectedFolderFeatures() {
    async function initFeatures() {
      const locationSearch = util.getLocationSearch();
      if (locationSearch) {
        util.resetLocationSearch();
        if (locationSearch === constants.SHARED_FILES_PARAMETER) {
          const sharedFilesPath = constants.SHARED_FILES_RELATIVE_PATH;
          const response = await util.fetch(sharedFilesPath);
          const formData = await response.formData();
          addFiles(formData.getAll(constants.SHARED_FILES_FIELD_NAME));
        }
      }
    }

    util.setLaunchQueueConsumer((launchParams) => {
      async function handleLaunchParams() {
        if (launchParams.files.length) {
          await Promise.all(
            launchParams.files.map(async (handle) =>
              importZipFile(await handle.getFile())
            )
          );
        }
      }

      handleLaunchParams();
    });
    initFeatures();
  }

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
            addedEntries.push(selectedFolder.addFile(file, options));
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

  function dropFiles(handles, options = {}) {
    async function dropFiles() {
      const droppedEntries = [];
      const firstHandle = handles[0];
      handles = Array.from(handles);
      try {
        const dropFilesPrevented =
          firstHandle.kind === filesystemService.FILESYSTEM_FILE_KIND &&
          handles.length === 1 &&
          handleZipFile([await firstHandle.getFile()], dropFiles, options);
        if (!dropFilesPrevented) {
          const results = await Promise.allSettled(
            handles.map(async (handle) =>
              selectedFolder.addFileSystemHandle(
                handle.getAsFileSystemHandle
                  ? await handle.getAsFileSystemHandle()
                  : handle.webkitGetAsEntry(),
                options
              )
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
        addFilePickerElement.click();
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
        importZipFilePickerElement.click();
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

  function onSelectedFolderKeyDown(event) {
    const {
      CREATE_FOLDER_KEY,
      ADD_FILES_KEY,
      IMPORT_ZIP_KEY,
      EXPORT_ZIP_KEY,
      PASTE_KEY,
      CREATE_FOLDER_BUTTON_NAME,
      ADD_FILES_BUTTON_NAME,
      IMPORT_ZIP_BUTTON_NAME,
      EXPORT_ZIP_BUTTON_NAME,
      PASTE_BUTTON_NAME
    } = constants;
    if (modifierKeyPressed(event)) {
      if (event.key === CREATE_FOLDER_KEY) {
        setClickedButtonName(CREATE_FOLDER_BUTTON_NAME);
        event.preventDefault();
      }
      if (event.key === ADD_FILES_KEY) {
        setClickedButtonName(ADD_FILES_BUTTON_NAME);
        event.preventDefault();
      }
      if (event.key === IMPORT_ZIP_KEY) {
        setClickedButtonName(IMPORT_ZIP_BUTTON_NAME);
        event.preventDefault();
      }
      if (event.key === EXPORT_ZIP_KEY && !disabledExportZip) {
        setClickedButtonName(EXPORT_ZIP_BUTTON_NAME);
        event.preventDefault();
      }
      if (event.key === PASTE_KEY && !disabledPaste) {
        setClickedButtonName(PASTE_BUTTON_NAME);
        event.preventDefault();
      }
    }
  }

  return {
    initSelectedFolderFeatures,
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
    showImportZipFilePicker,
    onSelectedFolderKeyDown
  };
}

export default getSelectedFolderFeatures;
