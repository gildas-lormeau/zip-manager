import { useEffect, useRef, useState } from "react";

function RenameDialog({ renameDialog, onRename, onClose, messages }) {
  const dialogRef = useRef(null);
  const filenameInputRef = useRef(null);
  const filenameTextSelected = useRef(false);
  const [filenameValue, setFilenameValue] = useState("");

  function handleChangeFilename(event) {
    setFilenameValue(event.target.value);
  }

  function handleSubmit() {
    onRename({ filename: filenameValue });
  }

  function handleReset() {
    dialogRef.current.close();
  }

  function handleClose() {
    filenameTextSelected.current = false;
    setFilenameValue("");
    onClose();
  }

  useEffect(() => {
    if (renameDialog) {
      const { opened, filename } = renameDialog;
      if (!dialogRef.current.open && opened) {
        setFilenameValue(filename);
        dialogRef.current.showModal();
        if (filename) {
          filenameInputRef.current.select();
        }
      }
    }
  }, [renameDialog]);
  useEffect(() => {
    if (!filenameTextSelected.current && filenameValue) {
      filenameTextSelected.current = true;
      filenameInputRef.current.select();
    }
  }, [filenameValue]);
  return (
    <dialog ref={dialogRef} onClose={handleClose}>
      <form method="dialog" onSubmit={handleSubmit} onReset={handleReset}>
        <div>{messages.RENAME_TITLE}</div>
        <p>
          <label>
            {messages.RENAME_FILENAME_LABEL}
            <input
              value={filenameValue}
              required
              onChange={handleChangeFilename}
              ref={filenameInputRef}
            ></input>
          </label>
        </p>
        <div className="button-bar">
          <button type="reset">{messages.DIALOG_CANCEL_BUTTON_LABEL}</button>
          <button type="submit">{messages.RENAME_DIALOG_BUTTON_LABEL}</button>
        </div>
      </form>
    </dialog>
  );
}

export default RenameDialog;
