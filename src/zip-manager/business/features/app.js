function getAppFeatures({
  zipFilesystem,
  musicTrackIndex,
  appStyleElement,
  selectedFolderInit,
  setPreviousHighlight,
  setToggleNavigationDirection,
  setSelectedFolder,
  setHighlightedIds,
  setClipboardData,
  setOptions,
  setHistory,
  setHistoryIndex,
  setAccentColor,
  setEntriesDeltaHeight,
  setSelectedFolderInit,
  setMusicFrequencyData,
  setMusicTrackIndex,
  setOptionsDialog,
  setMusicPlayerActive,
  getHighlightedEntryElement,
  getOptions,
  goIntoFolder,
  openPromptExtract,
  addFiles,
  importZipFile,
  refreshSelectedFolder,
  filesystemService,
  musicService,
  util,
  constants,
  messages
}) {
  function initApplication() {
    const options = getOptions();
    const { accentColor } = options;
    if (appStyleElement) {
      util.setStyle(
        appStyleElement,
        constants.NO_ENTRIES_CUSTOM_PROPERTY_NAME,
        JSON.stringify(messages.NO_ENTRIES_LABEL)
      );
      util.setStyle(
        appStyleElement,
        constants.FOLDER_SEPARATOR_CUSTOM_PROPERTY_NAME,
        JSON.stringify(constants.FOLDER_SEPARATOR)
      );
    }
    setAccentColor(accentColor);
    util.removeDocumentAttribute(constants.APP_LOADING_ATTRIBUTE_NAME);
  }

  function initSelectedFolder() {
    async function initSelectedFolder() {
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

    if (!selectedFolderInit) {
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
      setSelectedFolderInit(true);
    }
    initSelectedFolder();
  }

  function initZipFilesystem() {
    const { root } = zipFilesystem;
    setSelectedFolder(root);
    setHighlightedIds([]);
    setPreviousHighlight(null);
    setToggleNavigationDirection(0);
    setClipboardData(null);
    setHistory([root]);
    setHistoryIndex(0);
    refreshSelectedFolder(root);
  }

  function enter(entry) {
    if (entry.directory) {
      goIntoFolder(entry);
    } else {
      openPromptExtract(entry);
    }
  }

  function applyAccentColor(color) {
    util.setStyle(
      appStyleElement,
      constants.ACCENT_COLOR_CUSTOM_PROPERTY_NAME,
      color
    );
    const options = getOptions();
    setOptions({ ...options, accentColor: color });
  }

  function moveBottomBar(deltaY) {
    setEntriesDeltaHeight(deltaY);
  }

  function openOptions() {
    setOptionsDialog(getOptions());
  }

  function closeOptions() {
    setOptionsDialog(null);
  }

  function resetOptions() {
    const options = { ...constants.DEFAULT_OPTIONS };
    options.maxWorkers = util.getDefaultMaxWorkers();
    setOptionsDialog(options);
  }

  function scrollToHighlightedEntry() {
    if (getHighlightedEntryElement()) {
      util.scrollIntoView(getHighlightedEntryElement());
    }
  }

  function playMusic() {
    async function playMusic() {
      const options = getOptions();
      const { musicData } = options;
      let contentType, data;
      if (musicData) {
        data = new Uint8Array(musicData).buffer;
      } else {
        const response = await util.fetch(
          constants.MUSIC_TRACK_RELATIVE_PATH_PREFIX + (musicTrackIndex + 1)
        );
        const blob = await response.blob();
        contentType = blob.type;
        data = await blob.arrayBuffer();
      }
      const masterVolume = constants.MUSIC_TRACKS_VOLUMES[musicTrackIndex];
      await musicService.play({
        data,
        masterVolume,
        contentType,
        onSetFrequencyData: setMusicFrequencyData
      });
      setMusicPlayerActive(true);
    }

    playMusic();
  }

  function stopMusic() {
    musicService.stop();
    setMusicTrackIndex(
      (musicTrackIndex + 1) % constants.MUSIC_TRACKS_VOLUMES.length
    );
    setMusicPlayerActive(false);
  }

  function setMusicFile(items) {
    async function setMusicFile() {
      const file = await (
        await filesystemService.getFilesystemHandles(items)
      )[0].getFile();
      if (
        file.name.endsWith(constants.MIDI_FILE_EXTENSION) ||
        file.type === constants.MIDI_CONTENT_TYPE
      ) {
        const arrayBuffer = await file.arrayBuffer();
        const data = Array.from(new Uint8Array(arrayBuffer));
        const options = getOptions();
        options.musicData = data;
        setOptions(options);
      }
    }

    setMusicFile();
  }

  return {
    initApplication,
    initZipFilesystem,
    initSelectedFolder,
    enter,
    openOptions,
    closeOptions,
    resetOptions,
    applyAccentColor,
    moveBottomBar,
    scrollToHighlightedEntry,
    playMusic,
    stopMusic,
    setMusicFile
  };
}

export default getAppFeatures;
