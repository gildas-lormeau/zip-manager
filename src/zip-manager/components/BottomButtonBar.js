import "./styles/BottomButtonBar.css";

function BottomButtonBar({
  disabledCopyEntryButton,
  disabledCutEntryButton,
  disabledPasteEntryButton,
  disabledResetClipboardDataButton,
  disabledRenameEntryButton,
  disabledDeleteEntryButton,
  onCopyEntry,
  onCutEntry,
  onPasteEntry,
  onResetClipboardData,
  onRenameEntry,
  onDeleteEntry,
  constants,
  messages
}) {
  return (
    <div className="button-bar button-bar-bottom">
      <div className="button-group">
        <CopyEntryButton
          disabled={disabledCopyEntryButton}
          onCopyEntry={onCopyEntry}
          constants={constants}
          messages={messages}
        />
        <CutEntryButton
          disabled={disabledCutEntryButton}
          onCutEntry={onCutEntry}
          constants={constants}
          messages={messages}
        />
        <PasteEntryButton
          disabled={disabledPasteEntryButton}
          onPasteEntry={onPasteEntry}
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
          disabled={disabledRenameEntryButton}
          onRenameEntry={onRenameEntry}
          constants={constants}
          messages={messages}
        />
        <DeleteEntryButton
          disabled={disabledDeleteEntryButton}
          onDeleteEntry={onDeleteEntry}
          constants={constants}
          messages={messages}
        />
      </div>
    </div>
  );
}

function CopyEntryButton({ disabled, onCopyEntry, constants, messages }) {
  return (
    <button
      onClick={onCopyEntry}
      disabled={disabled}
      title={
        messages.SHORTCUT_LABEL + messages.CTRL_KEY_LABEL + constants.COPY_KEY
      }
    >
      {messages.COPY_LABEL}
    </button>
  );
}

function CutEntryButton({ disabled, onCutEntry, constants, messages }) {
  return (
    <button
      onClick={onCutEntry}
      disabled={disabled}
      title={
        messages.SHORTCUT_LABEL + messages.CTRL_KEY_LABEL + constants.CUT_KEY
      }
    >
      {messages.CUT_LABEL}
    </button>
  );
}

function PasteEntryButton({ disabled, onPasteEntry, constants, messages }) {
  return (
    <button
      onClick={onPasteEntry}
      disabled={disabled}
      title={
        messages.SHORTCUT_LABEL + messages.CTRL_KEY_LABEL + constants.PASTE_KEY
      }
    >
      {messages.PASTE_LABEL}
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
      {messages.RESET_CLIPBOARD_LABEL}
    </button>
  );
}

function RenameEntryButton({ disabled, onRenameEntry, constants, messages }) {
  return (
    <button
      onClick={onRenameEntry}
      disabled={disabled}
      title={
        messages.SHORTCUT_LABEL + messages.CTRL_KEY_LABEL + constants.RENAME_KEY
      }
    >
      {messages.RENAME_LABEL}
    </button>
  );
}

function DeleteEntryButton({ disabled, onDeleteEntry, constants, messages }) {
  return (
    <button
      onClick={onDeleteEntry}
      disabled={disabled}
      title={constants.DELETE_KEYS.map((key) => key).join(
        messages.KEYS_SEPARATOR_LABEL
      )}
    >
      {messages.SHORTCUT_LABEL + messages.DELETE_LABEL}
    </button>
  );
}

export default BottomButtonBar;
