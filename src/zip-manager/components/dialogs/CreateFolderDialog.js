import { useEffect, useRef, useState } from "react";

function CreateFolderDialog({
  createFolderDialog,
  onCreateFolder,
  onClose,
  messages
}) {
  const dialogRef = useRef(null);
  const [folderName, setFolderName] = useState("");

  function handleChangeFilename(event) {
    setFolderName(event.target.value);
  }

  function handleSubmit() {
    onCreateFolder({ folderName });
  }

  function handleReset() {
    dialogRef.current.close();
  }

  function handleClose() {
    setFolderName("");
    onClose();
  }

  useEffect(() => {
    if (!dialogRef.current.open && createFolderDialog?.opened) {
      dialogRef.current.showModal();
    }
  }, [createFolderDialog]);
  return (
    <dialog ref={dialogRef} onClose={handleClose}>
      <form method="dialog" onSubmit={handleSubmit} onReset={handleReset}>
        <div>{messages.CREATE_FOLDER_TITLE}</div>
        <p>
          <label>
            {messages.CREATE_FOLDER_NAME_LABEL}
            <input
              value={folderName}
              required
              onChange={handleChangeFilename}
            ></input>
          </label>
        </p>
        <div className="button-bar">
          <button type="reset">{messages.DIALOG_CANCEL_BUTTON_LABEL}</button>
          <button type="submit">
            {messages.CREATE_FOLDER_DIALOG_BUTTON_LABEL}
          </button>
        </div>
      </form>
    </dialog>
  );
}

export default CreateFolderDialog;
