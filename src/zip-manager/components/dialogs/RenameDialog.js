import { useEffect, useRef, useState } from "react";

function RenameDialog({ renameDialog, onRename, onClose, messages }) {
  const dialogRef = useRef(null);
  const filenameInputRef = useRef(null);
  const filenameTextSelected = useRef(false);
  const [filename, setFilename] = useState("");

  function handleChangeFilename(event) {
    setFilename(event.target.value);
  }

  function handleSubmit() {
    onRename({ filename });
  }

  function handleReset() {
    dialogRef.current.close();
  }

  function handleClose() {
    filenameTextSelected.current = false;
    setFilename("");
    onClose();
  }

  useEffect(() => {
    if (renameDialog) {
      const { opened, filename } = renameDialog;
      if (!dialogRef.current.open && opened) {
        setFilename(filename);
        dialogRef.current.showModal();
      }
    }
  }, [renameDialog]);
  useEffect(() => {
    if (!filenameTextSelected.current && filename) {
      filenameTextSelected.current = true;
      filenameInputRef.current.select();
    }
  }, [filename]);
  return (
    <dialog ref={dialogRef} onClose={handleClose}>
      <form method="dialog" onSubmit={handleSubmit} onReset={handleReset}>
        <div>{messages.RENAME_TITLE}</div>
        <p>
          <label>
            {messages.RENAME_FILENAME_LABEL}
            <input
              value={filename}
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
