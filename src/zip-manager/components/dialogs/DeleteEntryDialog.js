import Dialog from "./Dialog.js";

function DeleteEntryDialog({ data, onDeleteEntry, onClose, messages }) {
  return (
    <Dialog
      data={data}
      title={messages.DELETE_ENTRY_TITLE}
      onClose={onClose}
      onSubmit={onDeleteEntry}
    >
      <p>
        <label>{messages.DELETE_ENTRY_MESSAGE}</label>
      </p>
      <div className="button-bar">
        <button type="reset">{messages.DIALOG_CANCEL_BUTTON_LABEL}</button>
        <button type="submit">
          {messages.DELETE_ENTRY_DIALOG_BUTTON_LABEL}
        </button>
      </div>
    </Dialog>
  );
}

export default DeleteEntryDialog;
