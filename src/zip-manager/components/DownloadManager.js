import "./styles/DownloadManager.css";

function DownloadManager({
  downloads,
  downloaderRef,
  onDeleteDownloadEntry,
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
              onDeleteDownloadEntry={onDeleteDownloadEntry}
              constants={constants}
              messages={messages}
            />
          </li>
        ))}
      </ol>
      <a hidden ref={downloaderRef} />
    </div>
  );
}

function DownloadEntry({
  download,
  onDeleteDownloadEntry,
  constants,
  messages
}) {
  return (
    <>
      <DownloadEntryInfo
        download={download}
        onDeleteDownloadEntry={onDeleteDownloadEntry}
        constants={constants}
        messages={messages}
      />
      <DownloadEntryProgress download={download} />
    </>
  );
}

function DownloadEntryInfo({
  download,
  onDeleteDownloadEntry,
  constants,
  messages
}) {
  return (
    <div className="download-entry">
      <span className="list-item-name download-entry-name">
        {download.name}
      </span>
      <DeleteDownloadEntryButton
        download={download}
        onDeleteDownloadEntry={onDeleteDownloadEntry}
        constants={constants}
        messages={messages}
      />
    </div>
  );
}

function DeleteDownloadEntryButton({
  download,
  onDeleteDownloadEntry,
  constants,
  messages
}) {
  function handleClick() {
    onDeleteDownloadEntry(download);
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
      {messages.CLOSE_BUTTON_LABEL}
    </span>
  );
}

function DownloadEntryProgress({ download }) {
  return <progress value={download.progressValue} max={download.progressMax} />;
}

export default DownloadManager;
