import { useEffect, useRef, useState } from "react";

function ExportZipDialog({ exportZipDialog, onExportZip, onClose, messages }) {
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
    onExportZip({ filename, password });
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
    if (exportZipDialog) {
      const { opened, filename, password } = exportZipDialog;
      if (!dialogRef.current.open && opened) {
        setFilename(filename);
        setPassword(password);
        dialogRef.current.showModal();
        if (filename) {
          filenameInputRef.current.select();
        }
      }
    }
  }, [exportZipDialog]);
  useEffect(() => {
    if (!filenameTextSelected.current && filename) {
      filenameTextSelected.current = true;
      filenameInputRef.current.select();
    }
  }, [filename]);
  return (
    <dialog ref={dialogRef} onClose={handleClose}>
      <form method="dialog" onSubmit={handleSubmit} onReset={handleReset}>
        <div>{messages.EXPORT_ZIP_TITLE}</div>
        <p>
          <label>
            {messages.EXPORT_ZIP_FILENAME_LABEL}
            <input
              value={filename}
              required
              onChange={handleChangeFilename}
              ref={filenameInputRef}
            ></input>
          </label>
          <label>
            {messages.EXPORT_ZIP_PASSWORD_LABEL}
            <input
              type="password"
              autoComplete="off"
              value={password}
              onChange={handleChangePassword}
            ></input>
          </label>
        </p>
        <div className="button-bar">
          <button type="reset">{messages.DIALOG_CANCEL_BUTTON_LABEL}</button>
          <button type="submit">
            {messages.EXPORT_ZIP_DIALOG_BUTTON_LABEL}
          </button>
        </div>
      </form>
    </dialog>
  );
}

export default ExportZipDialog;
