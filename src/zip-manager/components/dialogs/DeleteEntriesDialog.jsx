import Dialog from "./Dialog.jsx";

function DeleteEntriesDialog({ data, onDeleteEntries, onClose, messages }) {
  return (
    <Dialog
      data={data}
      title={messages.DELETE_ENTRIES_TITLE}
      cancelLabel={messages.DIALOG_CANCEL_BUTTON_LABEL}
      submitLabel={messages.DELETE_ENTRIES_DIALOG_BUTTON_LABEL}
      onClose={onClose}
      onSubmit={onDeleteEntries}
    >
      {messages.DELETE_ENTRIES_MESSAGE}
    </Dialog>
  );
}

export default DeleteEntriesDialog;
