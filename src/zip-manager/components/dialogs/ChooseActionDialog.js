import { useEffect, useRef } from "react";

function ChooseActionDialog({
  data,
  onImportZipFile,
  onAddFiles,
  onClose,
  messages
}) {
  const dialogRef = useRef(null);

  function handleClose() {
    onClose();
  }

  function handleImportZipClick() {
    onImportZipFile(data.files[0]);
  }

  function handleAddFileClick() {
    onAddFiles(data.files);
  }

  function handleReset() {
    dialogRef.current.close();
  }

  useEffect(() => {
    if (!dialogRef.current.open && data) {
      dialogRef.current.showModal();
    }
  }, [data]);
  return (
    <dialog ref={dialogRef} onClose={handleClose}>
      <form method="dialog" onReset={handleReset}>
        <div>
          <div className="dialog-title">
            <label>{messages.CHOOSE_ACTION_TITLE}</label>
          </div>
          <p>{messages.CHOOSE_ACTION_LABEL}</p>
          <div className="button-bar">
            <div className="button-group"></div>
            <div className="button-group">
              <button type="reset">
                {messages.DIALOG_CANCEL_BUTTON_LABEL}
              </button>
              <button type="submit" onClick={handleAddFileClick}>
                {messages.CHOOSE_ACTION_DIALOG_ADD_FILE_BUTTON_LABEL}
              </button>
              <button type="submit" onClick={handleImportZipClick}>
                {messages.IMPORT_ZIP_BUTTON_LABEL}
              </button>
            </div>
          </div>
        </div>
      </form>
    </dialog>
  );
}

export default ChooseActionDialog;
