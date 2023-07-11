import Dialog from "./Dialog.jsx";

import { useEffect, useRef, useState } from "react";

function ExtractDialog({ data, onExtract, onClose, messages }) {
  const filenameInputRef = useRef(null);
  const filenameTextSelected = useRef(false);
  const [filename, setFilename] = useState("");

  function handleChangeFilename(event) {
    setFilename(event.target.value);
  }

  function onOpen() {
    setFilename(data.filename);
  }

  function handleSubmit() {
    onExtract({ filename, entries: data.entries });
  }

  function handleClose() {
    setFilename("");
    filenameTextSelected.current = false;
    onClose();
  }

  useEffect(() => {
    if (!filenameTextSelected.current && filename) {
      filenameTextSelected.current = true;
      filenameInputRef.current.select();
    }
  }, [filename]);
  return (
    <Dialog
      data={data}
      title={messages.EXTRACT_TITLE}
      cancelLabel={messages.DIALOG_CANCEL_BUTTON_LABEL}
      submitLabel={messages.EXTRACT_DIALOG_BUTTON_LABEL}
      onOpen={onOpen}
      onClose={handleClose}
      onSubmit={handleSubmit}
    >
      <label>
        {messages.EXTRACT_FILENAME_LABEL}
        <input
          spellCheck="false"
          type="text"
          value={filename}
          required
          onChange={handleChangeFilename}
          ref={filenameInputRef}
        />
      </label>
    </Dialog>
  );
}

export default ExtractDialog;
