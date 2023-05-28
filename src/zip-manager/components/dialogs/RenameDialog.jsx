import Dialog from "./Dialog.jsx";

import { useEffect, useRef, useState } from "react";

function RenameDialog({ data, onRename, onClose, messages }) {
  const filenameInputRef = useRef(null);
  const filenameTextSelected = useRef(false);
  const [filename, setFilename] = useState("");

  function handleChangeFilename(event) {
    setFilename(event.target.value);
  }

  function onOpen() {
    setFilename(data.filename);
  }

  function handleSubmit() {
    onRename({ filename });
  }

  function handleClose() {
    setFilename("");
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
      title={messages.RENAME_TITLE}
      cancelLabel={messages.DIALOG_CANCEL_BUTTON_LABEL}
      submitLabel={messages.RENAME_DIALOG_BUTTON_LABEL}
      onOpen={onOpen}
      onClose={handleClose}
      onSubmit={handleSubmit}
    >
      <label>
        {messages.RENAME_FILENAME_LABEL}
        <input
          spellCheck="false"
          type="text"
          value={filename}
          required
          onChange={handleChangeFilename}
          ref={filenameInputRef}
        />
      </label>
    </Dialog>
  );
}

export default RenameDialog;
