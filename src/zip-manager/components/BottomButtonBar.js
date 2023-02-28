import "./styles/BottomButtonBar.css";

function BottomButtonBar({
  disabledCopyButton,
  disabledCutButton,
  disabledPasteButton,
  disabledResetClipboardDataButton,
  disabledRenameButton,
  disabledDeleteButton,
  onCopy,
  onCut,
  onPaste,
  onResetClipboardData,
  onRename,
  onRemove,
  messages
}) {
  return (
    <div
      className="button-bar button-bar-bottom"
      role="toolbar"
      aria-label="Highlighted entry commands"
    >
      <div className="button-group">
        <CopyEntryButton
          disabled={disabledCopyButton}
          onCopy={onCopy}
          messages={messages}
        />
        <CutEntryButton
          disabled={disabledCutButton}
          onCut={onCut}
          messages={messages}
        />
        <PasteEntryButton
          disabled={disabledPasteButton}
          onPaste={onPaste}
          messages={messages}
        />
        <ResetClipboardDataButton
          disabled={disabledResetClipboardDataButton}
          onResetClipboardData={onResetClipboardData}
          messages={messages}
        />
      </div>
      <div className="button-group">
        <RenameEntryButton
          disabled={disabledRenameButton}
          onRename={onRename}
          messages={messages}
        />
        <DeleteEntryButton
          disabled={disabledDeleteButton}
          onRemove={onRemove}
          messages={messages}
        />
      </div>
    </div>
  );
}

function CopyEntryButton({ disabled, onCopy, messages }) {
  return (
    <button
      onClick={onCopy}
      disabled={disabled}
      title={messages.COPY_BUTTON_TOOLTIP}
    >
      {messages.COPY_BUTTON_LABEL}
    </button>
  );
}

function CutEntryButton({ disabled, onCut, messages }) {
  return (
    <button
      onClick={onCut}
      disabled={disabled}
      title={messages.CUT_BUTTON_TOOLTIP}
    >
      {messages.CUT_BUTTON_LABEL}
    </button>
  );
}

function PasteEntryButton({ disabled, onPaste, messages }) {
  return (
    <button
      onClick={onPaste}
      disabled={disabled}
      title={messages.PASTE_BUTTON_TOOLTIP}
    >
      {messages.PASTE_BUTTON_LABEL}
    </button>
  );
}

function ResetClipboardDataButton({
  disabled,
  onResetClipboardData,
  messages
}) {
  return (
    <button onClick={onResetClipboardData} disabled={disabled}>
      {messages.RESET_CLIPBOARD_BUTTON_LABEL}
    </button>
  );
}

function RenameEntryButton({ disabled, onRename, messages }) {
  return (
    <button
      onClick={onRename}
      disabled={disabled}
      title={messages.RENAME_BUTTON_TOOLTIP}
    >
      {messages.RENAME_BUTTON_LABEL}
    </button>
  );
}

function DeleteEntryButton({ disabled, onRemove, messages }) {
  return (
    <button
      onClick={onRemove}
      disabled={disabled}
      title={messages.DELETE_BUTTON_TOOLTIP}
    >
      {messages.DELETE_BUTTON_LABEL}
    </button>
  );
}

export default BottomButtonBar;
