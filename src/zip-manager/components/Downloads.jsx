import "./styles/Downloads.css";

function Downloads({
  hidden,
  downloads,
  onAbortDownload,
  i18n,
  constants,
  messages
}) {
  if (hidden) {
    return;
  } else {
    return (
      <div
        className="downloads scrollable"
        aria-label={messages.DOWNLOADS_LABEL}
        role="navigation"
      >
        <ol>
          {downloads.queue.map((download) => (
            <li key={download.id}>
              <DownloadEntry
                download={download}
                onAbortDownload={onAbortDownload}
                i18n={i18n}
                constants={constants}
                messages={messages}
              />
            </li>
          ))}
        </ol>
      </div>
    );
  }
}

function DownloadEntry({
  download,
  onAbortDownload,
  i18n,
  constants,
  messages
}) {
  return (
    <>
      <DownloadEntryInfo
        download={download}
        onAbortDownload={onAbortDownload}
        constants={constants}
        messages={messages}
      />
      <DownloadEntryProgress download={download} i18n={i18n} />
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
      className="list-item-button download-entry-abort-button"
      role="button"
      onClick={handleClick}
      onKeyUp={handleKeyUp}
      tabIndex={0}
    >
      {messages.ABORT_DOWNLOAD_BUTTON_LABEL}
    </span>
  );
}

function DownloadEntryProgress({ download, i18n }) {
  return (
    <progress
      value={
        download.progressValue && Math.floor(download.progressValue / 1000)
      }
      max={download.progressMax && Math.floor(download.progressMax / 1000)}
      title={
        download.progressValue &&
        i18n.formatPercentValue(
          (100 * download.progressValue) / download.progressMax
        )
      }
    />
  );
}

export default Downloads;
