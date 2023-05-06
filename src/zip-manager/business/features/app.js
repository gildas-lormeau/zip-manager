function getAppFeatures({
  zipFilesystem,
  accentColor,
  musicTrackIndex,
  appStyleElement,
  setPreviousHighlight,
  setToggleNavigationDirection,
  setSelectedFolder,
  setHighlightedIds,
  setOptions,
  setHistory,
  setHistoryIndex,
  setAccentColor,
  setEntriesDeltaHeight,
  setMusicFrequencyData,
  setMusicTrackIndex,
  setOptionsDialog,
  setMusicPlayerActive,
  getOptions,
  goIntoFolder,
  openPromptExtract,
  refreshSelectedFolder,
  filesystemService,
  musicService,
  util,
  constants,
  messages
}) {
  function updateApplication() {
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

  function updateZipFilesystem() {
    const { root } = zipFilesystem;
    setSelectedFolder(root);
    setHighlightedIds([]);
    setPreviousHighlight(null);
    setToggleNavigationDirection(0);
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

  function playMusicFile(items) {
    async function playMusicFile() {
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

    playMusicFile();
  }

  function updateAccentColor() {
    if (accentColor) {
      const brightNessAccentColor = getBrightNess(accentColor);
      if (brightNessAccentColor > 192) {
        util.setDocumentClass("dark");
      } else if (brightNessAccentColor < 64) {
        util.setDocumentClass("light");
      } else {
        util.setDocumentClass("");
      }
      util.setStyle(
        appStyleElement,
        constants.ACCENT_COLOR_CUSTOM_PROPERTY_NAME,
        accentColor
      );
      const options = getOptions();
      setOptions({ ...options, accentColor: accentColor });
    }
  }

  function getBrightNess(color) {
    const red = parseInt(color.substring(1, 3), 16);
    const green = parseInt(color.substring(3, 5), 16);
    const blue = parseInt(color.substring(5, 7), 16);
    // cf. https://www.w3.org/TR/AERT/#color-contrast
    return Math.round((red * 299 + green * 587 + blue * 114) / 1000);
  }

  return {
    enter,
    openOptions,
    closeOptions,
    resetOptions,
    moveBottomBar,
    playMusic,
    stopMusic,
    updateApplication,
    updateZipFilesystem,
    updateAccentColor,
    playMusicFile
  };
}

export default getAppFeatures;
