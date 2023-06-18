function CopyEntryButton({
  disabled,
  clickedButtonName,
  onCopy,
  onClickedButton,
  constants,
  messages
}) {
  return (
    <Button
      name={constants.COPY_BUTTON_NAME}
      title={messages.COPY_BUTTON_TOOLTIP}
      label={messages.COPY_BUTTON_LABEL}
      disabled={disabled}
      clickedButtonName={clickedButtonName}
      onClick={onCopy}
      onClickedButton={onClickedButton}
    />
  );
}

function CutEntryButton({
  disabled,
  clickedButtonName,
  onCut,
  onClickedButton,
  constants,
  messages
}) {
  return (
    <Button
      name={constants.CUT_BUTTON_NAME}
      title={messages.CUT_BUTTON_TOOLTIP}
      label={messages.CUT_BUTTON_LABEL}
      disabled={disabled}
      clickedButtonName={clickedButtonName}
      onClick={onCut}
      onClickedButton={onClickedButton}
    />
  );
}

function PasteEntryButton({
  disabled,
  clickedButtonName,
  onPaste,
  onClickedButton,
  constants,
  messages
}) {
  return (
    <Button
      name={constants.PASTE_BUTTON_NAME}
      title={messages.PASTE_BUTTON_TOOLTIP}
      label={messages.PASTE_BUTTON_LABEL}
      disabled={disabled}
      clickedButtonName={clickedButtonName}
      onClick={onPaste}
      onClickedButton={onClickedButton}
    />
  );
}

function ResetClipboardDataButton({
  disabled,
  onResetClipboardData,
  messages
}) {
  return (
    <Button
      label={messages.RESET_CLIPBOARD_BUTTON_LABEL}
      disabled={disabled}
      onClick={onResetClipboardData}
    />
  );
}

function HighlightAllButton({
  disabled,
  clickedButtonName,
  onHighlightAll,
  onClickedButton,
  constants,
  messages
}) {
  return (
    <Button
      name={constants.HIGHLIGHT_ALL_BUTTON_NAME}
      title={messages.HIGHLIGHT_ALL_BUTTON_TOOLTIP}
      label={messages.HIGHLIGHT_ALL_BUTTON_LABEL}
      disabled={disabled}
      clickedButtonName={clickedButtonName}
      onClick={onHighlightAll}
      onClickedButton={onClickedButton}
    />
  );
}

function ExtractEntryButton({
  disabled,
  clickedButtonName,
  onExtract,
  onClickedButton,
  constants,
  messages
}) {
  return (
    <Button
      name={constants.EXTRACT_BUTTON_NAME}
      title={messages.EXTRACT_BUTTON_TOOLTIP}
      label={messages.EXTRACT_BUTTON_LABEL}
      disabled={disabled}
      clickedButtonName={clickedButtonName}
      onClick={onExtract}
      onClickedButton={onClickedButton}
    />
  );
}

function RenameEntryButton({
  disabled,
  clickedButtonName,
  onRename,
  onClickedButton,
  constants,
  messages
}) {
  return (
    <Button
      name={constants.RENAME_BUTTON_NAME}
      title={messages.RENAME_BUTTON_TOOLTIP}
      label={messages.RENAME_BUTTON_LABEL}
      disabled={disabled}
      clickedButtonName={clickedButtonName}
      onClick={onRename}
      onClickedButton={onClickedButton}
    />
  );
}

function DeleteEntriesButton({
  disabled,
  clickedButtonName,
  onRemove,
  onClickedButton,
  constants,
  messages
}) {
  return (
    <Button
      name={constants.DELETE_BUTTON_NAME}
      title={messages.DELETE_BUTTON_TOOLTIP}
      label={messages.DELETE_BUTTON_LABEL}
      disabled={disabled}
      clickedButtonName={clickedButtonName}
      onClick={onRemove}
      onClickedButton={onClickedButton}
    />
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
  onShowAddFilesPicker,
  onClickedButton,
  constants,
  messages
}) {
  return (
    <Button
      name={constants.ADD_FILES_BUTTON_NAME}
      title={messages.ADD_FILES_BUTTON_TOOLTIP}
      label={messages.ADD_FILES_BUTTON_LABEL}
      clickedButtonName={clickedButtonName}
      onClick={onShowAddFilesPicker}
      onClickedButton={onClickedButton}
    />
  );
}

function ImportZipButton({
  clickedButtonName,
  onShowImportZipFilePicker,
  onClickedButton,
  constants,
  messages
}) {
  const { IMPORT_ZIP_BUTTON_NAME } = constants;

  function handleClick() {
    onShowImportZipFilePicker({
      description: messages.ZIP_FILE_DESCRIPTION_LABEL
    });
  }

  return (
    <Button
      name={IMPORT_ZIP_BUTTON_NAME}
      title={messages.IMPORT_ZIP_BUTTON_TOOLTIP}
      label={messages.IMPORT_ZIP_BUTTON_LABEL}
      clickedButtonName={clickedButtonName}
      onClick={handleClick}
      onClickedButton={onClickedButton}
    />
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

function BackButton({
  disabled,
  clickedButtonName,
  onNavigateBack,
  onClickedButton,
  constants,
  messages
}) {
  return (
    <Button
      name={constants.BACK_BUTTON_NAME}
      title={messages.BACK_BUTTON_TOOLTIP}
      label={messages.BACK_BUTTON_LABEL}
      ariaLabel={messages.GO_BACK_LABEL}
      disabled={disabled}
      clickedButtonName={clickedButtonName}
      onClick={onNavigateBack}
      onClickedButton={onClickedButton}
    />
  );
}

function ForwardButton({
  disabled,
  clickedButtonName,
  onNavigateForward,
  onClickedButton,
  constants,
  messages
}) {
  return (
    <Button
      name={constants.FORWARD_BUTTON_NAME}
      title={messages.FORWARD_BUTTON_TOOLTIP}
      label={messages.FORWARD_BUTTON_LABEL}
      ariaLabel={messages.GO_FORWARD_LABEL}
      disabled={disabled}
      clickedButtonName={clickedButtonName}
      onClick={onNavigateForward}
      onClickedButton={onClickedButton}
    />
  );
}

function Button({
  name,
  title,
  label,
  disabled,
  ariaLabel,
  clickedButtonName,
  onClick,
  onClickedButton
}) {
  let className;

  function handleAnimationEnd() {
    className = null;
    onClickedButton();
    onClick();
  }

  if (clickedButtonName && clickedButtonName === name) {
    className = "flashing-button";
  }
  return (
    <button
      className={className}
      title={title}
      disabled={disabled}
      aria-label={ariaLabel}
      onClick={onClick}
      onAnimationEnd={handleAnimationEnd}
    >
      {label}
    </button>
  );
}

export {
  CopyEntryButton,
  CutEntryButton,
  PasteEntryButton,
  ResetClipboardDataButton,
  HighlightAllButton,
  ExtractEntryButton,
  RenameEntryButton,
  DeleteEntriesButton,
  CreateFolderButton,
  AddFilesButton,
  ImportZipButton,
  ExportZipButton,
  ResetButton,
  OptionsButton,
  BackButton,
  ForwardButton
};
