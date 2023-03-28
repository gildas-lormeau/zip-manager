import Dialog from "./Dialog.js";

function ResetDialog({ data, onReset, onClose, messages }) {
  return (
    <Dialog
      data={data}
      title={messages.RESET_TITLE}
      onClose={onClose}
      onSubmit={onReset}
    >
      <p>
        <label>{messages.RESET_MESSAGE}</label>
      </p>
      <div className="button-bar">
        <button type="reset">{messages.DIALOG_CANCEL_BUTTON_LABEL}</button>
        <button type="submit">{messages.RESET_DIALOG_BUTTON_LABEL}</button>
      </div>
    </Dialog>
  );
}

export default ResetDialog;
