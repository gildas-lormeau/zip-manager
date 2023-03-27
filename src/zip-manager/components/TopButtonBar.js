import "./styles/TopButtonBar.css";

import { useRef } from "react";

import Button from "./Button.js";

function TopButtonBar({
  disabledExportZipButton,
  disabledResetButton,
  flashingButton,
  onCreateFolder,
  onAddFiles,
  onImportZipFile,
  onExportZipFile,
  onReset,
  onFlashingAnimationEnd,
  addFilesButtonRef,
  importZipButtonRef,
  util,
  constants,
  messages
}) {
  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDrop(event) {
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      event.preventDefault();
      onImportZipFile(event.dataTransfer.files[0]);
    }
  }

  return (
    <div
      className="button-bar button-bar button-bar-top"
      role="toolbar"
      aria-label="Selected directory commands"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="button-group">
        <CreateFolderButton
          flashingButton={flashingButton}
          onCreateFolder={onCreateFolder}
          onFlashingAnimationEnd={onFlashingAnimationEnd}
          constants={constants}
          messages={messages}
        />
        <AddFilesButton
          flashingButton={flashingButton}
          onAddFiles={onAddFiles}
          addFilesButtonRef={addFilesButtonRef}
          onFlashingAnimationEnd={onFlashingAnimationEnd}
          util={util}
          constants={constants}
          messages={messages}
        />
      </div>
      <div className="button-group">
        <ImportZipButton
          flashingButton={flashingButton}
          onImportZipFile={onImportZipFile}
          onFlashingAnimationEnd={onFlashingAnimationEnd}
          importZipButtonRef={importZipButtonRef}
          util={util}
          constants={constants}
          messages={messages}
        />
        <ExportZipButton
          disabled={disabledExportZipButton}
          flashingButton={flashingButton}
          onExportZipFile={onExportZipFile}
          onFlashingAnimationEnd={onFlashingAnimationEnd}
          constants={constants}
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

function CreateFolderButton({
  flashingButton,
  onCreateFolder,
  onFlashingAnimationEnd,
  constants,
  messages
}) {
  return (
    <Button
      name={constants.CREATE_FOLDER_BUTTON_NAME}
      title={messages.CREATE_FOLDER_BUTTON_TOOLTIP}
      label={messages.CREATE_FOLDER_BUTTON_LABEL}
      flashingButton={flashingButton}
      onClick={onCreateFolder}
      onFlashingAnimationEnd={onFlashingAnimationEnd}
    />
  );
}

function AddFilesButton({
  flashingButton,
  addFilesButtonRef,
  onAddFiles,
  onFlashingAnimationEnd,
  util,
  constants,
  messages
}) {
  const fileInputRef = useRef(null);
  const { current } = fileInputRef;

  function handleChange({ target }) {
    const files = Array.from(target.files);
    if (files.length) {
      onAddFiles(files);
    }
    current.value = "";
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
      <Button
        name={constants.ADD_FILES_BUTTON_NAME}
        title={messages.ADD_FILES_BUTTON_TOOLTIP}
        label={messages.ADD_FILES_BUTTON_LABEL}
        flashingButton={flashingButton}
        onClick={handleClick}
        onFlashingAnimationEnd={onFlashingAnimationEnd}
        buttonRef={addFilesButtonRef}
      />
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
  flashingButton,
  importZipButtonRef,
  onImportZipFile,
  onFlashingAnimationEnd,
  util,
  constants,
  messages
}) {
  const { ZIP_EXTENSION } = constants;
  const fileInputRef = useRef(null);
  const { current } = fileInputRef;

  function handleChange({ target }) {
    onImportZipFile(target.files[0]);
    current.value = "";
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
      <Button
        name={constants.IMPORT_ZIP_BUTTON_NAME}
        buttonRef={importZipButtonRef}
        title={messages.IMPORT_ZIP_BUTTON_TOOLTIP}
        label={messages.IMPORT_ZIP_BUTTON_LABEL}
        flashingButton={flashingButton}
        onClick={handleClick}
        onFlashingAnimationEnd={onFlashingAnimationEnd}
      />
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

function ExportZipButton({
  disabled,
  flashingButton,
  onExportZipFile,
  onFlashingAnimationEnd,
  constants,
  messages
}) {
  return (
    <Button
      name={constants.EXPORT_ZIP_BUTTON_NAME}
      disabled={disabled}
      title={messages.EXPORT_ZIP_BUTTON_TOOLTIP}
      label={messages.EXPORT_ZIP_BUTTON_LABEL}
      flashingButton={flashingButton}
      onClick={onExportZipFile}
      onFlashingAnimationEnd={onFlashingAnimationEnd}
    />
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
