import { useEffect, useRef, useState } from "react";

function ExtractDialog({
  open,
  filename,
  password,
  passwordDisabled,
  onExtract,
  onClose,
  messages
}) {
  const dialogRef = useRef(null);
  const filenameInputRef = useRef(null);
  const filenameTextSelected = useRef(false);
  const [filenameValue, setFilenameValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");

  function handleChangeFilename(event) {
    setFilenameValue(event.target.value);
  }

  function handleChangePassword(event) {
    setPasswordValue(event.target.value);
  }

  function handleSubmit() {
    onExtract({ filename: filenameValue, password: passwordValue });
  }

  function handleReset() {
    dialogRef.current.close();
  }

  function handleClose() {
    filenameTextSelected.current = false;
    onClose();
  }

  useEffect(() => {
    if (!dialogRef.current.open && open) {
      setFilenameValue(filename);
      setPasswordValue(password);
      dialogRef.current.showModal();
    }
  }, [open, filename, password]);
  useEffect(() => {
    if (!filenameTextSelected.current && filenameValue) {
      filenameTextSelected.current = true;
      filenameInputRef.current.select();
    }
  }, [filenameValue]);
  return (
    <>
      <div className="dialog-backdrop" hidden={!open}></div>
      <dialog ref={dialogRef} onClose={handleClose}>
        <form method="dialog" onSubmit={handleSubmit} onReset={handleReset}>
          <div>{messages.EXTRACT_TITLE}</div>
          <p>
            <label>
              {messages.EXTRACT_FILENAME_LABEL}
              <input
                value={filenameValue}
                required
                onChange={handleChangeFilename}
                ref={filenameInputRef}
              ></input>
            </label>
            <label style={{ display: passwordDisabled ? "none" : "inherit" }}>
              {messages.EXTRACT_PASSWORD_LABEL}
              <input
                type="password"
                autoComplete="off"
                value={passwordValue}
                required={!passwordDisabled}
                onChange={handleChangePassword}
              ></input>
            </label>
          </p>
          <div className="button-bar">
            <button type="reset">{messages.DIALOG_CANCEL_BUTTON_LABEL}</button>
            <button type="submit">
              {messages.EXTRACT_DIALOG_BUTTON_LABEL}
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}

export default ExtractDialog;
