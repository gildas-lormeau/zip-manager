function getSelectedFolderFeatures({
  disabledPaste,
  disabledExportZip,
  zipFilesystem,
  selectedFolder,
  rootZipFilename,
  clipboardData,
  dialogs,
  setHighlightedIds,
  setClipboardData,
  setDialogs,
  setClickedButtonName,
  refreshSelectedFolder,
  highlightEntries,
  saveZipFile,
  getOptions,
  openDisplayError,
  filesystemService,
  fileHandlersService,
  shareTargetService,
  modifierKeyPressed,
  constants
}) {
  const {
    ZIP_EXTENSION,
    ZIP_EXTENSIONS,
    ZIP_EXTENSIONS_ACCEPT,
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

  function initSelectedFolderFeatures() {
    shareTargetService.onShareFiles(addFiles);
    fileHandlersService.onOpenWith(importZipFile);
  }

  function openPromptCreateFolder() {
    setDialogs({
      ...dialogs,
      createFolder: {}
    });
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
    setDialogs({
      ...dialogs,
      createFolder: null
    });
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
      let droppedEntries = [];
      const firstHandle = handles[0];
      handles = Array.from(handles);
      try {
        const dropFilesPrevented =
          firstHandle.kind === filesystemService.FILESYSTEM_FILE_KIND &&
          handles.length === 1 &&
          handleZipFile([await firstHandle.getAsFile()], dropFiles, options);
        if (!dropFilesPrevented) {
          const results = await Promise.allSettled(
            handles.map(async (handle) => {
              const entries = await selectedFolder.addFileSystemHandle(
                handle.getAsFileSystemHandle
                  ? await handle.getAsFileSystemHandle()
                  : handle.webkitGetAsEntry(),
                options
              );
              droppedEntries = droppedEntries.concat(entries);
            })
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
      ZIP_EXTENSIONS.find((extension) => files[0].name.endsWith(extension)) &&
      !forceAddFiles;
    if (zipFileDetected) {
      if (dialogs.chooseAction) {
        callback(files, { forceAddFiles: true });
      } else {
        setDialogs({
          ...dialogs,
          chooseAction: { files }
        });
      }
    }
    return zipFileDetected;
  }

  function closeChooseAction() {
    setDialogs({
      ...dialogs,
      chooseAction: null
    });
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
            setDialogs({
              ...dialogs,
              enterImportPassword: { onSetImportPassword: resolve }
            })
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
      ? selectedFolder.name + ZIP_EXTENSION
      : rootZipFilename;
    const options = getOptions();
    const password = options.defaultExportPassword;
    if (
      !filesystemService.savePickersSupported() ||
      options.promptForExportPassword
    ) {
      setDialogs({
        ...dialogs,
        exportZip: {
          filename,
          filenameHidden: filesystemService.savePickersSupported(),
          password
        }
      });
    } else {
      exportZip({ filename, password });
    }
  }

  function showAddFilesPicker() {
    async function showAddFilesPicker() {
      const files = await filesystemService.showOpenFilePicker({
        multiple: true
      });
      addFiles(files);
    }

    showAddFilesPicker();
  }

  function showImportZipFilePicker({ description }) {
    async function showImportZipFilePicker() {
      const files = await filesystemService.showOpenFilePicker({
        multiple: false,
        description,
        accept: ZIP_EXTENSIONS_ACCEPT
      });
      if (files.length) {
        importZipFile(files[0]);
      }
    }

    showImportZipFilePicker();
  }

  function closePromptExportZip() {
    setDialogs({
      ...dialogs,
      exportZip: null
    });
  }

  function exportZip({ filename, password }) {
    function getWritable(writable, options) {
      return selectedFolder.exportWritable(writable, options);
    }

    async function exportZip() {
      try {
        const options = getOptions();
        await saveZipFile({ filename, getWritable }, filename, {
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
        entries.forEach((entry) => moveEntry(entry));
      } else {
        const clones = entries.map((entry) => {
          let clone = entry.clone(true);
          moveEntry(entry);
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

    function moveEntry(entry) {
      try {
        zipFilesystem.move(entry, selectedFolder);
        pastedEntries.push(entry);
      } catch (error) {
        const message = error.message + (" (" + entry.name + ")");
        throw new Error(message);
      }
    }
  }

  function closePromptImportPassword() {
    setDialogs({
      ...dialogs,
      enterImportPassword: null
    });
  }

  function onSelectedFolderKeyDown(event) {
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
