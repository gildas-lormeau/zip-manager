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
  const PLAYER_ICON_CLASSNAME = "icon icon-music-player";
  const PLAYER_PAUSED_CLASSNAME = " paused";
  const PLAYER_PAUSED = {
    label: messages.PAUSED_MUSIC_ICON,
    className: PLAYER_ICON_CLASSNAME + PLAYER_PAUSED_CLASSNAME
  };
  const PLAYER_ACTIVE = {
    label: messages.PLAYING_MUSIC_ICON,
    className: PLAYER_ICON_CLASSNAME
  };

  const [iconPlayer, setIconPlayer] = useState(PLAYER_PAUSED);

  function handleChangeAccentColor(accentColor) {
    onSetTheme({ accentColor });
  }

  function handleChangeIconPlayer(paused) {
    const iconData = paused ? PLAYER_PAUSED : PLAYER_ACTIVE;
    setIconPlayer(iconData);
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
              <svg
                width="24px"
                height="24px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g>
                  <path
                    id="Vector"
                    d="M10.0002 5H8.2002C7.08009 5 6.51962 5 6.0918 5.21799C5.71547 5.40973 5.40973 5.71547 5.21799 6.0918C5 6.51962 5 7.08009 5 8.2002V15.8002C5 16.9203 5 17.4801 5.21799 17.9079C5.40973 18.2842 5.71547 18.5905 6.0918 18.7822C6.5192 19 7.07899 19 8.19691 19H15.8031C16.921 19 17.48 19 17.9074 18.7822C18.2837 18.5905 18.5905 18.2839 18.7822 17.9076C19 17.4802 19 16.921 19 15.8031V14M20 9V4M20 4H15M20 4L13 11"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              </svg>
            </a>
            {messages.INFO_LABEL[1]}
          </span>
          <span>
            <MusicPlayerButton
              playMusic={playMusic}
              stopMusic={stopMusic}
              musicPlayerActive={musicPlayerActive}
              iconPlayer={iconPlayer}
              onSetIconPlayer={handleChangeIconPlayer}
            />
          </span>
          <span className="label">
            {messages.INFO_LABEL[2]}
            <AccentColorPickerButton
              accentColor={theme.accentColor}
              onSetAccentColor={handleChangeAccentColor}
              messages={messages}
            >
              {messages.INFO_LABEL[3]}
            </AccentColorPickerButton>
            {messages.INFO_LABEL[4]}
            <a
              href={messages.CITY_URL}
              target="_blank"
              rel="noreferrer"
            >
              {messages.INFO_LABEL[5]}
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
  playMusic,
  stopMusic,
  musicPlayerActive,
  iconPlayer,
  onSetIconPlayer
}) {
  function handlePlayButtonClick() {
    if (musicPlayerActive) {
      stopMusic();
      onSetIconPlayer(true);
    } else {
      playMusic();
      onSetIconPlayer();
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
  const CANVAS_WIDTH = 128;
  const CANVAS_HEIGTH = 64;
  const CANVAS_BLOCK_OFFSET = CANVAS_HEIGTH / 8;
  const MAX_FFT_VALUE = 256;

  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  let barWidth;
  updateBarWidth();
  if (canvasRef.current) {
    if (!audioContextRef.current) {
      audioContextRef.current = canvasRef.current.getContext("2d");
      updateColor();
      updateBarWidth();
    }
    const context = audioContextRef.current;
    context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGTH);
    if (musicPlayerActive) {
      musicData.frequencyData.forEach((byteTimeDomain, index) => {
        const barHeight =
          (CANVAS_BLOCK_OFFSET - byteTimeDomain) /
          (MAX_FFT_VALUE / CANVAS_HEIGTH);
        context.fillRect(index * barWidth, CANVAS_HEIGTH, barWidth, barHeight);
        context.fillRect(
          CANVAS_WIDTH - index * barWidth - barWidth,
          CANVAS_HEIGTH,
          barWidth,
          barHeight
        );
      });
    }
  }

  function updateColor() {
    const context = audioContextRef.current;
    const gradient = context.createLinearGradient(0, 0, 0, CANVAS_HEIGTH);
    gradient.addColorStop(0, accentColor);
    gradient.addColorStop(0.7, accentColor);
    gradient.addColorStop(1, "transparent");
    context.fillStyle = gradient;
  }

  function updateBarWidth() {
    if (skin) {
      barWidth = CANVAS_WIDTH / (constants.FFT_RESOLUTIONS[skin] / 2);
    }
  }

  useEffect(() => {
    if (audioContextRef.current) {
      updateColor();
    }
  }, [accentColor]);
  useEffect(updateBarWidth, [skin]);
  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGTH}
    ></canvas>
  );
}

export default InfoBar;
