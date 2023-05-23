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
  constants,
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
              skin={theme.skin}
              playMusic={playMusic}
              stopMusic={stopMusic}
              musicPlayerActive={musicPlayerActive}
              constants={constants}
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
            skin={theme.skin}
            musicData={musicData}
            accentColor={theme.accentColor}
            musicPlayerActive={musicPlayerActive}
            constants={constants}
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
  skin,
  playMusic,
  stopMusic,
  musicPlayerActive,
  constants,
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
      playMusic({ fftSize: skin === constants.OPTIONS_DOS_SKIN ? 32 : 128 });
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

function MusicVisualizer({
  skin,
  musicData,
  accentColor,
  musicPlayerActive,
  constants
}) {
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
      const barWidth = skin === constants.OPTIONS_DOS_SKIN ? 8 : 2;
      musicData.frequencyData.forEach((byteTimeDomain, index) => {
        context.fillRect(index * barWidth, 256, barWidth, 32 - byteTimeDomain);
        context.fillRect(
          128 - index * barWidth - barWidth,
          256,
          barWidth,
          32 - byteTimeDomain
        );
      });
    }
  }

  function updateColor() {
    const context = audioContextRef.current;
    const gradient = context.createLinearGradient(0, 0, 0, 256);
    gradient.addColorStop(0, accentColor);
    gradient.addColorStop(0.7, accentColor);
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
