import "./styles/TopButtonBar.css";

import Button from "./Button.jsx";

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
  onShowImportZipFilePicker,
  onShowAddFilesPicker,
  onClickedButton,
  addFilePickerRef,
  importZipFilePickerRef,
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
      className="button-bar button-bar-top"
      role="toolbar"
      aria-label="Selected directory commands"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="button-group">
        <AddFilesButton
          clickedButtonName={clickedButtonName}
          onAddFiles={onAddFiles}
          onShowAddFilesPicker={onShowAddFilesPicker}
          onClickedButton={onClickedButton}
          addFilePickerRef={addFilePickerRef}
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
          onShowImportZipFilePicker={onShowImportZipFilePicker}
          onClickedButton={onClickedButton}
          importZipFilePickerRef={importZipFilePickerRef}
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
  addFilePickerRef,
  onAddFiles,
  onShowAddFilesPicker,
  onClickedButton,
  constants,
  messages
}) {
  return (
    <>
      <Button
        name={constants.ADD_FILES_BUTTON_NAME}
        title={messages.ADD_FILES_BUTTON_TOOLTIP}
        label={messages.ADD_FILES_BUTTON_LABEL}
        clickedButtonName={clickedButtonName}
        onClick={onShowAddFilesPicker}
        onClickedButton={onClickedButton}
      />
      <FilePicker
        onChange={onAddFiles}
        filePickerRef={addFilePickerRef}
        multiple
      />
    </>
  );
}

function ImportZipButton({
  clickedButtonName,
  onImportZipFile,
  onShowImportZipFilePicker,
  onClickedButton,
  importZipFilePickerRef,
  constants,
  messages
}) {
  const { IMPORT_ZIP_BUTTON_NAME, ZIP_EXTENSIONS_ACCEPT_STRING } = constants;

  function handleChange(files) {
    onImportZipFile(files[0]);
  }

  function handleClick() {
    onShowImportZipFilePicker({
      description: messages.ZIP_FILE_DESCRIPTION_LABEL
    });
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
      <FilePicker
        onChange={handleChange}
        filePickerRef={importZipFilePickerRef}
        accept={ZIP_EXTENSIONS_ACCEPT_STRING}
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

function FilePicker({ accept, multiple, onChange, filePickerRef }) {
  function handleChange({ target }) {
    if (target.files.length) {
      onChange(Array.from(target.files));
    }
    filePickerRef.current.value = "";
  }

  return (
    <input
      onChange={handleChange}
      ref={filePickerRef}
      type="file"
      accept={accept}
      hidden
      multiple={multiple}
    />
  );
}

export default TopButtonBar;
