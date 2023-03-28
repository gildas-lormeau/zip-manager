import Dialog from "./Dialog";

import { useState } from "react";

function PasswordDialog({ data, onClose, messages }) {
  const [password, setPassword] = useState("");

  function handleChangePassword(event) {
    setPassword(event.target.value);
  }

  function handleClose() {
    setPassword("");
    data.onSetImportPassword({ password });
    onClose();
  }

  return (
    <Dialog
      data={data}
      title={messages.IMPORT_PASSWORD_TITLE}
      onClose={handleClose}
    >
      <p>
        <label>
          {messages.IMPORT_PASSWORD_LABEL}
          <input
            type="password"
            autoComplete="off"
            value={password}
            required
            onChange={handleChangePassword}
          ></input>
        </label>
      </p>
      <div className="button-bar">
        <button type="reset">{messages.DIALOG_CANCEL_BUTTON_LABEL}</button>
        <button type="submit">{messages.DIALOG_OK_BUTTON_LABEL}</button>
      </div>
    </Dialog>
  );
}

export default PasswordDialog;
