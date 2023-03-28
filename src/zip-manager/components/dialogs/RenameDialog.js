import Dialog from "./Dialog.js";

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
      onOpen={onOpen}
      onClose={handleClose}
      onSubmit={handleSubmit}
    >
      <p>
        <label>
          {messages.RENAME_FILENAME_LABEL}
          <input
            value={filename}
            required
            onChange={handleChangeFilename}
            ref={filenameInputRef}
          ></input>
        </label>
      </p>
      <div className="button-bar">
        <button type="reset">{messages.DIALOG_CANCEL_BUTTON_LABEL}</button>
        <button type="submit">{messages.RENAME_DIALOG_BUTTON_LABEL}</button>
      </div>
    </Dialog>
  );
}

export default RenameDialog;
