import "./styles/DownloadManager.css";

function DownloadManager({
  hidden,
  downloads,
  onAbortDownload,
  i18nService,
  constants,
  messages
}) {
  if (hidden) {
    return;
  } else {
    return (
      <div className="downloads" aria-label="Downloads" role="navigation">
        <ol>
          {downloads.queue.map((download) => (
            <li key={download.id}>
              <DownloadEntry
                download={download}
                onAbortDownload={onAbortDownload}
                i18nService={i18nService}
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
  i18nService,
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
      <DownloadEntryProgress download={download} i18nService={i18nService} />
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

function DownloadEntryProgress({ download, i18nService }) {
  return (
    <progress
      value={
        download.progressValue && Math.floor(download.progressValue / 1000)
      }
      max={download.progressMax && Math.floor(download.progressMax / 1000)}
      title={
        download.progressValue &&
        i18nService.formatPercentValue(
          (100 * download.progressValue) / download.progressMax
        )
      }
    />
  );
}

export default DownloadManager;
