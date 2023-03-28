import Dialog from "./Dialog";

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
      title={messages.EXPORT_ZIP_TITLE}
      onOpen={onOpen}
      onSubmit={handleSubmit}
      onClose={handleClose}
    >
      <p>
        <label>
          {messages.EXTRACT_FILENAME_LABEL}
          <input
            value={filename}
            required
            onChange={handleChangeFilename}
            ref={filenameInputRef}
          ></input>
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
          ></input>
        </label>
      </p>
      <div className="button-bar">
        <button type="reset">{messages.DIALOG_CANCEL_BUTTON_LABEL}</button>
        <button type="submit">{messages.EXTRACT_DIALOG_BUTTON_LABEL}</button>
      </div>
    </Dialog>
  );
}

export default ExtractDialog;
