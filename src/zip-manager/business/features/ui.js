function getUIHandlers({ util }) {
  function setAccentColor(color) {
    util.saveAccentColor(color);
  }

  return {
    setAccentColor
  };
}

export default getUIHandlers;
