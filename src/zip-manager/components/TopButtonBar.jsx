import "./styles/TopButtonBar.css";

import {
  AddFilesButton,
  CreateFolderButton,
  ImportZipButton,
  ExportZipButton,
  ResetButton,
  OptionsButton
} from "./Buttons.jsx";

function TopButtonBar({
  disabledExportZipButton,
  disabledResetButton,
  clickedButtonName,
  onCreateFolder,
  onImportZipFile,
  onExportZip,
  onReset,
  onOpenOptions,
  onShowImportZipFilePicker,
  onShowAddFilesPicker,
  onClickedButton,
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
      aria-label={messages.SELECTED_FOLDER_LABEL}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="button-group">
        <AddFilesButton
          clickedButtonName={clickedButtonName}
          onShowAddFilesPicker={onShowAddFilesPicker}
          onClickedButton={onClickedButton}
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
          onShowImportZipFilePicker={onShowImportZipFilePicker}
          onClickedButton={onClickedButton}
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

export default TopButtonBar;
