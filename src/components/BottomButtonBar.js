import "./styles/BottomButtonBar.css";

import {
  CTRL_KEY_LABEL,
  COPY_KEY,
  CUT_KEY,
  PASTE_KEY,
  RENAME_KEY,
  DELETE_KEYS
} from "./../business/constants.js";

function BottomButtonBar({
  selectedFolder,
  highlightedEntry,
  clipboardData,
  onCopyEntry,
  onCutEntry,
  onPasteEntry,
  onResetClipboardData,
  onRenameEntry,
  onDeleteEntry
}) {
  const actionDisabled =
    !highlightedEntry || highlightedEntry === selectedFolder.parent;

  return (
    <div className="button-bar button-bar-bottom">
      <div className="button-group">
        <CopyEntryButton disabled={actionDisabled} onCopyEntry={onCopyEntry} />
        <CutEntryButton disabled={actionDisabled} onCutEntry={onCutEntry} />
        <PasteEntryButton
          disabled={!clipboardData}
          onPasteEntry={onPasteEntry}
        />
        <ResetClipboardDataButton
          disabled={!clipboardData}
          onResetClipboardData={onResetClipboardData}
        />
      </div>
      <div className="button-group">
        <RenameEntryButton
          disabled={actionDisabled}
          onRenameEntry={onRenameEntry}
        />
        <DeleteEntryButton
          disabled={actionDisabled}
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
      title={CTRL_KEY_LABEL + COPY_KEY}
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
      title={CTRL_KEY_LABEL + CUT_KEY}
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
      title={CTRL_KEY_LABEL + PASTE_KEY}
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
      title={CTRL_KEY_LABEL + RENAME_KEY}
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
