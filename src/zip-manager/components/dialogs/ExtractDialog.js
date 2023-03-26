import { useEffect, useRef, useState } from "react";

function ExtractDialog({ extractDialog, onExtract, onClose, messages }) {
  const dialogRef = useRef(null);
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

  function handleSubmit() {
    onExtract({ filename, password });
  }

  function handleReset() {
    dialogRef.current.close();
  }

  function handleClose() {
    filenameTextSelected.current = false;
    setFilename("");
    setPassword("");
    onClose();
  }

  useEffect(() => {
    if (extractDialog) {
      const { opened, filename, password } = extractDialog;
      if (!dialogRef.current.open && opened) {
        setFilename(filename);
        setPassword(password);
        dialogRef.current.showModal();
      }
    }
  }, [extractDialog]);
  useEffect(() => {
    if (!filenameTextSelected.current && filename) {
      filenameTextSelected.current = true;
      filenameInputRef.current.select();
    }
  }, [filename]);
  return (
    <dialog ref={dialogRef} onClose={handleClose}>
      <form method="dialog" onSubmit={handleSubmit} onReset={handleReset}>
        <div>{messages.EXTRACT_TITLE}</div>
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
              display: extractDialog?.passwordDisabled ? "none" : "inherit"
            }}
          >
            {messages.EXTRACT_PASSWORD_LABEL}
            <input
              type="password"
              autoComplete="off"
              value={password}
              required={!extractDialog?.passwordDisabled}
              onChange={handleChangePassword}
            ></input>
          </label>
        </p>
        <div className="button-bar">
          <button type="reset">{messages.DIALOG_CANCEL_BUTTON_LABEL}</button>
          <button type="submit">{messages.EXTRACT_DIALOG_BUTTON_LABEL}</button>
        </div>
      </form>
    </dialog>
  );
}

export default ExtractDialog;
