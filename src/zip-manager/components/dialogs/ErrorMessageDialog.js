import { useEffect, useRef } from "react";

function ErrorMessageDialog({ data, onClose, messages }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!dialogRef.current.open && data) {
      dialogRef.current.showModal();
    }
  }, [data]);
  return (
    <dialog ref={dialogRef} onClose={onClose}>
      <form method="dialog">
        <div>{messages.ERROR_TITLE}</div>
        <p>
          <label>{data?.message}</label>
        </p>
        <div className="button-bar">
          <button type="submit">{messages.DIALOG_OK_BUTTON_LABEL}</button>
        </div>
      </form>
    </dialog>
  );
}

export default ErrorMessageDialog;
