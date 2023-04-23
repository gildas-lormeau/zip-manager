import Dialog from "./Dialog.jsx";

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
      cancelLabel={messages.DIALOG_CANCEL_BUTTON_LABEL}
      submitLabel={messages.DIALOG_OK_BUTTON_LABEL}
      onClose={handleClose}
    >
      <label>
        {messages.IMPORT_PASSWORD_LABEL}
        <input
          type="password"
          autoComplete="off"
          value={password}
          required
          onChange={handleChangePassword}
        />
      </label>
    </Dialog>
  );
}

export default PasswordDialog;
