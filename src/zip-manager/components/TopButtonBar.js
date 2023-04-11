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
  onExportZip,
  onReset,
  onOpenOptions,
  onClickedButton,
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
        <AddFilesButton
          clickedButtonName={clickedButtonName}
          onAddFiles={onAddFiles}
          onClickedButton={onClickedButton}
          util={util}
          constants={constants}
          messages={messages}
        />
        <CreateFolderButton
          clickedButtonName={clickedButtonName}
          onCreateFolder={onCreateFolder}
          onClickedButton={onClickedButton}
          constants={constants}
          messages={messages}
        />
      </div>
      <div className="button-group">
        <ImportZipButton
          clickedButtonName={clickedButtonName}
          onImportZipFile={onImportZipFile}
          onClickedButton={onClickedButton}
          util={util}
          constants={constants}
          messages={messages}
        />
        <ExportZipButton
          disabled={disabledExportZipButton}
          clickedButtonName={clickedButtonName}
          onExportZip={onExportZip}
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
        <OptionsButton onOpenOptions={onOpenOptions} messages={messages} />
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
      if (util.openFilePickerSupported()) {
        const files = await util.showOpenFilePicker({
          multiple: true
        });
        onAddFiles(files);
      } else {
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
  onImportZipFile,
  onClickedButton,
  util,
  constants,
  messages
}) {
  const {
    IMPORT_ZIP_BUTTON_NAME,
    ZIP_EXTENSIONS_ACCEPT,
    ZIP_EXTENSIONS_ACCEPT_STRING
  } = constants;
  const fileInputRef = useRef(null);
  const { current } = fileInputRef;

  function handleChange({ target }) {
    onImportZipFile(target.files[0]);
    current.value = "";
  }

  function handleClick() {
    async function showOpenFilePicker() {
      if (util.openFilePickerSupported()) {
        const files = await util.showOpenFilePicker({
          multiple: false,
          description: messages.ZIP_FILE_DESCRIPTION_LABEL,
          accept: ZIP_EXTENSIONS_ACCEPT
        });
        if (files.length) {
          onImportZipFile(files[0]);
        }
      } else {
        util.dispatchClick(current);
      }
    }

    showOpenFilePicker();
  }

  return (
    <>
      <Button
        name={IMPORT_ZIP_BUTTON_NAME}
        title={messages.IMPORT_ZIP_BUTTON_TOOLTIP}
        label={messages.IMPORT_ZIP_BUTTON_LABEL}
        clickedButtonName={clickedButtonName}
        onClick={handleClick}
        onClickedButton={onClickedButton}
      />
      <input
        onChange={handleChange}
        ref={fileInputRef}
        type="file"
        accept={ZIP_EXTENSIONS_ACCEPT_STRING}
        hidden
      />
    </>
  );
}

function ExportZipButton({
  disabled,
  clickedButtonName,
  onExportZip,
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
      onClick={onExportZip}
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

function OptionsButton({ onOpenOptions, messages }) {
  return (
    <Button label={messages.OPTIONS_BUTTON_LABEL} onClick={onOpenOptions} />
  );
}

export default TopButtonBar;
