import "./styles/TopButtonBar.css";

import { useRef } from "react";

import Button from "./Button.js";

function TopButtonBar({
  disabledExportZipButton,
  disabledResetButton,
  clickedButtonName,
  onCreateFolder,
  onAddFiles,
  onImportZipFile,
  onExportZipFile,
  onReset,
  onClickedButton,
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
          clickedButtonName={clickedButtonName}
          onCreateFolder={onCreateFolder}
          onClickedButton={onClickedButton}
          constants={constants}
          messages={messages}
        />
        <AddFilesButton
          clickedButtonName={clickedButtonName}
          onAddFiles={onAddFiles}
          addFilesButtonRef={addFilesButtonRef}
          onClickedButton={onClickedButton}
          util={util}
          constants={constants}
          messages={messages}
        />
      </div>
      <div className="button-group">
        <ImportZipButton
          clickedButtonName={clickedButtonName}
          onImportZipFile={onImportZipFile}
          onClickedButton={onClickedButton}
          importZipButtonRef={importZipButtonRef}
          util={util}
          constants={constants}
          messages={messages}
        />
        <ExportZipButton
          disabled={disabledExportZipButton}
          clickedButtonName={clickedButtonName}
          onExportZipFile={onExportZipFile}
          onClickedButton={onClickedButton}
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
  clickedButtonName,
  onCreateFolder,
  onClickedButton,
  constants,
  messages
}) {
  return (
    <Button
      name={constants.CREATE_FOLDER_BUTTON_NAME}
      title={messages.CREATE_FOLDER_BUTTON_TOOLTIP}
      label={messages.CREATE_FOLDER_BUTTON_LABEL}
      clickedButtonName={clickedButtonName}
      onClick={onCreateFolder}
      onClickedButton={onClickedButton}
    />
  );
}

function AddFilesButton({
  clickedButtonName,
  addFilesButtonRef,
  onAddFiles,
  onClickedButton,
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
        clickedButtonName={clickedButtonName}
        onClick={handleClick}
        onClickedButton={onClickedButton}
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
  clickedButtonName,
  importZipButtonRef,
  onImportZipFile,
  onClickedButton,
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
        title={messages.IMPORT_ZIP_BUTTON_TOOLTIP}
        label={messages.IMPORT_ZIP_BUTTON_LABEL}
        clickedButtonName={clickedButtonName}
        onClick={handleClick}
        onClickedButton={onClickedButton}
        buttonRef={importZipButtonRef}
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
  clickedButtonName,
  onExportZipFile,
  onClickedButton,
  constants,
  messages
}) {
  return (
    <Button
      name={constants.EXPORT_ZIP_BUTTON_NAME}
      title={messages.EXPORT_ZIP_BUTTON_TOOLTIP}
      label={messages.EXPORT_ZIP_BUTTON_LABEL}
      disabled={disabled}
      clickedButtonName={clickedButtonName}
      onClick={onExportZipFile}
      onClickedButton={onClickedButton}
    />
  );
}

function ResetButton({ disabled, onReset, messages }) {
  return (
    <Button
      label={messages.RESET_BUTTON_LABEL}
      disabled={disabled}
      onClick={onReset}
    />
  );
}

export default TopButtonBar;