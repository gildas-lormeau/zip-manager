import { useEffect, useRef } from "react";

function ResetDialog({ resetDialog, onReset, onClose, messages }) {
  const dialogRef = useRef(null);

  function handleReset() {
    dialogRef.current.close();
  }

  useEffect(() => {
    if (!dialogRef.current.open && resetDialog.opened) {
      dialogRef.current.showModal();
    }
  }, [resetDialog]);
  return (
    <dialog ref={dialogRef} onClose={onClose}>
      <form method="dialog" onSubmit={onReset} onReset={handleReset}>
        <div>{messages.RESET_TITLE}</div>
        <p>
          <label>{messages.RESET_MESSAGE}</label>
        </p>
        <div className="button-bar">
          <button type="reset">{messages.DIALOG_CANCEL_BUTTON_LABEL}</button>
          <button type="submit">{messages.RESET_DIALOG_BUTTON_LABEL}</button>
        </div>
      </form>
    </dialog>
  );
}

export default ResetDialog;
