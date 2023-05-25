/* global document */

const ACCENT_COLOR_CUSTOM_PROPERTY_NAME = "--accent-color";

function setTheme({ accentColor, skin }) {
  const documentClasses = [skin];
  const brightNessAccentColor = getBrightNess(accentColor);
  if (brightNessAccentColor > 224) {
    documentClasses.push("dark");
  } else if (brightNessAccentColor < 32) {
    documentClasses.push("light");
  }
  document.documentElement.className = documentClasses.join(" ");
}

function getBrightNess(color) {
  const red = parseInt(color.substring(1, 3), 16);
  const green = parseInt(color.substring(3, 5), 16);
  const blue = parseInt(color.substring(5, 7), 16);
  // cf. https://www.w3.org/TR/AERT/#color-contrast
  return Math.round((red * 299 + green * 587 + blue * 114) / 1000);
}

export { ACCENT_COLOR_CUSTOM_PROPERTY_NAME, setTheme };
