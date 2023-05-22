import "./styles/InfoBar.css";

import { useEffect, useRef, useState } from "react";

function InfoBar({
  hidden,
  theme,
  musicData,
  playMusic,
  stopMusic,
  onSetTheme,
  musicPlayerActive,
  messages
}) {
  function handleChangeAccentColor(accentColor) {
    onSetTheme({ accentColor });
  }

  if (hidden) {
    return;
  } else {
    return (
      <footer className="info-bar">
        <div
          className={
            "source-link" + (musicPlayerActive ? " player-active" : "")
          }
        >
          <span className="label">
            {messages.INFO_LABEL[0]}
            <a
              href="https://github.com/gildas-lormeau/zip-manager"
              target="_blank"
              rel="noreferrer"
            >
              {messages.INFO_LABEL[1]}
            </a>
            {messages.INFO_LABEL[2]}
          </span>
          <span>
            <MusicPlayerButton
              playMusic={playMusic}
              stopMusic={stopMusic}
              musicPlayerActive={musicPlayerActive}
              messages={messages}
            />
          </span>
          <span className="label">
            {messages.INFO_LABEL[3]}
            <AccentColorPickerButton
              accentColor={theme.accentColor}
              onSetAccentColor={handleChangeAccentColor}
              messages={messages}
            >
              {messages.INFO_LABEL[4]}
            </AccentColorPickerButton>
            {messages.INFO_LABEL[5]}
            <a
              href="https://en.wikipedia.org/wiki/Rennes"
              target="_blank"
              rel="noreferrer"
            >
              {messages.INFO_LABEL[6]}
            </a>
          </span>
          <MusicVisualizer
            musicData={musicData}
            accentColor={theme.accentColor}
            musicPlayerActive={musicPlayerActive}
          />
        </div>
      </footer>
    );
  }
}

function AccentColorPickerButton({
  accentColor,
  onSetAccentColor,
  children,
  messages
}) {
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
      <input
        type="color"
        aria-label={messages.ACCENT_COLOR_LABEL}
        onChange={handleChange}
        ref={colorInputRef}
        tabIndex={-1}
      />
    </>
  );
}

function MusicPlayerButton({
  playMusic,
  stopMusic,
  musicPlayerActive,
  messages
}) {
  const ICON_CLASSNAME = "icon icon-music-player";
  const PAUSED_CLASSNAME = " paused";
  const [iconPlayer, setIconPlayer] = useState({
    label: messages.PAUSED_MUSIC_ICON,
    className: ICON_CLASSNAME + PAUSED_CLASSNAME
  });

  function handlePlayButtonClick() {
    if (musicPlayerActive) {
      stopMusic();
      setIconPlayer({
        label: messages.PAUSED_MUSIC_ICON,
        className: ICON_CLASSNAME + PAUSED_CLASSNAME
      });
    } else {
      playMusic();
      setIconPlayer({
        label: messages.PLAYING_MUSIC_ICON,
        className: ICON_CLASSNAME
      });
    }
  }

  return (
    <>
      <span
        className={iconPlayer.className}
        onClick={handlePlayButtonClick}
        tabIndex={0}
      >
        {iconPlayer.label}
      </span>
    </>
  );
}

function MusicVisualizer({ musicData, accentColor, musicPlayerActive }) {
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  if (canvasRef.current) {
    if (!audioContextRef.current) {
      audioContextRef.current = canvasRef.current.getContext("2d");
      updateColor();
    }
    const context = audioContextRef.current;
    context.clearRect(0, 0, 256, 256);
    if (musicPlayerActive) {
      musicData.frequencyData.forEach((byteTimeDomain, index) => {
        context.fillRect(index, 256, 2, 32 - byteTimeDomain);
        context.fillRect(128 - index - 2, 256, 2, 32 - byteTimeDomain);
      });
    }
  }

  function updateColor() {
    const context = audioContextRef.current;
    const gradient = context.createLinearGradient(0, 0, 0, 256);
    gradient.addColorStop(0, accentColor);
    gradient.addColorStop(0.75, accentColor);
    gradient.addColorStop(0.9, "transparent");
    gradient.addColorStop(1, "transparent");
    context.fillStyle = gradient;
  }

  useEffect(() => {
    if (audioContextRef.current) {
      updateColor();
    }
  }, [accentColor]);
  return <canvas ref={canvasRef} width={128} height={256}></canvas>;
}

export default InfoBar;
