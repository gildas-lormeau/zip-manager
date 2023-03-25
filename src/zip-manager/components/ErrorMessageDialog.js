import { useEffect, useRef } from "react";

function ErrorMessageDialog({ open, message, onClose, messages }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!dialogRef.current.open && open) {
      dialogRef.current.showModal();
    }
  }, [open]);
  return (
    <>
      <div className="dialog-backdrop" hidden={!open}></div>
      <dialog ref={dialogRef} onClose={onClose}>
        <form method="dialog">
          <div>{messages.ERROR_DIALOG_TITLE}</div>
          <p>
            <label>{message}</label>
          </p>
          <div className="button-bar">
            <button type="submit">{messages.DIALOG_OK_BUTTON_LABEL}</button>
          </div>
        </form>
      </dialog>
    </>
  );
}

export default ErrorMessageDialog;
