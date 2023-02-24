/* global MouseEvent */

import "./styles/TopButtonBar.css";

import { useRef } from "react";
import {
  SHORTCUT_LABEL,
  CTRL_KEY_LABEL,
  CREATE_FOLDER_KEY,
  CLICK_EVENT_NAME,
  ADD_FILES_KEY,
  IMPORT_ZIP_KEY,
  ZIP_EXTENSION,
  EXPORT_ZIP_KEY
} from "./../business/constants.js";

function TopButtonBar({
  addFilesButtonRef,
  importZipButtonRef,
  disabledExportZipButton,
  disabledResetButton,
  onCreateFolder,
  onAddFiles,
  onImportZipFile,
  onExportZipFile,
  onReset
}) {
  return (
    <div className="button-bar">
      <div className="button-group">
        <CreateFolderButton onCreateFolder={onCreateFolder} />
        <AddFilesButton
          onAddFiles={onAddFiles}
          addFilesButtonRef={addFilesButtonRef}
        />
      </div>
      <div className="button-group">
        <ImportZipButton
          onImportZipFile={onImportZipFile}
          importZipButtonRef={importZipButtonRef}
        />
        <ExportZipButton
          disabled={disabledExportZipButton}
          onExportZipFile={onExportZipFile}
        />
      </div>
      <div className="button-group">
        <ResetButton disabled={disabledResetButton} onReset={onReset} />
      </div>
    </div>
  );
}

function CreateFolderButton({ onCreateFolder }) {
  return (
    <button
      onClick={onCreateFolder}
      title={SHORTCUT_LABEL + CTRL_KEY_LABEL + CREATE_FOLDER_KEY}
    >
      Create directory
    </button>
  );
}

function AddFilesButton({ addFilesButtonRef, onAddFiles }) {
  const fileInputRef = useRef(null);
  const { current } = fileInputRef;

  function handleChange({ target }) {
    const files = Array.from(target.files);
    current.value = "";
    if (files.length) {
      onAddFiles(files);
    }
  }

  function dispatchEvent() {
    current.dispatchEvent(new MouseEvent(CLICK_EVENT_NAME));
  }

  return (
    <>
      <button
        onClick={dispatchEvent}
        ref={addFilesButtonRef}
        title={SHORTCUT_LABEL + CTRL_KEY_LABEL + ADD_FILES_KEY}
      >
        Add files
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

function ImportZipButton({ importZipButtonRef, onImportZipFile }) {
  const fileInput = useRef(null);
  const { current } = fileInput;

  function dispatchEvent() {
    current.dispatchEvent(new MouseEvent(CLICK_EVENT_NAME));
  }

  return (
    <>
      <button
        onClick={dispatchEvent}
        ref={importZipButtonRef}
        title={SHORTCUT_LABEL + CTRL_KEY_LABEL + IMPORT_ZIP_KEY}
      >
        Import zip file
      </button>
      <input
        onChange={({ target }) => onImportZipFile(target.files[0])}
        ref={fileInput}
        type="file"
        accept={ZIP_EXTENSION}
        hidden
      />
    </>
  );
}

function ExportZipButton({ disabled, onExportZipFile }) {
  return (
    <button
      onClick={onExportZipFile}
      disabled={disabled}
      title={SHORTCUT_LABEL + CTRL_KEY_LABEL + EXPORT_ZIP_KEY}
    >
      Export zip file
    </button>
  );
}

function ResetButton({ disabled, onReset }) {
  return (
    <button onClick={onReset} disabled={disabled}>
      Reset
    </button>
  );
}

export default TopButtonBar;
