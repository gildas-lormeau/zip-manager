import "./styles/InfoBar.css";

import { useEffect, useRef, useState } from "react";

function InfoBar({
  hidden,
  accentColor,
  musicFrequencyData,
  playMusic,
  stopMusic,
  onSetAccentColor,
  onSetMusicFile,
  synthRef,
  util,
  messages
}) {
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
          <MusicPlayerButton
            playMusic={playMusic}
            stopMusic={stopMusic}
            onSetMusicFile={onSetMusicFile}
            synthRef={synthRef}
            util={util}
            messages={messages}
          />
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
          <MusicVisualizer
            musicFrequencyData={musicFrequencyData}
            accentColor={accentColor}
            onSetMusicFile={onSetMusicFile}
            synthRef={synthRef}
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
  onSetMusicFile,
  synthRef,
  util,
  messages
}) {
  const ICON_CLASSNAME = "icon icon-music-player";
  const PAUSED_CLASSNAME = " paused";
  const [iconPlayer, setIconPlayer] = useState(messages.PAUSED_MUSIC_ICON);
  const [className, setClassName] = useState(ICON_CLASSNAME + PAUSED_CLASSNAME);
  const fileInputRef = useRef(null);

  function handlePlayButtonClick() {
    if (synthRef.current) {
      stopMusic();
      setClassName(ICON_CLASSNAME + PAUSED_CLASSNAME);
      setIconPlayer(messages.PAUSED_MUSIC_ICON);
    } else {
      playMusic();
      setClassName(ICON_CLASSNAME);
      setIconPlayer(messages.PLAYING_MUSIC_ICON);
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
      const items = Array.from(event.dataTransfer.items);
      onSetMusicFile(
        await (await util.getFilesystemHandles(items))[0].getFile()
      );
    }
  }

  function handleChange({ target }) {
    const files = Array.from(target.files);
    if (files.length) {
      onSetMusicFile(files[0]);
    }
  }

  function handleClick() {
    async function showOpenFilePicker() {
      if (util.openFilePickerSupported()) {
        const files = await util.showOpenFilePicker();
        onSetMusicFile(files[0]);
      } else {
        util.dispatchClick(fileInputRef.current);
      }
    }

    showOpenFilePicker();
  }

  return (
    <>
      <span
        className={className}
        onClick={handlePlayButtonClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onDoubleClick={handleClick}
        tabIndex={0}
      >
        {iconPlayer}
      </span>
      <input onChange={handleChange} ref={fileInputRef} type="file" hidden />
    </>
  );
}

function MusicVisualizer({ musicFrequencyData, accentColor, synthRef }) {
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  if (canvasRef.current) {
    if (!audioContextRef.current) {
      audioContextRef.current = canvasRef.current.getContext("2d");
      setColor();
    }
    const context = audioContextRef.current;
    context.clearRect(0, 0, 256, 256);
    if (synthRef.current) {
      musicFrequencyData.forEach((byteTimeDomain, index) => {
        context.fillRect(index, 255, index + 1, 32 - byteTimeDomain);
      });
    }
  }

  function setColor() {
    const context = audioContextRef.current;
    const gradient = context.createLinearGradient(0, 0, 0, 256);
    gradient.addColorStop(0.8, accentColor);
    gradient.addColorStop(1, "transparent");
    context.fillStyle = gradient;
  }

  useEffect(() => {
    if (audioContextRef.current) {
      setColor();
    }
  }, [accentColor]);
  return <canvas ref={canvasRef} width={256} height={256}></canvas>;
}

export default InfoBar;
