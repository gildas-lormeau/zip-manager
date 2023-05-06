import "./styles/InfoBar.css";

import { useEffect, useRef, useState } from "react";

function InfoBar({
  hidden,
  accentColor,
  musicFrequencyData,
  playMusic,
  stopMusic,
  onSetAccentColor,
  onPlayMusicFile,
  musicPlayerActive,
  messages
}) {
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
              onPlayMusicFile={onPlayMusicFile}
              musicPlayerActive={musicPlayerActive}
              messages={messages}
            />
          </span>
          <span className="label">
            {messages.INFO_LABEL[3]}
            <AccentColorPickerButton
              accentColor={accentColor}
              onSetAccentColor={onSetAccentColor}
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
            musicFrequencyData={musicFrequencyData}
            accentColor={accentColor}
            onPlayMusicFile={onPlayMusicFile}
            musicPlayerActive={musicPlayerActive}
          />
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
      <input
        type="color"
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
  onPlayMusicFile,
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

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDragLeave(event) {
    event.preventDefault();
  }

  async function handleDrop(event) {
    if (event.dataTransfer.items) {
      event.preventDefault();
      onPlayMusicFile(event.dataTransfer.items);
    }
  }

  return (
    <>
      <span
        className={iconPlayer.className}
        onClick={handlePlayButtonClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        tabIndex={0}
      >
        {iconPlayer.label}
      </span>
    </>
  );
}

function MusicVisualizer({
  musicFrequencyData,
  accentColor,
  musicPlayerActive
}) {
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  if (canvasRef.current) {
    if (!audioContextRef.current) {
      audioContextRef.current = canvasRef.current.getContext("2d");
      setColor();
    }
    const context = audioContextRef.current;
    context.clearRect(0, 0, 256, 256);
    if (musicPlayerActive) {
      musicFrequencyData.forEach((byteTimeDomain, index) => {
        context.fillRect(index, 256, 2, 32 - byteTimeDomain);
        context.fillRect(128 - index - 1, 256, 2, 32 - byteTimeDomain);
      });
    }
  }

  function setColor() {
    const context = audioContextRef.current;
    const gradient = context.createLinearGradient(0, 0, 0, 256);
    gradient.addColorStop(0, accentColor);
    gradient.addColorStop(0.8, accentColor);
    gradient.addColorStop(0.9, "transparent");
    gradient.addColorStop(1, "transparent");
    context.fillStyle = gradient;
  }

  useEffect(() => {
    if (audioContextRef.current) {
      setColor();
    }
  }, [accentColor]);
  return <canvas ref={canvasRef} width={128} height={256}></canvas>;
}

export default InfoBar;
