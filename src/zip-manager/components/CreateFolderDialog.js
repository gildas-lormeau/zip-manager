import { useEffect, useRef, useState } from "react";

function CreateFolderDialog({
  open,
  folderName,
  onCreateFolder,
  onClose,
  messages
}) {
  const dialogRef = useRef(null);
  const [folderNameValue, setFolderNameValue] = useState("");

  function handleChangeFilename(event) {
    setFolderNameValue(event.target.value);
  }

  function handleSubmit() {
    onCreateFolder({ folderName: folderNameValue });
  }

  function handleReset() {
    dialogRef.current.close();
  }

  useEffect(() => {
    if (!dialogRef.current.open && open) {
      setFolderNameValue(folderName);
      dialogRef.current.showModal();
    }
  }, [open, folderName]);
  return (
    <>
      <div className="dialog-backdrop" hidden={!open}></div>
      <dialog ref={dialogRef} onClose={onClose}>
        <form method="dialog" onSubmit={handleSubmit} onReset={handleReset}>
          <div>{messages.CREATE_FOLDER_TITLE}</div>
          <p>
            <label>
              {messages.CREATE_FOLDER_NAME_LABEL}
              <input
                value={folderNameValue}
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
    </>
  );
}

export default CreateFolderDialog;
