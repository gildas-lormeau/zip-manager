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
  constants,
  messages
}) {
  return (
    <div className="button-bar button-bar-bottom">
      <div className="button-group">
        <CopyEntryButton
          disabled={disabledCopyButton}
          onCopy={onCopy}
          constants={constants}
          messages={messages}
        />
        <CutEntryButton
          disabled={disabledCutButton}
          onCut={onCut}
          constants={constants}
          messages={messages}
        />
        <PasteEntryButton
          disabled={disabledPasteButton}
          onPaste={onPaste}
          constants={constants}
          messages={messages}
        />
        <ResetClipboardDataButton
          disabled={disabledResetClipboardDataButton}
          onResetClipboardData={onResetClipboardData}
          constants={constants}
          messages={messages}
        />
      </div>
      <div className="button-group">
        <RenameEntryButton
          disabled={disabledRenameButton}
          onRename={onRename}
          constants={constants}
          messages={messages}
        />
        <DeleteEntryButton
          disabled={disabledDeleteButton}
          onRemove={onRemove}
          constants={constants}
          messages={messages}
        />
      </div>
    </div>
  );
}

function CopyEntryButton({ disabled, onCopy, constants, messages }) {
  return (
    <button
      onClick={onCopy}
      disabled={disabled}
      title={
        messages.SHORTCUT_LABEL + messages.CTRL_KEY_LABEL + constants.COPY_KEY
      }
    >
      {messages.COPY_BUTTON_LABEL}
    </button>
  );
}

function CutEntryButton({ disabled, onCut, constants, messages }) {
  return (
    <button
      onClick={onCut}
      disabled={disabled}
      title={
        messages.SHORTCUT_LABEL + messages.CTRL_KEY_LABEL + constants.CUT_KEY
      }
    >
      {messages.CUT_BUTTON_LABEL}
    </button>
  );
}

function PasteEntryButton({ disabled, onPaste, constants, messages }) {
  return (
    <button
      onClick={onPaste}
      disabled={disabled}
      title={
        messages.SHORTCUT_LABEL + messages.CTRL_KEY_LABEL + constants.PASTE_KEY
      }
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

function RenameEntryButton({ disabled, onRename, constants, messages }) {
  return (
    <button
      onClick={onRename}
      disabled={disabled}
      title={
        messages.SHORTCUT_LABEL + messages.CTRL_KEY_LABEL + constants.RENAME_KEY
      }
    >
      {messages.RENAME_BUTTON_LABEL}
    </button>
  );
}

function DeleteEntryButton({ disabled, onRemove, constants, messages }) {
  return (
    <button
      onClick={onRemove}
      disabled={disabled}
      title={
        messages.SHORTCUT_LABEL +
        constants.DELETE_KEYS.map((key) => key).join(
          messages.KEYS_SEPARATOR_LABEL
        )
      }
    >
      {messages.DELETE_BUTTON_LABEL}
    </button>
  );
}

export default BottomButtonBar;
