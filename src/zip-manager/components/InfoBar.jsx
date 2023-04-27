import "./styles/InfoBar.css";

import { useEffect, useRef } from "react";

function InfoBar({ hidden, accentColor, onSetAccentColor, messages }) {
  if (hidden) {
    return;
  } else {
    return (
      <footer className="info-bar">
        <div className="source-link">
          {messages.INFO_LABEL[0]}
          <a
            href="https://github.com/gildas-lormeau/zip-manager"
            target="_blank"
            rel="noreferrer"
          >
            {messages.INFO_LABEL[1]}
          </a>
          {messages.INFO_LABEL[2]}
          <AccentColorPickerButton
            accentColor={accentColor}
            onSetAccentColor={onSetAccentColor}
          >
            {messages.INFO_LABEL[3]}
          </AccentColorPickerButton>
          {messages.INFO_LABEL[4]}
          <a
            href="https://en.wikipedia.org/wiki/Rennes"
            target="_blank"
            rel="noreferrer"
          >
            {messages.INFO_LABEL[5]}
          </a>
        </div>
      </footer>
    );
  }
}

function AccentColorPickerButton({ accentColor, onSetAccentColor, children }) {
  const colorInputRef = useRef(null);

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
      <span className="icon">{children}</span>
      <a
        href="https://en.wikipedia.org/wiki/Rennes"
        target="_blank"
        rel="noreferrer"
      ></a>
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
