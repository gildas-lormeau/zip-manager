function getOptionsFeatures({ setOptionsDialog, getOptions, util, constants }) {
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

  return {
    openOptions,
    closeOptions,
    resetOptions
  };
}

export default getOptionsFeatures;
