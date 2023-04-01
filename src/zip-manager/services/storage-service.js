function getStorageService({ util }) {
  function setValue(key, value) {
    util.saveValue(key, value);
  }

  function getValue(key) {
    return util.restoreValue(key);
  }

  return {
    set: setValue,
    get: getValue
  };
}

export { getStorageService };
