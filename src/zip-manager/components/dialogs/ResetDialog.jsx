import Dialog from "./Dialog.jsx";

function ResetDialog({ data, onReset, onClose, messages }) {
  return (
    <Dialog
      data={data}
      title={messages.RESET_TITLE}
      cancelLabel={messages.DIALOG_CANCEL_BUTTON_LABEL}
      submitLabel={messages.RESET_DIALOG_BUTTON_LABEL}
      onClose={onClose}
      onSubmit={onReset}
    >
      {messages.RESET_MESSAGE}
    </Dialog>
  );
}

export default ResetDialog;
