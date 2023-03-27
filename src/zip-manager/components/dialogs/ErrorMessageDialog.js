import { useEffect, useRef } from "react";

function ErrorMessageDialog({ errorMessageDialog, onClose, messages }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!dialogRef.current.open && errorMessageDialog) {
      dialogRef.current.showModal();
    }
  }, [errorMessageDialog]);
  return (
    <dialog ref={dialogRef} onClose={onClose}>
      <form method="dialog">
        <div>{messages.ERROR_TITLE}</div>
        <p>
          <label>{errorMessageDialog?.message}</label>
        </p>
        <div className="button-bar">
          <button type="submit">{messages.DIALOG_OK_BUTTON_LABEL}</button>
        </div>
      </form>
    </dialog>
  );
}

export default ErrorMessageDialog;
