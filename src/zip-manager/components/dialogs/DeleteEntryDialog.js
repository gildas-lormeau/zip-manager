import Dialog from "./Dialog.js";

function DeleteEntryDialog({ data, onDeleteEntry, onClose, messages }) {
  return (
    <Dialog
      data={data}
      title={messages.DELETE_ENTRY_TITLE}
      cancelLabel={messages.DIALOG_CANCEL_BUTTON_LABEL}
      submitLabel={messages.DELETE_ENTRY_DIALOG_BUTTON_LABEL}
      onClose={onClose}
      onSubmit={onDeleteEntry}
    >
      {messages.DELETE_ENTRY_MESSAGE}
    </Dialog>
  );
}

export default DeleteEntryDialog;
