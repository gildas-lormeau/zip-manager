import { useEffect, useRef, useState } from "react";

function PasswordDialog({ open, onSetPassword, onClose, messages }) {
  const dialogRef = useRef(null);
  const [passwordValue, setPasswordValue] = useState("");

  function handleChangePassword(event) {
    setPasswordValue(event.target.value);
  }

  function handleReset() {
    dialogRef.current.close();
  }

  function handleClose() {
    onSetPassword({ password: passwordValue });
    setPasswordValue("");
    onClose();
  }

  useEffect(() => {
    if (!dialogRef.current.open && open) {
      dialogRef.current.showModal();
    }
  }, [open]);
  return (
    <dialog ref={dialogRef} onClose={handleClose}>
      <form method="dialog" onReset={handleReset}>
        <div>{messages.IMPORT_PASSWORD_DIALOG_TITLE}</div>
        <p>
          <label>
            {messages.IMPORT_PASSWORD_DIALOG_LABEL}
            <input
              type="password"
              autoComplete="off"
              value={passwordValue}
              required
              onChange={handleChangePassword}
            ></input>
          </label>
        </p>
        <div className="button-bar">
          <button type="reset">{messages.DIALOG_CANCEL_BUTTON_LABEL}</button>
          <button type="submit">{messages.DIALOG_OK_BUTTON_LABEL}</button>
        </div>
      </form>
    </dialog>
  );
}

export default PasswordDialog;
