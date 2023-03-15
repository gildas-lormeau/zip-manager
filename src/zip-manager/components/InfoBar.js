import "./styles/InfoBar.css";

import { useEffect, useRef } from "react";

function InfoBar({ accentColor, onSetAccentColor, util }) {
  return (
    <div className="info-bar">
      <div className="source-link">
        {"Source code on "}
        <a href="https://github.com/gildas-lormeau/zipjs-react-app">GitHub</a>
        {" | Made with "}
        <AccentColorPickerButton
          accentColor={accentColor}
          onSetAccentColor={onSetAccentColor}
          util={util}
        ></AccentColorPickerButton>
        {" in Rennes"}
      </div>
    </div>
  );
}

function AccentColorPickerButton({ accentColor, onSetAccentColor, util }) {
  const colorInputRef = useRef(null);

  function handleClick() {
    util.dispatchClick(colorInputRef.current);
  }

  function handleChange() {
    onSetAccentColor(colorInputRef.current.value);
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => onSetAccentColor(accentColor), [accentColor]);
  return (
    <>
      <span className="icon" onClick={handleClick}>
      ♡
      </span>
      <input
        type="color"
        onChange={handleChange}
        defaultValue={accentColor}
        ref={colorInputRef}
        hidden
      ></input>
    </>
  );
}

export default InfoBar;
