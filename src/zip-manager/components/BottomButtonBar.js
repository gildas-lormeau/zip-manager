import "./styles/BottomButtonBar.css";

let SHORTCUT_LABEL,
  CTRL_KEY_LABEL,
  COPY_KEY,
  CUT_KEY,
  PASTE_KEY,
  RENAME_KEY,
  DELETE_KEYS;

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
  ({
    COPY_KEY,
    CUT_KEY,
    PASTE_KEY,
    RENAME_KEY,
    DELETE_KEYS
  } = constants);
  ({
    SHORTCUT_LABEL,
    CTRL_KEY_LABEL
  } = messages);

  return (
    <div className="button-bar button-bar-bottom">
      <div className="button-group">
        <CopyEntryButton
          disabled={disabledCopyEntryButton}
          onCopyEntry={onCopyEntry}
        />
        <CutEntryButton
          disabled={disabledCutEntryButton}
          onCutEntry={onCutEntry}
        />
        <PasteEntryButton
          disabled={disabledPasteEntryButton}
          onPasteEntry={onPasteEntry}
        />
        <ResetClipboardDataButton
          disabled={disabledResetClipboardDataButton}
          onResetClipboardData={onResetClipboardData}
        />
      </div>
      <div className="button-group">
        <RenameEntryButton
          disabled={disabledRenameEntryButton}
          onRenameEntry={onRenameEntry}
        />
        <DeleteEntryButton
          disabled={disabledDeleteEntryButton}
          onDeleteEntry={onDeleteEntry}
        />
      </div>
    </div>
  );
}

function CopyEntryButton({ disabled, onCopyEntry }) {
  return (
    <button
      onClick={onCopyEntry}
      disabled={disabled}
      title={SHORTCUT_LABEL + CTRL_KEY_LABEL + COPY_KEY}
    >
      Copy
    </button>
  );
}

function CutEntryButton({ disabled, onCutEntry }) {
  return (
    <button
      onClick={onCutEntry}
      disabled={disabled}
      title={SHORTCUT_LABEL + CTRL_KEY_LABEL + CUT_KEY}
    >
      Cut
    </button>
  );
}

function PasteEntryButton({ disabled, onPasteEntry }) {
  return (
    <button
      onClick={onPasteEntry}
      disabled={disabled}
      title={SHORTCUT_LABEL + CTRL_KEY_LABEL + PASTE_KEY}
    >
      Paste
    </button>
  );
}

function ResetClipboardDataButton({ disabled, onResetClipboardData }) {
  return (
    <button onClick={onResetClipboardData} disabled={disabled}>
      Reset clipboard
    </button>
  );
}

function RenameEntryButton({ disabled, onRenameEntry }) {
  return (
    <button
      onClick={onRenameEntry}
      disabled={disabled}
      title={SHORTCUT_LABEL + CTRL_KEY_LABEL + RENAME_KEY}
    >
      Rename
    </button>
  );
}

function DeleteEntryButton({ disabled, onDeleteEntry }) {
  return (
    <button
      onClick={onDeleteEntry}
      disabled={disabled}
      title={DELETE_KEYS.map((key) => key).join(", ")}
    >
      Delete
    </button>
  );
}

export default BottomButtonBar;
