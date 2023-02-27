import "./styles/DownloadManager.css";

function DownloadManager({
  downloads,
  downloaderRef,
  onAbortDownload,
  constants,
  messages
}) {
  return (
    <div className="downloads">
      <ol>
        {downloads.map((download) => (
          <li key={download.id}>
            <DownloadEntry
              download={download}
              onAbortDownload={onAbortDownload}
              constants={constants}
              messages={messages}
            />
          </li>
        ))}
      </ol>
      <a hidden ref={downloaderRef}></a>
    </div>
  );
}

function DownloadEntry({ download, onAbortDownload, constants, messages }) {
  return (
    <>
      <DownloadEntryInfo
        download={download}
        onAbortDownload={onAbortDownload}
        constants={constants}
        messages={messages}
      />
      <DownloadEntryProgress download={download} />
    </>
  );
}

function DownloadEntryInfo({ download, onAbortDownload, constants, messages }) {
  return (
    <div className="download-entry">
      <span className="list-item-name download-entry-name">
        {download.name}
      </span>
      <DeleteDownloadEntryButton
        download={download}
        onAbortDownload={onAbortDownload}
        constants={constants}
        messages={messages}
      />
    </div>
  );
}

function DeleteDownloadEntryButton({
  download,
  onAbortDownload,
  constants,
  messages
}) {
  function handleClick() {
    onAbortDownload(download);
  }

  function handleKeyUp(event) {
    if (event.key === constants.ENTER_KEY) {
      handleClick();
    }
  }

  return (
    <span
      className="list-item-button"
      onClick={handleClick}
      onKeyUp={handleKeyUp}
      tabIndex={0}
    >
      {messages.DELETE_DOWNLOAD_ENTRY_BUTTON_LABEL}
    </span>
  );
}

function DownloadEntryProgress({ download }) {
  return <progress value={download.progressValue} max={download.progressMax} />;
}

export default DownloadManager;
