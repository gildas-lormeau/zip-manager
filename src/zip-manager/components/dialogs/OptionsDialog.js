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
  const [keepOrder, setKeepOrder] = useState(false);
  const [bufferedWrite, setBufferedWrite] = useState(false);
  const [maxWorkers, setMaxWorkers] = useState(0);
  const [chunkSize, setChunkSize] = useState(0);

  function handleChangeKeepOrder(event) {
    setKeepOrder(event.target.checked);
  }

  function handleChangeBufferedWrite(event) {
    setBufferedWrite(event.target.checked);
  }

  function handleChangeMaxWorkers(event) {
    setMaxWorkers(event.target.valueAsNumber);
  }

  function handleChangeChunkSize(event) {
    setChunkSize(event.target.valueAsNumber);
  }

  function onOpen() {
    const { keepOrder, bufferedWrite, maxWorkers, chunkSize } = data;
    setKeepOrder(keepOrder);
    setBufferedWrite(bufferedWrite);
    setMaxWorkers(maxWorkers);
    setChunkSize(chunkSize);
  }

  function handleSubmit() {
    onSetOptions({ keepOrder, bufferedWrite, maxWorkers, chunkSize });
  }

  useEffect(() => {
    if (data) {
      const { keepOrder, bufferedWrite, maxWorkers, chunkSize } = data;
      setKeepOrder(keepOrder);
      setBufferedWrite(bufferedWrite);
      setMaxWorkers(maxWorkers);
      setChunkSize(chunkSize);
    }
  }, [data]);
  return (
    <Dialog
      className="options-dialog"
      data={data}
      title={messages.OPTIONS_TITLE}
      onOpen={onOpen}
      onSubmit={handleSubmit}
      onReset={onResetOptions}
      onClose={onClose}
      resetLabel={messages.DIALOG_RESET_BUTTON_LABEL}
      cancelLabel={messages.DIALOG_CANCEL_BUTTON_LABEL}
      submitLabel={messages.OPTIONS_DIALOG_BUTTON_LABEL}
    >
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
          min={4}
          onChange={handleChangeChunkSize}
        />
      </label>
    </Dialog>
  );
}

export default OptionsDialog;
