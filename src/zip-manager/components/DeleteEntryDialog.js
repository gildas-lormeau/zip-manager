import { useEffect, useRef } from "react";

function DeleteEntryDialog({ open, onDeleteEntry, onClose, messages }) {
  const dialogRef = useRef(null);

  function handleReset() {
    dialogRef.current.close();
  }

  useEffect(() => {
    if (!dialogRef.current.open && open) {
      dialogRef.current.showModal();
    }
  }, [open]);
  return (
    <dialog ref={dialogRef} onClose={onClose}>
      <form method="dialog" onSubmit={onDeleteEntry} onReset={handleReset}>
        <div>{messages.DELETE_ENTRY_TITLE}</div>
        <p>
          <label>{messages.DELETE_ENTRY_MESSAGE}</label>
        </p>
        <div className="button-bar">
          <button type="reset">{messages.DIALOG_CANCEL_BUTTON_LABEL}</button>
          <button type="submit">
            {messages.DELETE_ENTRY_DIALOG_BUTTON_LABEL}
          </button>
        </div>
      </form>
    </dialog>
  );
}

export default DeleteEntryDialog;
