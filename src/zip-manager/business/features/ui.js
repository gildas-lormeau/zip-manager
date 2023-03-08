function getUIHandlers({ util }) {
  function setAccentColor(color) {
    util.setAccentColor(color);
  }

  return {
    setAccentColor
  };
}

export default getUIHandlers;
