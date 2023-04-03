import Dialog from "./Dialog.js";

import { useEffect, useRef, useState } from "react";

function ExtractDialog({ data, onExtract, onClose, messages }) {
  const filenameInputRef = useRef(null);
  const filenameTextSelected = useRef(false);
  const [filename, setFilename] = useState("");
  const [password, setPassword] = useState("");

  function handleChangeFilename(event) {
    setFilename(event.target.value);
  }

  function handleChangePassword(event) {
    setPassword(event.target.value);
  }

  function onOpen() {
    const { filename, password } = data;
    setFilename(filename);
    setPassword(password);
  }

  function handleSubmit() {
    onExtract({ filename, password });
  }

  function handleClose() {
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
      onSubmit={handleSubmit}
      onClose={handleClose}
    >
      <label>
        {messages.EXTRACT_FILENAME_LABEL}
        <input
          value={filename}
          required
          onChange={handleChangeFilename}
          ref={filenameInputRef}
        />
      </label>
      <label
        style={{
          display: data?.passwordDisabled ? "none" : "inherit"
        }}
      >
        {messages.EXTRACT_PASSWORD_LABEL}
        <input
          type="password"
          autoComplete="off"
          value={password}
          required={!data?.passwordDisabled}
          onChange={handleChangePassword}
        />
      </label>
    </Dialog>
  );
}

export default ExtractDialog;
