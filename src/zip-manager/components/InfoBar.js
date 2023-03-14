import "./styles/InfoBar.css";

import { useRef } from "react";

function InfoBar({ accentColor, onSetAccentColor }) {
  return (
    <div className="info-bar">
      <div className="source-link">
        {"Source code on "}
        <a href="https://github.com/gildas-lormeau/zipjs-react-app">GitHub</a> |
        Made with <span className="icon">♥️</span> in Rennes
      </div>
      <AccentColorPickerButton
        accentColor={accentColor}
        onSetAccentColor={onSetAccentColor}
      ></AccentColorPickerButton>
    </div>
  );
}

function AccentColorPickerButton({ accentColor, onSetAccentColor }) {
  const colorInputRef = useRef(null);

  function handleChange() {
    onSetAccentColor(colorInputRef.current.value);
  }

  if (colorInputRef && colorInputRef.current) {
    colorInputRef.current.value = accentColor;
    onSetAccentColor(accentColor);
  }
  return (
    <input
      type="color"
      onChange={handleChange}
      ref={colorInputRef}
      tabIndex={-1}
    ></input>
  );
}

export default InfoBar;
