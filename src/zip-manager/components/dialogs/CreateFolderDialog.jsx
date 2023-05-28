import Dialog from "./Dialog.jsx";

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
      cancelLabel={messages.DIALOG_CANCEL_BUTTON_LABEL}
      submitLabel={messages.CREATE_FOLDER_DIALOG_BUTTON_LABEL}
      onClose={handleClose}
      onSubmit={handleSubmit}
    >
      <label>
        {messages.CREATE_FOLDER_NAME_LABEL}
        <input
          spellCheck="false"
          type="text"
          value={folderName}
          required
          onChange={handleChangeFilename}
        />
      </label>
    </Dialog>
  );
}

export default CreateFolderDialog;
