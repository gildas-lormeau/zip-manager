import "./styles/OptionsDialog.css";
import Dialog from "./Dialog.js";

import { useEffect, useState } from "react";

function OptionsDialog({
  data,
  onSetOptions,
  onResetOptions,
  onClose,
  messages
}) {
  const [hideDownloadManager, setHideDownloadManager] = useState(false);
  const [hideInfobar, setHideinfobar] = useState(false);
  const [keepOrder, setKeepOrder] = useState(false);
  const [bufferedWrite, setBufferedWrite] = useState(false);
  const [maxWorkers, setMaxWorkers] = useState("0");
  const [chunkSize, setChunkSize] = useState("0");

  function handleChangeHideDownloadManager(event) {
    setHideDownloadManager(event.target.checked);
  }

  function handleChangeHideInfobar(event) {
    setHideinfobar(event.target.checked);
  }

  function handleChangeKeepOrder(event) {
    setKeepOrder(event.target.checked);
  }

  function handleChangeBufferedWrite(event) {
    setBufferedWrite(event.target.checked);
  }

  function handleChangeMaxWorkers(event) {
    setMaxWorkers(event.target.value);
  }

  function handleChangeChunkSize(event) {
    setChunkSize(event.target.value);
  }

  function handleSubmit() {
    onSetOptions({
      hideDownloadManager,
      hideInfobar,
      keepOrder,
      bufferedWrite,
      maxWorkers: Number(maxWorkers),
      chunkSize: Number(chunkSize) * 1024
    });
  }

  function updateData() {
    if (data) {
      const {
        hideDownloadManager,
        hideInfobar,
        keepOrder,
        bufferedWrite,
        maxWorkers,
        chunkSize
      } = data;
      setHideDownloadManager(hideDownloadManager);
      setHideinfobar(hideInfobar);
      setKeepOrder(keepOrder);
      setBufferedWrite(bufferedWrite);
      setMaxWorkers(maxWorkers);
      setChunkSize(chunkSize / 1024);
    }
  }

  useEffect(updateData, [data]);
  return (
    <Dialog
      className="options-dialog"
      data={data}
      title={messages.OPTIONS_TITLE}
      onOpen={updateData}
      onSubmit={handleSubmit}
      onReset={onResetOptions}
      onClose={onClose}
      resetLabel={messages.DIALOG_RESET_BUTTON_LABEL}
      cancelLabel={messages.DIALOG_CANCEL_BUTTON_LABEL}
      submitLabel={messages.OPTIONS_DIALOG_BUTTON_LABEL}
    >
      <label>
        {messages.OPTIONS_HIDE_DOWNLOAD_MANAGER}
        <input
          checked={hideDownloadManager}
          type="checkbox"
          onChange={handleChangeHideDownloadManager}
        />
      </label>
      <label>
        {messages.OPTIONS_HIDE_INFOBAR}
        <input
          checked={hideInfobar}
          type="checkbox"
          onChange={handleChangeHideInfobar}
        />
      </label>
      <label>
        {messages.OPTIONS_BUFFERED_WRITE_LABEL}
        <input
          checked={bufferedWrite}
          type="checkbox"
          onChange={handleChangeBufferedWrite}
        />
      </label>
      <label>
        {messages.OPTIONS_MAX_WORKERS_LABEL}
        <input
          value={maxWorkers}
          type="number"
          required
          disabled={!bufferedWrite}
          min={1}
          onChange={handleChangeMaxWorkers}
        />
      </label>
      <label>
        {messages.OPTIONS_KEEP_ORDER_LABEL}
        <input
          checked={keepOrder}
          type="checkbox"
          onChange={handleChangeKeepOrder}
        />
      </label>
      <label>
        {messages.OPTIONS_CHUNK_SIZE_LABEL}
        <input
          value={chunkSize}
          type="number"
          required
          min={1}
          onChange={handleChangeChunkSize}
        />
      </label>
    </Dialog>
  );
}

export default OptionsDialog;
