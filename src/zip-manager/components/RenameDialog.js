import { useEffect, useRef, useState } from "react";

function RenameDialog({ open, filename, onRename, onClose, messages }) {
  const dialogRef = useRef(null);
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

  useEffect(() => {
    if (!dialogRef.current.open && open) {
      setFilenameValue(filename);
      dialogRef.current.showModal();
    }
  }, [open, filename]);
  return (
    <>
      <div className="dialog-backdrop" hidden={!open}></div>
      <dialog ref={dialogRef} onClose={onClose}>
        <form method="dialog" onSubmit={handleSubmit} onReset={handleReset}>
          <div>{messages.RENAME_TITLE}</div>
          <p>
            <label>
              {messages.RENAME_FILENAME_LABEL}
              <input
                value={filenameValue}
                required
                onChange={handleChangeFilename}
              ></input>
            </label>
          </p>
          <div className="button-bar">
            <button type="reset">{messages.DIALOG_CANCEL_BUTTON_LABEL}</button>
            <button type="submit">{messages.RENAME_DIALOG_BUTTON_LABEL}</button>
          </div>
        </form>
      </dialog>
    </>
  );
}

export default RenameDialog;
