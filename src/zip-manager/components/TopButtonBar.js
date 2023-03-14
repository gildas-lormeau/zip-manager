import "./styles/TopButtonBar.css";

import { useRef } from "react";

function TopButtonBar({
  disabledExportZipButton,
  disabledResetButton,
  onCreateFolder,
  onAddFiles,
  onImportZipFile,
  onExportZipFile,
  onReset,
  addFilesButtonRef,
  importZipButtonRef,
  util,
  constants,
  messages
}) {
  return (
    <div
      className="button-bar button-bar button-bar-top"
      role="toolbar"
      aria-label="Selected directory commands"
    >
      <div className="button-group">
        <CreateFolderButton
          onCreateFolder={onCreateFolder}
          messages={messages}
        />
        <AddFilesButton
          onAddFiles={onAddFiles}
          addFilesButtonRef={addFilesButtonRef}
          util={util}
          messages={messages}
        />
      </div>
      <div className="button-group">
        <ImportZipButton
          onImportZipFile={onImportZipFile}
          importZipButtonRef={importZipButtonRef}
          util={util}
          constants={constants}
          messages={messages}
        />
        <ExportZipButton
          disabled={disabledExportZipButton}
          onExportZipFile={onExportZipFile}
          messages={messages}
        />
      </div>
      <div className="button-group">
        <ResetButton
          disabled={disabledResetButton}
          onReset={onReset}
          messages={messages}
        />
      </div>
    </div>
  );
}

function CreateFolderButton({ onCreateFolder, messages }) {
  return (
    <button
      onClick={onCreateFolder}
      title={messages.CREATE_FOLDER_BUTTON_TOOLTIP}
    >
      {messages.CREATE_FOLDER_BUTTON_LABEL}
    </button>
  );
}

function AddFilesButton({ addFilesButtonRef, onAddFiles, util, messages }) {
  const fileInputRef = useRef(null);
  const { current } = fileInputRef;

  function handleChange({ target }) {
    const files = Array.from(target.files);
    if (files.length) {
      onAddFiles(files);
    }
    util.resetValue(current);
  }

  function handleClick() {
    async function showOpenFilePicker() {
      try {
        onAddFiles(
          await util.showOpenFilePicker({
            multiple: true
          })
        );
      } catch (error) {
        util.dispatchClick(current);
      }
    }

    showOpenFilePicker();
  }

  return (
    <>
      <button
        onClick={handleClick}
        ref={addFilesButtonRef}
        title={messages.ADD_FILES_BUTTON_TOOLTIP}
      >
        {messages.ADD_FILES_BUTTON_LABEL}
      </button>
      <input
        onChange={handleChange}
        ref={fileInputRef}
        type="file"
        multiple
        hidden
      />
    </>
  );
}

function ImportZipButton({
  importZipButtonRef,
  onImportZipFile,
  util,
  constants,
  messages
}) {
  const { ZIP_EXTENSION } = constants;
  const fileInputRef = useRef(null);
  const { current } = fileInputRef;

  function handleChange({ target }) {
    onImportZipFile(target.files[0]);
    util.resetValue(current);
  }

  function handleClick() {
    async function showOpenFilePicker() {
      try {
        const files = await util.showOpenFilePicker({
          multiple: false,
          description: messages.ZIP_FILES_DESCRIPTION_LABEL,
          extension: ZIP_EXTENSION
        });
        if (files.length) {
          onImportZipFile(files[0]);
        }
      } catch (error) {
        util.dispatchClick(current);
      }
    }

    showOpenFilePicker();
  }

  return (
    <>
      <button
        onClick={handleClick}
        ref={importZipButtonRef}
        title={messages.IMPORT_ZIP_BUTTON_TOOLTIP}
      >
        {messages.IMPORT_ZIP_BUTTON_LABEL}
      </button>
      <input
        onChange={handleChange}
        ref={fileInputRef}
        type="file"
        accept={messages.ZIP_EXTENSION}
        hidden
      />
    </>
  );
}

function ExportZipButton({ disabled, onExportZipFile, messages }) {
  return (
    <button
      onClick={onExportZipFile}
      disabled={disabled}
      title={messages.EXPORT_ZIP_BUTTON_TOOLTIP}
    >
      {messages.EXPORT_ZIP_BUTTON_LABEL}
    </button>
  );
}

function ResetButton({ disabled, onReset, messages }) {
  return (
    <button onClick={onReset} disabled={disabled}>
      {messages.RESET_BUTTON_LABEL}
    </button>
  );
}

export default TopButtonBar;
