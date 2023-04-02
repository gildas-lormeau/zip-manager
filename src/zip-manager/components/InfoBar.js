import "./styles/InfoBar.css";

import { useEffect, useRef } from "react";

function InfoBar({ hidden, accentColor, onSetAccentColor }) {
  if (hidden) {
    return;
  } else {
    return (
      <footer className="info-bar">
        <div className="source-link">
          {"Source code on "}
          <a href="https://github.com/gildas-lormeau/zip-manager">GitHub</a>
          {" | Made with "}
          <AccentColorPickerButton
            accentColor={accentColor}
            onSetAccentColor={onSetAccentColor}
          ></AccentColorPickerButton>
        </div>
      </footer>
    );
  }
}

function AccentColorPickerButton({ accentColor, onSetAccentColor }) {
  const colorInputRef = useRef(null);

  function handleClick() {
    colorInputRef.current.showPicker();
  }

  function handleChange() {
    onSetAccentColor(colorInputRef.current.value);
  }

  useEffect(() => {
    if (accentColor) {
      colorInputRef.current.value = accentColor;
    }
  }, [accentColor]);

  return (
    <>
      <span className="icon" onClick={handleClick}>
        ♡
      </span>
      {" in "}
      <a
        href="https://en.wikipedia.org/wiki/Rennes"
        target="_blank"
        rel="noreferrer"
      >
        Rennes
      </a>
      <input
        type="color"
        onChange={handleChange}
        ref={colorInputRef}
        tabIndex={-1}
      />
    </>
  );
}

export default InfoBar;
