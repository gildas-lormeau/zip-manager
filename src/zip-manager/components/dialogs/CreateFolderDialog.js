import Dialog from "./Dialog.js";

import { useState } from "react";

function CreateFolderDialog({ data, onCreateFolder, onClose, messages }) {
  const [folderName, setFolderName] = useState("");

  function handleChangeFilename(event) {
    setFolderName(event.target.value);
  }

  function handleSubmit() {
    onCreateFolder({ folderName });
  }

  function handleClose() {
    setFolderName("");
    onClose();
  }

  return (
    <Dialog
      data={data}
      title={messages.CREATE_FOLDER_TITLE}
      onClose={handleClose}
      onSubmit={handleSubmit}
    >
      <p>
        <label>
          {messages.CREATE_FOLDER_NAME_LABEL}
          <input
            value={folderName}
            required
            onChange={handleChangeFilename}
          ></input>
        </label>
      </p>
      <div className="button-bar">
        <button type="reset">{messages.DIALOG_CANCEL_BUTTON_LABEL}</button>
        <button type="submit">
          {messages.CREATE_FOLDER_DIALOG_BUTTON_LABEL}
        </button>
      </div>
    </Dialog>
  );
}

export default CreateFolderDialog;
