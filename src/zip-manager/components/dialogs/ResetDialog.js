import Dialog from "./Dialog.js";

function ResetDialog({ data, onReset, onClose, messages }) {
  return (
    <Dialog
      data={data}
      title={messages.RESET_TITLE}
      resetLabel={messages.DIALOG_CANCEL_BUTTON_LABEL}
      submitLabel={messages.RESET_DIALOG_BUTTON_LABEL}
      onClose={onClose}
      onSubmit={onReset}
    >
      <label>{messages.RESET_MESSAGE}</label>
    </Dialog>
  );
}

export default ResetDialog;
