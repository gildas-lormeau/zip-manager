import Dialog from "./Dialog.js";

function ErrorMessageDialog({ data, onClose, messages }) {
  return (
    <Dialog
      data={data}
      title={messages.ERROR_TITLE}
      submitLabel={messages.DIALOG_OK_BUTTON_LABEL}
      onClose={onClose}
    >
      <label>{data?.message}</label>
    </Dialog>
  );
}

export default ErrorMessageDialog;
