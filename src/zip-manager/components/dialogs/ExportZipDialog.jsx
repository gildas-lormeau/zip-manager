import Dialog from "./Dialog.jsx";

import { useEffect, useRef, useState } from "react";

function ExportZipDialog({
  data,
  hiddenPassword,
  onExportZip,
  onClose,
  messages
}) {
  const filenameInputRef = useRef(null);
  const filenameTextSelected = useRef(false);
  const [filename, setFilename] = useState("");
  const [password, setPassword] = useState("");
  const filenameHidden = data?.filenameHidden;

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
    if (
      !filenameTextSelected.current &&
      filename &&
      filenameInputRef &&
      filenameInputRef.current
    ) {
      filenameTextSelected.current = true;
      let selectionEnd = filename.lastIndexOf(".");
      filenameInputRef.current.setSelectionRange(
        0,
        selectionEnd === -1 ? filename.length : selectionEnd
      );
    }
  }, [filename]);
  return (
    <Dialog
      data={data}
      title={messages.EXPORT_ZIP_TITLE}
      cancelLabel={messages.DIALOG_CANCEL_BUTTON_LABEL}
      submitLabel={messages.EXPORT_ZIP_DIALOG_BUTTON_LABEL}
      onOpen={onOpen}
      onClose={handleClose}
      onSubmit={handleSubmit}
    >
      <label style={{ display: filenameHidden ? "none" : null }}>
        {messages.EXPORT_ZIP_FILENAME_LABEL}
        {!filenameHidden && (
          <input
            spellCheck="false"
            type="text"
            value={filename}
            required
            onChange={handleChangeFilename}
            ref={filenameInputRef}
          />
        )}
      </label>
      {hiddenPassword || (
        <label>
          {messages.EXPORT_ZIP_PASSWORD_LABEL}
          <input
            type="password"
            autoComplete="off"
            value={password}
            onChange={handleChangePassword}
          />
        </label>
      )}
    </Dialog>
  );
}

export default ExportZipDialog;
