import Dialog from "./Dialog.js";

import { useEffect, useRef, useState } from "react";

function ExportZipDialog({ data, onExportZip, onClose, messages }) {
  const filenameInputRef = useRef(null);
  const filenameTextSelected = useRef(false);
  const [filename, setFilename] = useState("");
  const [password, setPassword] = useState("");

  function handleChangeFilename(event) {
    setFilename(event.target.value);
  }

  function handleChangePassword(event) {
    setPassword(event.target.value);
  }

  function onOpen() {
    const { filename, password } = data;
    setFilename(filename);
    setPassword(password);
  }

  function handleSubmit() {
    onExportZip({ filename, password });
  }

  function handleClose() {
    filenameTextSelected.current = false;
    onClose();
  }

  useEffect(() => {
    if (!filenameTextSelected.current && filename) {
      filenameTextSelected.current = true;
      filenameInputRef.current.select();
    }
  }, [filename]);
  return (
    <Dialog
      data={data}
      title={messages.EXPORT_ZIP_TITLE}
      resetLabel={messages.DIALOG_CANCEL_BUTTON_LABEL}
      submitLabel={messages.EXPORT_ZIP_DIALOG_BUTTON_LABEL}
      onOpen={onOpen}
      onClose={handleClose}
      onSubmit={handleSubmit}
    >
      <label>
        {messages.EXPORT_ZIP_FILENAME_LABEL}
        <input
          value={filename}
          required
          onChange={handleChangeFilename}
          ref={filenameInputRef}
        />
      </label>
      <label>
        {messages.EXPORT_ZIP_PASSWORD_LABEL}
        <input
          type="password"
          autoComplete="off"
          value={password}
          onChange={handleChangePassword}
        />
      </label>
    </Dialog>
  );
}

export default ExportZipDialog;
